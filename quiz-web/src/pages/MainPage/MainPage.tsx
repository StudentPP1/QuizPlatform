import { FC, useState } from "react";
import styles from "./MainPage.module.scss"
import { Modal } from "../../components/modal/Modal";
import LoginPage from "../LoginPage/LoginPage";
import Header from "../../components/header/Header";

export const MainPage: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className={styles.container}>

      <Header enabledSearch={false}>
        <div className={styles.actions} onClick={() => setIsOpen(true)}>
          <span>Login</span>
        </div>
      </Header>

      <Modal isOpen={isOpen} children={<LoginPage setIsOpen={setIsOpen} />} />

      <main className={styles.main}>

        {/* Title */}
        <div className={styles.wrapper}>
          <div className={styles.header_title}>
            <h1>How do you want to do it?</h1>
            <p>
              Master any material with interactive flashcards, practice tests, and study sessions on QuizPlatform.
            </p>
            <button className={styles.register} onClick={() => setIsOpen(true)}>
              <span>Register free</span>
            </button>
          </div>
        </div>

        {/* Roadmap */}
        <div className={styles.roadmap__wrapper}>
          <div className={styles.roadmap__item}>
            <div className={styles.roadmap__description}>
              <h3 className={styles.roadmap__title}>
                Create Your Own Quests
              </h3>
              <p className={styles.roadmap__text_block}>
                Design unique quests by adding tasks, multimedia elements (text, images, videos), and different types of challenges, from open-ended questions to interactive object searches. Set time limits and challenge other players!
              </p>
            </div>
            <div className={styles.roadmap__picture}>
              <img src="https://ocdn.eu/pulscms-transforms/1/dfuk9kpTURBXy9kMjk5NGQzMzE4MjJmOTY3ODU3ZTJhMDUzZDZmNzg3MC5qcGeTlQMAzQFFzQoozQW2lQLNBLAAw8OTCaZiMDJlN2YG3gABoTAB/quiz.jpeg"
                alt="picture roadmap" />
            </div>
          </div>

          <div className={styles.roadmap__item}>
            <div className={styles.roadmap__picture}>
              <img src="https://files.oaiusercontent.com/file-ECv6FKuJF8mTHnEGQ7iqSU?se=2025-02-12T12%3A08%3A46Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D2111e58d-ef16-4fab-8310-ec3578f36f6c.webp&sig=I8HYlNZDI42DfGmFqKIoW/VgTAf7/K1PDK%2B%2BuTqcMMg%3D" alt="picture roadmap" />
            </div>
            <div className={styles.roadmap__description}>
              <h3 className={styles.roadmap__title}>Explore and Complete Quests</h3>
              <p className={styles.roadmap__text_block}>
                Navigate through engaging quests with an interactive task map. Track your progress in real-time and race against the clock for time-limited challenges!
              </p>
              <button className={styles.register} onClick={() => setIsOpen(true)}>
                <span>Start</span>
              </button>
            </div>
          </div>

          <div className={styles.roadmap__item}>
            <div className={styles.roadmap__description}>
              <h3 className={styles.roadmap__title}>Rate and Share Feedback</h3>
              <p className={styles.roadmap__text_block}>
                Evaluate quests and their creators, leave reviews, and comment on experiences. The rating system helps you discover the most exciting adventures made by other users. Join the questing community today! 🚀
              </p>
              <button className={styles.register} onClick={() => setIsOpen(true)}>
                <span>Start</span>
              </button>
            </div>
            <div className={styles.roadmap__picture}>
              <img src="https://thumbs.dreamstime.com/b/word-cloud-learn-concept-331092426.jpg" alt="picture roadmap" />
            </div>
          </div>

        </div>

        <div className={styles.wrapper}>
          <footer className={styles.footer_wrapper}>
            <div>
              <p>© 2025 QuizPlatform, Inc.</p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}