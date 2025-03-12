import { QuizTask } from "./QuizTask"

export type Quiz = {
    id: string,
    title: string,
    description: string,
    numberOfTasks: number,
    timeLimit: number,
    rating: number,
    tasks: QuizTask[]
}