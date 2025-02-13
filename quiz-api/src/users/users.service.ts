import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateGoogleUserDto } from './dto/create-google-user.dto';
import { Review } from '../review/entities/review.entity';
import { Request } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async findUserByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findUserById(id: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['quizResults'],
    });
  }

  async createUser<T extends CreateUserDto | CreateGoogleUserDto>(
    userDto: T,
    authProvider: 'local' | 'google',
  ): Promise<User> {
    const user = this.usersRepository.create({
      ...userDto,
      authProvider,
    });

    return this.usersRepository.save(user);
  }

  async getUserInfo(req: Request, userId?: string) {
    const userIdToUse = userId && userId.trim() !== '' ? userId : req.user.id;

    const user = await this.usersRepository.findOne({
      where: { id: userIdToUse },
      select: ['id', 'username', 'avatarUrl', 'rating', 'email'],
      relations: ['createdQuizzes', 'participatedQuizzes'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const userInfo = {
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      rating: user.rating,
      email: user.email,
      participatedQuizzes:
        user.participatedQuizzes?.map((quiz) => ({
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          numberOfTasks: quiz.numberOfTasks,
          timeLimit: quiz.timeLimit,
          rating: quiz.rating,
          creator: {
            id: quiz.creator?.id,
            username: quiz.creator?.username,
            avatarUrl: quiz.creator?.avatarUrl,
          },
          tasks: quiz.tasks,
        })) || [],
      createdQuizzes:
        user.createdQuizzes?.map((quiz) => ({
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          numberOfTasks: quiz.numberOfTasks,
          timeLimit: quiz.timeLimit,
          rating: quiz.rating,
          creator: {
            id: quiz.creator?.id,
            username: quiz.creator?.username,
            avatarUrl: quiz.creator?.avatarUrl,
          },
          tasks: quiz.tasks,
        })) || [],
    };

    return userInfo;
  }

  async updateAuthorRating(userId: string): Promise<void> {
    const reviews = await this.reviewRepository.find({
      where: { quiz: { creator: { id: userId } } },
    });

    if (reviews.length === 0) {
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (user) {
      user.rating = averageRating;
      await this.usersRepository.save(user);
    }
  }

  async getTopCreatorsInfo(limit: number) {
    const users = await this.usersRepository.find({
      select: ['id', 'username', 'avatarUrl', 'rating', 'email'],
      take: limit,
      relations: ['createdQuizzes', 'participatedQuizzes'],
    });

    return users.map((user) => ({
      userId: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      rating: user.rating,
      email: user.email,
      participatedQuizzes: user.participatedQuizzes,
      createdQuizzes: user.createdQuizzes,
    }));
  }
}
