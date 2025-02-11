import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateGoogleUserDto } from './dto/create-google-user.dto';
import { Review } from '../review/entities/review.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async findUserByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findUserById(id: string): Promise<User> {
    return await this.usersRepository.findOne({
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
      user.authorRating = averageRating;
      await this.usersRepository.save(user);
    }
  }
}
