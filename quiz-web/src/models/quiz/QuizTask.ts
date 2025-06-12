export type QuizTask = {
    id: string,
    question: string,
    type: string, // text | multiple-choice | single
    image?: string,
    correctAnswers: string[],
    options?: string[],
}