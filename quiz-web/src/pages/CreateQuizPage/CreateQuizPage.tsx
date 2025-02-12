import { FC, useState } from 'react';
import styles from "./CreateQuizPage.module.scss";
import { toast } from 'react-toastify';
import Wrapper from '../../components/wrapper/Wrapper';
import { QuizService } from '../../api/QuizService';
import { useNavigate } from 'react-router-dom';

type AnswerType = {
    id: number,
    text: string,
    isCorrect: boolean
}

type QuestionType = {
    id: number;
    text: string;
    answers: AnswerType[];
    image: null | string;
    isOpenEnded: boolean;
}

const CreateQuizPage: FC = () => {
    const navigate = useNavigate()
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [timeLimit, setTimeLimit] = useState<string>("");

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

    const updateQuestionText = (id: number, newText: string) => {
        setQuestions(
            questions.map((q) => (q.id === id ? { ...q, text: newText } : q))
        );
    };

    const handleImageUpload = (id: number, event: any) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setQuestions(
                questions.map((q) =>
                    q.id === id ? { ...q, image: imageUrl } : q
                )
            );
        }
    };

    const addAnswer = (questionId: number) => {
        setQuestions(
            questions.map((q: QuestionType) =>
                q.id === questionId
                    ? {
                        ...q,
                        answers: [...q.answers, { id: Date.now(), text: "", isCorrect: false }]
                    }
                    : q
            )
        );
    };

    const updateAnswerText = (questionId: number, answerId: number, newText: string) => {
        setQuestions(
            questions.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        answers: q.answers.map((a) =>
                            a.id === answerId ? { ...a, text: newText } : a
                        )
                    }
                    : q
            )
        );
    };

    const toggleCorrectAnswer = (questionId: number, answerId: number) => {
        setQuestions(
            questions.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        answers: q.answers.map((a) =>
                            a.id === answerId ? { ...a, isCorrect: !a.isCorrect } : a
                        )
                    }
                    : q
            )
        );
    };

    const removeQuestion = (id: number) => {
        setQuestions(questions.filter((q) => q.id !== id));
    };

    const removeAnswer = (questionId: number, answerId: number) => {
        setQuestions(
            questions.map((q) =>
                q.id === questionId
                    ? { ...q, answers: q.answers.filter((a) => a.id !== answerId) }
                    : q
            )
        );
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

    const saveModule = async () => {
        if (!handleTimeChange()) {
            toast.error("Time must be between 1 and 120 minutes!", { position: "top-right" });
        } else {
            if (validateQuestions()) {
                const quiz = {
                    title: title,
                    description: description,
                    numberOfTasks: questions.length,
                    timeLimit: Number.parseInt(timeLimit),
                    tasks: questions.map((question) => {
                        let type;
                        if (question.isOpenEnded) {
                            type = "text"
                        }
                        else {
                            if (question.answers.filter(answer => answer.isCorrect).map(answer => answer.text).length == 1) {
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
                    })
                }
                await QuizService.createQuiz(quiz).then((result) => {
                    console.log(result)
                    toast.success("Quiz saved!", { position: "top-right" });
                    navigate("/quizInfo/" + result.id)
                })
            }
        }
    };

    return (
        <Wrapper enabledFooter={false} enabledSearch={true}>
            <main className={styles.content}>
                <section className={styles.creating_content}>
                    <h1>Create quiz</h1>
                    <input
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder='Enter a title, for example, “Biology - Chapter 22: Evolution' />
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
                        <div key={question.id} className={styles.questionBlock}>
                            <div className={styles.questionHeader}>
                                <input
                                    type="text"
                                    value={question.text}
                                    onChange={(e) => updateQuestionText(question.id, e.target.value)}
                                    placeholder="Enter a question..."
                                />
                                <button
                                    className={styles.deleteQuestion}
                                    onClick={() => removeQuestion(question.id)}>
                                    🗑️ Delete
                                </button>
                            </div>

                            <label className={styles.imageUpload}>
                                📷 Load image
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(question.id, e)} />
                            </label>

                            {question.image && <img src={question.image} className={styles.imagePreview} />}

                            <div className={styles.answers}>
                                {question.answers.map((answer) => (
                                    <div key={answer.id} className={styles.answerItem}>
                                        <input
                                            type="text"
                                            value={answer.text}
                                            className={styles.answerInput}
                                            onChange={(e) =>
                                                updateAnswerText(question.id, answer.id, e.target.value)
                                            }
                                            placeholder="Answer..."
                                        />
                                        {!question.isOpenEnded &&
                                            <input
                                                type="checkbox"
                                                checked={answer.isCorrect}
                                                onChange={() => toggleCorrectAnswer(question.id, answer.id)}
                                            />
                                        }
                                        {question.answers.indexOf(answer) > 1
                                            ?
                                            <button
                                                className={styles.deleteAnswer}
                                                onClick={() => removeAnswer(question.id, answer.id)}>
                                                ❌
                                            </button>
                                            :
                                            <></>
                                        }
                                    </div>
                                ))}
                                {!question.isOpenEnded &&
                                    <div className={styles.button_wrapper}>
                                        <div
                                            className={styles.button}
                                            onClick={() => addAnswer(question.id)}>
                                            + answer
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    ))}

                    {questions.length > 0 && (
                        <div className={styles.button_wrapper}>
                            <button className={styles.button} onClick={saveModule}>Save</button>
                        </div>
                    )}
                </section>
            </main>
        </Wrapper>
    );
}

export default CreateQuizPage;
