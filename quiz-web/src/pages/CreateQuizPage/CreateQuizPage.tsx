import { FC, useState } from 'react';
import styles from "./CreateQuizPage.module.scss";
import { toast } from 'react-toastify';
import Wrapper from '../../components/wrapper/Wrapper';
import { useLocation, useNavigate } from 'react-router-dom';
import { QuizService } from '../../api/services/QuizService';
import { QuestionType } from '../../models/QuestionType';
import QuizItem from './QuizItem';
import { QuizNavigateEdit } from '../../models/QuizNavigateEdit';
import { globalCache } from '../../hooks/useCachedFetch';

const CreateQuizPage: FC = () => {
    const location = useLocation();
    let quiz = null;
    if (location.state) {
        quiz = (location.state as QuizNavigateEdit).quiz;
    }
    const navigate = useNavigate()
    const [questions, setQuestions] = useState<QuestionType[]>(quiz?.questions || []);
    const [title, setTitle] = useState<string>(quiz?.title || "")
    const [description, setDescription] = useState<string>(quiz?.description || "")
    const [timeLimit, setTimeLimit] = useState<string>(quiz?.timeLimit.toString() || "");

    const showToast = (message: string): boolean => {
        toast.error(message, { position: "top-right" });
        return false;
    };

    const addQuestion = (isOpenEnded: boolean = false) => {
        setQuestions([
            ...questions,
            {
                id: Date.now(),
                text: "",
                answers: isOpenEnded ? [
                    { id: Date.now(), text: "", isCorrect: true }
                ] : [
                    { id: Date.now(), text: "", isCorrect: false },
                    { id: Date.now() + 1, text: "", isCorrect: false }
                ],
                image: null,
                isOpenEnded
            }
        ]);
    };

    const validateQuestions = () => {
        for (const question of questions) {
            if (!question.text.trim()) {
                return showToast("Fill in all the fields!");
            }
            if (!question.isOpenEnded && question.answers.some((answer) => !answer.text.trim()) === true) {
                return showToast("Fill in all the fields!");
            }
            if (!question.isOpenEnded && !question.answers.some((answer) => answer.isCorrect)) {
                return showToast("Every question should have at least one correct answer!");
            }
        }
        return true;
    };

    const isTimeValid = () => {
        const num = parseInt(timeLimit, 10);
        return /^\d+$/.test(timeLimit) && !isNaN(num) && num >= 1 && num <= 120;
    };

    const transformQuestion = (question: QuestionType) => {
        const { text, answers, image, isOpenEnded } = question;
        const type = isOpenEnded
            ? "text"
            : answers.filter(a => a.isCorrect).length === 1
                ? "single"
                : "multiple-choice";
        return {
            question: text,
            type,
            image,
            correctAnswers: answers.filter(a => a.isCorrect).map(a => a.text),
            options: answers.map(a => a.text)
        };
    };

    const prepareFormData = () => {
        const formData = new FormData();
        const tasks = questions.map(transformQuestion);

        tasks.forEach((task, i) => {
            const file = questions[i].image;
            if (file) {
                formData.append(`images[${i}]`, file);
                task.image = file.fileName;
            }
        });

        const quizData = {
            ...(quiz?.id && { id: quiz.id }),
            title,
            description,
            timeLimit: parseInt(timeLimit, 10),
            tasks
        };

        console.log("quiz: ", quizData)
        formData.append("quiz", JSON.stringify(quizData));
        return formData;
    };

    const handleSave = async () => {
        if (!isTimeValid()) return showToast("Time must be between 1 and 120 minutes!");
        if (!validateQuestions()) return;
        const formData = prepareFormData();
        await QuizService.createQuiz(formData, quiz != null, quiz?.id).then((result) => {
            globalCache.delete("topQuizzes");
            console.log("Delete cache topQuizzes: ", JSON.stringify(globalCache));
            toast.success(result.message, { position: "top-right" });
            navigate("/quizInfo/" + result.quizId)
        });
    };

    const deleteQuiz = async () => {
        if (!quiz) return;
        await QuizService.deleteQuiz(quiz.id).then((result) => {
            globalCache.delete("topQuizzes");
            console.log("Delete cache topQuizzes: ", JSON.stringify(globalCache));
            toast.success(result.message, { position: "top-right" });
            navigate("/home")
        })
    }

    return (
        <Wrapper>
            <main className={styles.content}>
                <section className={styles.creating_content}>
                    <h1>{quiz ? "Edit" : "Create"} quiz</h1>
                    <input
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder='Enter a title, for example, "Biology - Chapter 22: Evolution"' />
                    <input
                        type="text"
                        value={timeLimit}
                        onChange={(event) => setTimeLimit(event.target.value)}
                        placeholder='Time (minutes)'
                        className={styles.timeInput} />
                    <textarea
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Add description..." />
                    <div className={styles.button_wrapper}>
                        <button
                            className={styles.button} onClick={() => addQuestion(false)}>
                            + question (with answers)
                        </button>

                        <button
                            className={styles.button} onClick={() => addQuestion(true)}>
                            + open-ended question
                        </button>
                    </div>

                    {questions.map((question) => (
                        <QuizItem
                            question={question}
                            questions={questions}
                            setQuestions={setQuestions} />
                    ))}

                    {questions.length > 0 && (
                        <div className={styles.button_wrapper}>
                            <button className={styles.button} onClick={handleSave}>Save</button>
                        </div>
                    )}
                    {quiz && (
                        <div className={styles.button_wrapper}>
                            <button className={styles.button} onClick={deleteQuiz}>Delete</button>
                        </div>
                    )}
                </section>
            </main>
        </Wrapper>
    );
}

export default CreateQuizPage;