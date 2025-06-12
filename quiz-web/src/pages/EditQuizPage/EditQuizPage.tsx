import { FC } from "react"
import { QuizEdit } from "../../models/quiz/QuizEdit"
import { QuizTask } from "../../models/quiz/QuizTask"
import { AnswerType } from "../../models/enums/AnswerType"
import { Navigate, useLocation } from "react-router-dom"
import { QuizNavigate } from "../../models/quiz/QuizNavigate"
import { QuestionType } from "../../models/enums/QuestionType"
import { Quiz } from "../../models/quiz/Quiz"
import { QuizNavigateEdit } from "../../models/quiz/QuizNavigateEdit"

const EditQuizPage: FC = () => {
    const location = useLocation();
    let counter = 0;
    const { quiz } = location.state as QuizNavigate;

    function mapToAnswerType(text: string, isCorrect: boolean): AnswerType {
        counter += 1;
        return {
            id: Date.now() + counter, text: text, isCorrect: isCorrect
        }
    }

    function mapToQuestionType(task: QuizTask): QuestionType {
        counter += 1;
        const correctAnswers = task.correctAnswers.map(text => mapToAnswerType(text, true));
        const answers = task.options
            ? task.options
                .filter((option) => !task.correctAnswers.includes(option))
                .map(text => mapToAnswerType(text, false))
            : [];
        return {
            id: Date.now() + counter,
            text: task.question,
            answers: correctAnswers.concat(answers),
            image: task.image,
            isOpenEnded: task.type === "text"
        }
    }

    function mapToQuizEdit(quiz: Quiz): QuizEdit {
        console.log("Mapping quiz to edit format:", quiz);
        const mappedQuiz = {
            id: quiz.id,
            questions: quiz.tasks.map(mapToQuestionType),
            title: quiz.title,
            description: quiz.description,
            timeLimit: quiz.timeLimit
        }
        console.log("Mapped quiz:", mappedQuiz);
        return mappedQuiz;
    }

    return (
        <Navigate to={"/create-quiz"} replace={true} state={{ quiz: mapToQuizEdit(quiz) } as QuizNavigateEdit} />
    )
}

export default EditQuizPage