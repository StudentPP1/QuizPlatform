import { FC } from "react"
import { Quiz } from "../../models/Quiz"
import { QuizEdit } from "../../models/QuizEdit"
import { QuestionType } from "../../models/QuestionType"
import { QuizTask } from "../../models/QuizTask"
import { AnswerType } from "../../models/AnswerType"
import { Navigate, useLocation } from "react-router-dom"
import { QuizNavigate } from "../../models/QuizNavigate"
import { QuizNavigateEdit } from "../../models/QuizNavigateEdit"

const EditQuizPage: FC = () => {
    const location = useLocation();
    const { quiz } = location.state as QuizNavigate;

    function mapToAnswerType(text: string, isCorrect: boolean): AnswerType {
        return {
            id: Date.now(), text: text, isCorrect: isCorrect
        }
    }

    function mapToQuestionType(task: QuizTask): QuestionType {
        const correctAnswers = task.correctAnswers.map(text => mapToAnswerType(text, true));
        const answers = task.options ? task.options.map(text => mapToAnswerType(text, false)) : [];
        return {
            id: task.id,
            text: task.question,
            answers: correctAnswers.concat(answers),
            image: task.image,
            isOpenEnded: task.type === "text"
        }
    }

    function mapToQuizEdit(quiz: Quiz): QuizEdit {
        return {
            id: quiz.id,
            questions: quiz.tasks.map(mapToQuestionType),
            title: quiz.title,
            description: quiz.description,
            timeLimit: quiz.timeLimit
        }
    }

    return (
        <Navigate to={"/create-quiz"} replace={true} state={{ quiz: mapToQuizEdit(quiz) } as QuizNavigateEdit } />
    )
}

export default EditQuizPage