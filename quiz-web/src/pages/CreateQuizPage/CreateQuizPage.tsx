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

    const saveModule = async () => {
        if (!questions.length) {
            toast.error("Add at least one question!", { position: "top-right" });
            return;
        }

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

        QuizService.createQuiz(quiz).then((result: any) => {
            toast.success("Quiz saved!", { position: "top-right" });
            navigate("/quizInfo/" + result.id)
        }).catch(() => {
            toast.error("Error saving quiz!", { position: "top-right" })
        })
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

                    {questions.map((question) => (
                        <QuestionItem
                            key={question.id}
                            question={question}
                            onTextChange={(text) => updateQuestion(question.id, { text })}
                            onImageUpload={(e) => updateQuestion(question.id, { image: URL.createObjectURL(e.target.files![0]) })}
                            onRemove={() => setQuestions((prev) => prev.filter((q) => q.id !== question.id))}
                            onAddAnswer={() => updateQuestion(question.id, { answers: [...question.answers, { id: Date.now(), text: "", isCorrect: false }] })}
                            onUpdateAnswer={(aId, text) => updateQuestion(question.id, { answers: question.answers.map((a) => (a.id === aId ? { ...a, text } : a)) })}
                            onToggleCorrectAnswer={(aId) => updateQuestion(question.id, { answers: question.answers.map((a) => (a.id === aId ? { ...a, isCorrect: !a.isCorrect } : a)) })}
                            onRemoveAnswer={(aId) => updateQuestion(question.id, { answers: question.answers.filter((a) => a.id !== aId) })}
                        />
                    ))}

                    <button className={styles.button} onClick={saveModule}>Save</button>
                </section>
            </main>
        </Wrapper>
    );
};

export default CreateQuizPage;