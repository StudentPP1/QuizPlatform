import { CreatorDTO } from "./CreatorDTO"

export type QuizDTO = {
    id: string,
    title: string,
    numberOfTasks: number,
    creator: CreatorDTO
}