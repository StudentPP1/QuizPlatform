import { FC, useState } from "react";
import styles from "./CreateQuizPage.module.scss";
import { toast } from "react-toastify";
import Wrapper from "../../components/wrapper/Wrapper";
import { useNavigate } from "react-router-dom";
import { QuestionType } from "../../models/QuestionType";
import { QuizService } from "../../api/services/QuizService";
import QuestionItem from "../../components/createQuizItems/QuestionItem/QuestionItem";

const CreateQuizPage: FC = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [timeLimit, setTimeLimit] = useState<string>("");

    const updateQuestion = (id: number, newData: Partial<QuestionType>) => {
        setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...newData } : q)));
    };

    const addQuestion = (isOpenEnded: boolean = false) => {
        setQuestions((prev) => [
            ...prev,
            {
                id: Date.now(),
                text: "",
                answers: isOpenEnded
                    ? [{ id: Date.now(), text: "", isCorrect: true }]
                    : [
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

    const saveQuestion = async () => {
        const quiz = {
            title,
            description,
            numberOfTasks: questions.length,
            timeLimit: Number(timeLimit),
            tasks: questions.map(({ text, isOpenEnded, answers, image }) => ({
                question: text,
                type: isOpenEnded
                    ? "text"
                    : answers.filter((a) => a.isCorrect).length === 1
                        ? "single"
                        : "multiple-choice",
                image,
                correctAnswers: answers.filter((a) => a.isCorrect).map((a) => a.text),
                options: answers.map((a) => a.text)
            }))
        };

        await QuizService.createQuiz(quiz).then((result) => {
            console.log(result)
            toast.success(result.message, { position: "top-right" });
            navigate("/quizInfo/" + result.quizId)
        }).catch(() => {
            toast.error("Error saving quiz!", { position: "top-right" })
        })
    }

    const saveModule = async () => {
        if (!handleTimeChange()) {
            toast.error("Time must be between 1 and 120 minutes!", { position: "top-right" });
        } else {
            if (validateQuestions()) {
                saveQuestion()
            }
        }
    };

    return (
        <Wrapper>
            <main className={styles.content}>
                <section className={styles.creating_content}>
                    <h1>Create Quiz</h1>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title..." />
                    <input type="text" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} placeholder="Time (minutes)" className={styles.timeInput} />
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add description..." />

                    <div className={styles.button_wrapper}>
                        <button className={styles.button} onClick={() => addQuestion(false)}>+ Question (with answers)</button>
                        <button className={styles.button} onClick={() => addQuestion(true)}>+ Open-ended question</button>
                    </div>

                    {/* create question -> check -> if correct -> safe & update state */}
                    {questions.map((question) => (
                        <QuestionItem
                            key={question.id}
                            question={question}
                            removeQuestion={(id) => setQuestions((prev) => prev.filter((q) => q.id !== id))}
                            saveQuestion={(id, text, image, answers) => updateQuestion(id, { answers: answers, text: text, image: image })}
                        />
                    ))}

                    <button className={styles.button} onClick={saveModule}>Save</button>
                </section>
            </main>
        </Wrapper>
    );
};

export default CreateQuizPage;