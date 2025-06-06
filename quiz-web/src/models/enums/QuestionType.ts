import { AnswerType } from "./AnswerType";

export type QuestionType = {
    id: any;
    text: string;
    answers: AnswerType[];
    image: null | any;
    isOpenEnded: boolean;
}