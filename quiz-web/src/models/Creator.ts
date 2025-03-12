import { Quiz } from "./Quiz";

export type Creator = {
  userId: string;
  username: string;
  avatarUrl: string | null;
  rating: number;
  email: string;
  participatedQuizzes: Quiz[];
  createdQuizzes: Quiz[];
};
