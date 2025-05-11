import { FC, useEffect, useRef, useState } from "react";
import styles from "./LibraryPage.module.scss";
import { useNavigate } from "react-router-dom";
import Wrapper from "../../components/wrapper/Wrapper";
import Avatar from "../../components/avatar/Avatar";
import { useObserver } from "../../hooks/useObserver";
import { CreatedQuizzesStrategy, ParticipatedQuizzesStrategy, QuizFetchStrategy } from "../../api/services/QuizFetchStrategy";
import { QuizDTO } from "../../models/QuizDTO";
import Loading from "../../components/loading/Loader";

const LibraryPage: FC = () => {
  const SIZE = 10;
  const lastElement = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState<QuizDTO[]>([]);
  const [strategy, setStrategy] = useState<QuizFetchStrategy>(new CreatedQuizzesStrategy())
  const [tab, setTab] = useState(1);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(SIZE);

  // TODO: + Task 6 => load more quizzes when the user scrolls down
  const fetchQuizzes = () => {
    setLoading(true);
    console.log("current: ", tab, strategy.constructor.name)
    strategy.fetchQuizzes(from, to).then((data) => {
      setQuizzes(prev => {
        console.log("prev: ", prev)
        console.dir("data: ", data)
        if (prev != data && data.length > 0) {
          return [...prev, ...data];
        } else {
          return prev;
        }
      });
      setFrom(prev => prev + SIZE);
      setTo(prev => prev + SIZE);
    }).finally(() => setLoading(false));
  }

  function resetPagination() {
    setQuizzes([])
    setFrom(1);
    setTo(SIZE);
    fetchQuizzes()
  }

  useEffect(() => {
    resetPagination()
  }, [tab])

  useObserver(lastElement, isLoading, () => {
    console.log("loading new quizzes...")
    fetchQuizzes();
  });

  return (
    <Wrapper>
      <div className={styles.library_container}>

        <div className={styles.hot_bar}>
          <nav className={styles.nav_bar}>
            <ul>
              <li className={tab === 1 ? styles.active : ''} onClick={() => {
                setStrategy(new CreatedQuizzesStrategy())
                setTab(1);
                resetPagination();
              }}>
                Created
              </li>
              <li className={tab === 2 ? styles.active : ''} onClick={() => {
                setStrategy(new ParticipatedQuizzesStrategy())
                setTab(2);
                resetPagination();
              }}>
                History
              </li>
            </ul>
          </nav>
        </div>

        <div className={styles.content_container}>
          {isLoading ? <Loading /> :
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
          }
        </div>

        <div ref={lastElement} className="last" />

      </div>
    </Wrapper>
  );
};

export default LibraryPage;
