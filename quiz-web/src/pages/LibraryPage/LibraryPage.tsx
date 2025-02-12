import { FC, useEffect, useState } from "react";
import styles from "./LibraryPage.module.scss";
import { useNavigate } from "react-router-dom";
import Wrapper from "../../components/wrapper/Wrapper";

export type QuizType = {
  title: string,
  terms: string,
  user: string,
  avatar: string
}
const LibraryPage: FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<QuizType[]>([]);
  const [tab, setTab] = useState<number>(1);

  useEffect(() => {
    if (tab === 1) {
      setQuizzes([
        { title: "English words", terms: "9 questions", user: "aboba_abiba3", avatar: "https://i.pravatar.cc/30" }
      ])
    } else {
      setQuizzes([
        { title: "Completed Quiz 1", terms: "15 questions", user: "user123", avatar: "https://i.pravatar.cc/31" },
        { title: "Completed Quiz 3", terms: "20 questions", user: "user456", avatar: "https://i.pravatar.cc/32" },
        { title: "Completed Quiz 4", terms: "15 questions", user: "user123", avatar: "https://i.pravatar.cc/31" },
        { title: "Completed Quiz 5", terms: "20 questions", user: "user456", avatar: "https://i.pravatar.cc/32" },
        { title: "Completed Quiz 6", terms: "15 questions", user: "user123", avatar: "https://i.pravatar.cc/31" },
        { title: "Completed Quiz 7", terms: "20 questions", user: "user456", avatar: "https://i.pravatar.cc/32" },
      ])
    }
  }, [tab])
  console.log(tab)
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
          {quizzes.map(({ title, terms, user, avatar }) => (
            <button
              className={styles.module_card}
              onClick={() => {
                localStorage.setItem("index", "0")
                navigate("/quizInfo/1")
              }}
            >
              <div className={styles.card_content}>
                <h3 className={styles.name_quest}>{title}</h3>
                <div className={styles.top_info}>
                  <span className={styles.term_count}>{terms}</span>
                </div>
                <div className={styles.user_info}>
                  <img src={avatar} alt="User Avatar" className={styles.user_avatar_small} />
                  <span className={styles.user_name}>{user}</span>
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



