import { AnswerType } from "./AnswerType";

export type QuestionType = {
    id: number;
    text: string;
    answers: AnswerType[];
    image: null | any;
    isOpenEnded: boolean;
}