import { FC, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Wrapper from "../../components/wrapper/Wrapper";
import styles from "./SearchPage.module.scss"
import Avatar from "../../components/avatar/Avatar";
import { QuizService } from "../../api/services/QuizService";
import { QuizDTO } from "../../models/QuizDTO";
import { useObserver } from "../../hooks/useObserver";
import Loading from "../../components/loading/Loader";
import { DEFAULT_PAGINATION_FROM, DEFAULT_PAGINATION_SIZE } from "../../constants/constants";

const SearchPage: FC = () => {
  const navigate = useNavigate();
  const { text } = useParams<{ text: string }>();
  const lastElement = useRef<HTMLDivElement | null>(null);
  const [quizzes, setQuizzes] = useState<QuizDTO[]>([])
  const [isLoading, setLoading] = useState(false);
  const [from, setFrom] = useState(DEFAULT_PAGINATION_FROM);
  const [to, setTo] = useState(DEFAULT_PAGINATION_SIZE);

  useEffect(() => {
    localStorage.setItem("index", "0");
    const fetchData = async () => {
      if (text) {
        const data = await QuizService.search(from, to, text);
        setQuizzes(data);
        setFrom(to + 1);
      }
    };

    fetchData();
  }, [text]);

  useObserver(lastElement, isLoading, async () => {
    if (isLoading) return;
    if (text == null) return;
    setLoading(true);
    await QuizService.search(from, to, text)
      .then((data) => {
        setQuizzes((prev) => [...prev, ...data]);
        setFrom((prev) => prev + DEFAULT_PAGINATION_SIZE);
        setTo((prev) => prev + DEFAULT_PAGINATION_SIZE);
      })
      .finally(() => setLoading(false));
  })

  return (
    <Wrapper>
      <div className={styles.library_container}>
        <div className={styles.hot_bar}>
          <nav className={styles.nav_bar}>
            <ul>
              <li><h2>Found:</h2></li>
            </ul>
          </nav>
        </div>
        <div className={styles.content_container}>
          {isLoading
            ? <Loading />
            : <div className={styles.modules}>
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
            </div>}
        </div>
        <div ref={lastElement} className="last" />
      </div>
    </Wrapper>
  )
}
export default SearchPage;