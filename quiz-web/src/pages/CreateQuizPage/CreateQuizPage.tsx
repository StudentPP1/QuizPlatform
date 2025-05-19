import { FC, useState } from 'react';
import styles from "./CreateQuizPage.module.scss";
import { toast } from 'react-toastify';
import Wrapper from '../../components/wrapper/Wrapper';
import { useLocation, useNavigate } from 'react-router-dom';
import { QuizService } from '../../api/services/QuizService';
import { QuestionType } from '../../models/QuestionType';
import QuizItem from './QuizItem';
import { QuizNavigateEdit } from '../../models/QuizNavigateEdit';

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
                toast.error("Fill in all the fields!", { position: "top-right" });
                return false;
            }
            if (!question.isOpenEnded && question.answers.some((answer) => !answer.text.trim()) === true) {
                toast.error("Fill in all the fields!", { position: "top-right" });
                return false;
            }
            if (!question.isOpenEnded && !question.answers.some((answer) => answer.isCorrect)) {
                toast.error("Every question should have at least one correct answer!", { position: "top-right" });
                return false;
            }
        }
        return true;
    };

    const handleTimeChange = () => {
        if (/^\d*$/.test(timeLimit)) {
            const numValue = parseInt(timeLimit, 10);
            if (!isNaN(numValue) && numValue >= 1 && numValue <= 120) {
                return true;
            }
        }
        return false;
    };

    const createQuestion = (question: QuestionType) => {
        let type;
        if (question.isOpenEnded) {
            type = "text"
        }
        else {
            if (question.answers
                .filter(answer => answer.isCorrect)
                .map(answer => answer.text)
                .length == 1
            ) {
                type = "single"
            }
            else {
                type = "multiple-choice"
            }
        }
        return {
            question: question.text,
            type: type,
            image: question.image,
            correctAnswers: question.answers
                .filter(answer => answer.isCorrect)
                .map(answer => answer.text)
            ,
            options: question.answers.map(answer => answer.text)
        }
    }

    const saveModule = async () => {
        if (!handleTimeChange()) {
            toast.error("Time must be between 1 and 120 minutes!", { position: "top-right" });
        } else {
            if (validateQuestions()) {
                const formData = new FormData();

                let quizData: any = {
                    title: title,
                    description: description,
                    numberOfTasks: questions.length,
                    timeLimit: Number.parseInt(timeLimit),
                    tasks: questions.map((question) => {
                        return createQuestion(question)
                    })
                }
                if (quiz?.id) {
                    quizData = { id: quiz.id, ...quizData };
                }

                for (let i = 0; i < quizData.tasks.length; i++) {
                    const element = quizData.tasks[i].image;
                    if (element) {
                        formData.append(`images[${i}]`, element);
                        quizData.tasks[i].image = element.fileName;
                    }
                }

                formData.append("quiz", JSON.stringify(quizData));

                await QuizService.createQuiz(formData, quiz != null).then((result) => {
                    console.log(result)
                    toast.success(result.message, { position: "top-right" });
                    navigate("/quizInfo/" + result.quizId)
                })

            }
        }
    };

    const deleteQuiz = async () => {
        if (quiz != null) {
            await QuizService.deleteQuiz(quiz.id).then((result) => {
                console.log(result)
                toast.success(result.message, { position: "top-right" });
                navigate("/home")
            })
        }
    };

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
                            <button className={styles.button} onClick={saveModule}>Save</button>
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