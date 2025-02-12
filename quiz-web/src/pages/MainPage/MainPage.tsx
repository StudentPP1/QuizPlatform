import { FC, useState } from "react";
import styles from "./MainPage.module.scss"
import { Modal } from "../../components/modal/Modal";
import LoginPage from "../LoginPage/LoginPage";
import Header from "../../components/header/Header";

const modules = [
  { title: "English: Verbs and Prepositions", terms: 49, user: "Quizlet", icon: "quizlet" },
  { title: "Repaso Ch.7", terms: 6, user: "meowselot", icon: "meow" },
  { title: "Argumentative Vocabulary", terms: 18, user: "Christine_Houck", icon: "christine" },
  { title: "Intro Biochemistry and Molecular Biology", terms: 36, user: "mwillispwillis", icon: "bio" },
  { title: "Geo Unit 2 Vocabulary", terms: 26, user: "Kimberly_Lashley3", icon: "geo" },
  { title: "SP3 Lección 2: En la ciudad", terms: 64, user: "Melissa_Brockman", icon: "spanish" },
];

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
              <h3 className={styles.roadmap__title}>Automated Reports & Widget Alerts</h3>
              <p className={styles.roadmap__text_block}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elementum nisi aliquet volutpat pellentesque
                volutpat est. Sapien in etiam vitae nibh nunc mattis imperdiet sed nullam. Vitae et, tortor pulvinar risus
                pulvinar sit amet.
              </p>
            </div>
            <div className={styles.roadmap__picture}>
              <img src="https://images.prismic.io/quizlet-web/ZuOCD7VsGrYSvUW5_UKUA1Flashcards.png?auto=format,compress" alt="picture roadmap" />
            </div>
          </div>

          <div className={styles.roadmap__item}>
            <div className={styles.roadmap__picture}>
              <img src="https://images.prismic.io/quizlet-web/ZuOCD7VsGrYSvUW5_UKUA1Flashcards.png?auto=format,compress" alt="picture roadmap" />
            </div>
            <div className={styles.roadmap__description}>
              <h3 className={styles.roadmap__title}>Automated Reports & Widget Alerts</h3>
              <p className={styles.roadmap__text_block}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elementum nisi aliquet volutpat pellentesque
                volutpat est. Sapien in etiam vitae nibh nunc mattis imperdiet sed nullam. Vitae et, tortor pulvinar risus
                pulvinar sit amet.
              </p>
              <button className={styles.register} onClick={() => setIsOpen(true)}>
                <span>Start</span>
              </button>
            </div>
          </div>

          <div className={styles.roadmap__item}>
            <div className={styles.roadmap__description}>
              <h3 className={styles.roadmap__title}>Automated Reports & Widget Alerts</h3>
              <p className={styles.roadmap__text_block}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elementum nisi aliquet volutpat pellentesque
                volutpat est. Sapien in etiam vitae nibh nunc mattis imperdiet sed nullam. Vitae et, tortor pulvinar risus
                pulvinar sit amet.
              </p>
              <button className={styles.register} onClick={() => setIsOpen(true)}>
                <span>Start</span>
              </button>
            </div>
            <div className={styles.roadmap__picture}>
              <img src="https://images.prismic.io/quizlet-web/ZuOCD7VsGrYSvUW5_UKUA1Flashcards.png?auto=format,compress" alt="picture roadmap" />
            </div>
          </div>

        </div>

        {/* Popular Quiz */}
        <div className={styles.wrapper}>
          <h2>Popular Quiz</h2>
          <div className={styles.modules_grid}>
            {modules.map((module, index) => (
              <div className={styles.module_card} key={index}>

                <h3>{module.title}</h3>

                <span className={styles.terms}>{module.terms} question</span>

                <div className={styles.user_info}>
                  <img className={styles.icon} src="https://i.pravatar.cc/40" />
                  <div>{module.user}</div>
                </div>

              </div>
            ))}
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