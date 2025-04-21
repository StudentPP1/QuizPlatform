import { FC, useRef, useState, useMemo, useContext } from "react";
import styles from "./LibraryPage.module.scss";
import { useNavigate } from "react-router-dom";
import Wrapper from "../../components/wrapper/Wrapper";
import Avatar from "../../components/avatar/Avatar";
import { useObserver } from "../../hooks/useObserver";
import { CreatedQuizzesStrategy, ParticipatedQuizzesStrategy, QuizFetchStrategy } from "../../api/services/QuizFetchStrategy";
import { QuizDTO } from "../../models/QuizDTO";
import { AuthContext } from "../../context/context";

const LibraryPage: FC = () => {
  const {user} = useContext(AuthContext)
  const SIZE = 10;
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [tab, setTab] = useState(1);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(SIZE);
  const lastElement = useRef<HTMLDivElement | null>(null);
  const [quizzes, setQuizzes] = useState<QuizDTO[]>([]);
    
  // TODO: Task 6 => load more quizzes when the user scrolls down
  const strategy: QuizFetchStrategy = useMemo(() => {
    return tab === 1 ? new CreatedQuizzesStrategy() : new ParticipatedQuizzesStrategy();
  }, [tab]);

  useObserver(lastElement, isLoading, () => {
    setLoading(true);
    if (user == null) return;
    strategy.fetchQuizzes(user.userId, from, to).then((data) => {
      setQuizzes(prev => {
        if (prev) {
          return [...prev, ...data];
        } else {
          return data;
        }
      });
      setFrom(prev => prev + SIZE);
      setTo(prev => prev + SIZE);
    }).finally(() => setLoading(false));
  });

  function resetPagination() {
    setQuizzes([]);
    setFrom(0);
    setTo(SIZE);
  }

  return (
    <Wrapper>
      <div className={styles.library_container}>

        <div className={styles.hot_bar}>
          <nav className={styles.nav_bar}>
            <ul>
              <li className={tab === 1 ? styles.active : ''} onClick={() => { setTab(1); resetPagination(); }}>
                Created
              </li>
              <li className={tab === 2 ? styles.active : ''} onClick={() => { setTab(2); resetPagination(); }}>
                History
              </li>
            </ul>
          </nav>
        </div>

        <div className={styles.modules}>
          {quizzes?.map((quiz) => (
            <button key={quiz.id} className={styles.module_card} onClick={() => {
              localStorage.setItem("index", "0");
              navigate(`/quizInfo/${quiz.id}`);
            }}>
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

      <div ref={lastElement} className="last" />
    </Wrapper>
  );
};

export default LibraryPage;
