import { FC, useEffect, useState } from "react";
import styles from "./LibraryPage.module.scss";
import { useNavigate } from "react-router-dom";
import Wrapper from "../../components/wrapper/Wrapper";
import { Quiz } from "../../models/Quiz";
import Avatar from "../../components/avatar/Avatar";
import { UserService } from "../../api/UserService";

const LibraryPage: FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [tab, setTab] = useState<number>(1);

  useEffect(() => {
    const getCompeted = async () => {
      await UserService.getUser().then((result) => {
        console.log("competed", result)
        setQuizzes(result.createdQuizzes)
      })
    }
    const getHistory = async () => {
      await UserService.getUser().then((result) => {
        console.log("history", result)
        setQuizzes(result.participatedQuizzes)
      })
    }
    if (tab === 1) {
      getCompeted()
    } else {
      getHistory()
    }
  }, [tab])


  return (
    <Wrapper enabledFooter={false} enabledSearch={true}>
      <div className={styles.library_container}>

        <div className={styles.hot_bar}>
          <nav className={styles.nav_bar}>
            <ul>
              <li
                className={tab === 1 ? styles.active : ''}
                onClick={() => setTab(1)}
              >Created</li>
              <li
                className={tab === 2 ? styles.active : ''}
                onClick={() => setTab(2)}
              >History</li>
            </ul>
          </nav>
        </div>

        <div className={styles.modules}>
          {quizzes.map((quiz) => (
            <button
              className={styles.module_card}
              onClick={() => {
                localStorage.setItem("index", "0")
                navigate(`/quizInfo/${quiz.id}`)
              }}
            >
              <div className={styles.card_content}>
                <h3 className={styles.name_quest}>{quiz.title}</h3>
                <div className={styles.top_info}>
                  <span className={styles.term_count}>{quiz.numberOfTasks} questions</span>
                </div>
                <div className={styles.author}>
                  <Avatar avatarUrl={quiz.creator.avatarUrl} />
                  <span className={styles.name}>{quiz.creator.username}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

export default LibraryPage;



