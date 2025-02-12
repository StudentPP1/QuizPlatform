import { QuizTask } from "./QuizTask"

export type Quiz = {
    id: string,
    title: string,
    description: string,
    numberOfTasks: number,
    timeLimit: number,
    creator: {
      id: string,
      username: string,
    },
    tasks: QuizTask[]
}