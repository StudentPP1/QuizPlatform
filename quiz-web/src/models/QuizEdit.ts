import { QuestionType } from "./QuestionType";

export type QuizEdit = {
    id: string;
    questions: QuestionType[]
    title: string;
    description: string;
    timeLimit: number;
}