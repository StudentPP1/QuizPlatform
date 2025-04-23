import { Creator } from "./Creator"

export type QuizDTO = {
    id: string,
    title: string,
    numberOfTasks: number,
    creator: Creator,
    rating: number
}