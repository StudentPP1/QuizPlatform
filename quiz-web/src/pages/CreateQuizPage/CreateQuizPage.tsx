import { FC } from 'react';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from "./CreateQuizPage.module.scss";
import Wrapper from '../../components/wrapper/Wrapper';
import { QuizService } from '../../api/services/QuizService';
import QuizItem from './items/QuizItem';
import { QuizNavigateEdit } from '../../models/QuizNavigateEdit';
import { globalCache } from '../../hooks/useCachedFetch';
import { useQuizForm } from '../../hooks/useQuizForm';

const CreateQuizPage: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const quiz = (location.state as QuizNavigateEdit)?.quiz || null;

    const [formState, formActions] = useQuizForm(quiz);

    const handleSave = async () => {
        const validationError = formActions.validate();
        if (validationError) {
            toast.error(validationError, { position: "top-right" });
            return;
        }

        const formData = formActions.prepareFormData();
        // checks if quiz exists, if it does, true, otherwise false => !!quiz
        await QuizService.createQuiz(formData, !!quiz, quiz?.id).then((result) => {
            globalCache.delete("topQuizzes");
            toast.success(result.message, { position: "top-right" });
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
            navigate(`/quizInfo/${result.quizId}`);
        });
    };

    const handleDelete = async () => {
        if (!quiz) return;

        await QuizService.deleteQuiz(quiz.id).then((result) => {
            globalCache.delete("topQuizzes");
            toast.success(result.message, { position: "top-right" });
            navigate("/home");
        })
    };

    return (
        <Wrapper>
            <main className={styles.content}>
                <section className={styles.creating_content}>
                    <h1>{quiz ? "Edit" : "Create"} Quiz</h1>

                    <input
                        type="text"
                        value={formState.title}
                        onChange={(e) => formActions.updateField('title', e.target.value)}
                        placeholder='Enter a title, for example, "Biology - Chapter 22: Evolution"' />

                    <input
                        type="text"
                        value={formState.timeLimit}
                        onChange={(e) => formActions.updateField('timeLimit', e.target.value)}
                        placeholder='Time limit (1-120 minutes)'
                        className={styles.timeInput} />

                    <textarea
                        value={formState.description}
                        onChange={(e) => formActions.updateField('description', e.target.value)}
                        placeholder="Add description..." />

                    <div className={styles.button_wrapper}>
                        <button
                            type="button"
                            className={styles.button}
                            onClick={() => formActions.addQuestion(false)}>
                            Add Multiple Choice
                        </button>
                        <button
                            type="button"
                            className={styles.button}
                            onClick={() => formActions.addQuestion(true)}>
                            Add Open Question
                        </button>
                    </div>

                    {formState.questions.map((question) => (
                        <QuizItem
                            key={question.id}
                            question={question}
                            onQuestionChange={(updatedQuestion) =>
                                formActions.updateQuestion(question.id, updatedQuestion)
                            }
                            onDelete={() => formActions.deleteQuestion(question.id)}
                        />
                    ))}

                    {formState.questions.length > 0 && (
                        <div className={styles.button_wrapper}>
                            <button className={styles.button} onClick={handleSave}>Save</button>
                        </div>
                    )}
                    {quiz && (
                        <div className={styles.button_wrapper}>
                            <button className={styles.button} onClick={handleDelete}>Delete</button>
                        </div>
                    )}
                </section>
            </main>
        </Wrapper>
    );
};

export default CreateQuizPage;