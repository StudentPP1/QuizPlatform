import { Quiz } from "./Quiz"

export type Creator = {
    userId: string,
    username: string,
    avatarUrl: string | null,
    quizzes: Quiz[],
    rating: number
}