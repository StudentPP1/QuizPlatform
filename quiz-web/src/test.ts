import { Creator } from "./models/Creator";
import { Quiz } from "./models/Quiz";
import { Review } from "./models/Review";

export const testQuiz: Quiz = {
  id: "id",
  title: "title",
  description: "description",
  numberOfTasks: 10,
  timeLimit: 120,
  rating: 5,
  creator: {
    id: "creatorId",
    username: "creatorUsername",
    avatarUrl: "https://i.pravatar.cc/40",
  },
  tasks: [
    {
      id: "1",
      type: "single",
      question: "Який колір сонця?",
      options: ["Червоний", "Синій", "Жовтий", "Зелений"],
      correctAnswers: ["Жовтий"],
      image: "https://images.prom.ua/1734007967_w600_h600_1734007967.jpg",
    },
    {
      id: "2",
      type: "multiple-choice",
      question: "Які міста є столицями країн?",
      options: ["Київ", "Лондон", "Одеса", "Берлін"],
      correctAnswers: ["Київ", "Лондон", "Берлін"],
    },
    {
      id: "3",
      type: "text",
      question: "Столиця України?",
      correctAnswers: ["Київ"],
    },
  ],
};

export const testCreator: Creator = {
  rating: 3,
  userId: "creatorId",
  username: "creatorUsername",
  avatarUrl: "https://i.pravatar.cc/40",
  quizzes: [testQuiz],
};

export const testReviews: Review[] = [
  {
    text: "nice!",
    rating: 4,
    creator: {
      id: "creatorId",
      username: "creatorUsername",
      avatarUrl: "https://i.pravatar.cc/40",
    },
  }
]
