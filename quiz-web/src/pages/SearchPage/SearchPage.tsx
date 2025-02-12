import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Wrapper from "../../components/wrapper/Wrapper";
import { Quiz } from "../../models/Quiz";
import styles from "./SearchPage.module.scss"
import Avatar from "../../components/avatar/Avatar";
import { QuizService } from "../../api/QuizService";

const SearchPage: FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const { text } = useParams<{ text: string }>();

  useEffect(() => {
    localStorage.setItem("index", "0")
    const search = async () => {
      if (text != null) {
        await QuizService.search(text).then((result) => {
          console.log(result)
          setQuizzes(result)
        })
      }
    }
    search()
  }, [])

  return (
    <Wrapper enabledSearch={true} enabledFooter={false}>

      <div className={styles.library_container}>
        <div className={styles.hot_bar}>
          <nav className={styles.nav_bar}>
            <ul>
              <li><h2>Found:</h2></li>
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
  )
}

export default SearchPage