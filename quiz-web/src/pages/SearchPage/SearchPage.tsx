import { FC, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Wrapper from "../../components/wrapper/Wrapper";
import styles from "./SearchPage.module.scss"
import Avatar from "../../components/avatar/Avatar";
import { QuizService } from "../../api/services/QuizService";
import { QuizDTO } from "../../models/QuizDTO";
import { usePaginatedData } from "../../hooks/usePaginatedFetch";
import { useObserver } from "../../hooks/useObserver";
import Loading from "../../components/loading/Loader";

const SearchPage: FC = () => {
  const navigate = useNavigate();
  const { text } = useParams<{ text: string }>();
  const lastElement = useRef<HTMLDivElement | null>(null);

  const { items: quizzes, isLoading } = usePaginatedData<QuizDTO>({
    fetchFunction: QuizService.search,
    observerTarget: lastElement,
    id: text,
    dependencies: [text],
    useObserverHook: useObserver
  });


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