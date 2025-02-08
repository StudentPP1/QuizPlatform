import { FC } from "react";
import styles from "./HomePage.module.scss";
import Sidebar from "../../components/sidebar/Sidebar";

const HomePage: FC = () => {
    return (
        <div className={styles.page_container}>
            {/* Header */}
            <header className={styles.header}>
                {/* Site Logo */}
                <div className={styles.logo}>QuizPlatform</div>

                {/* Search Input */}
                <div className={styles.search_box}>
                    <input type="text" placeholder="Search..." />
                </div>

                {/* User Avatar */}
                <div className={styles.user_avatar}>
                    <img src="https://i.pravatar.cc/40" alt="User Avatar" />
                </div>
            </header>
            <div className={styles.container}>
                <main className={styles.content}>
                    <Sidebar />

                    <section className={styles.popular}>
                        <h2>З найкращою оцінкою квести</h2>
                        <div className={styles.card_grid}>
                            <div className={styles.card}>Англійський - 170 термінів</div>
                            <div className={styles.card}>Наголоси - 232 терміни</div>
                            <div className={styles.card}>Full Blast 7 - 36 термінів</div>
                        </div>
                    </section>

                    <section className={styles.popular}>
                        <h2>З найкращою оцінкою автори</h2>
                        <div className={styles.card_grid}>
                            <div className={styles.card}>Англійський - 170 термінів</div>
                            <div className={styles.card}>Наголоси - 232 терміни</div>
                            <div className={styles.card}>Full Blast 7 - 36 термінів</div>
                        </div>
                    </section>

                    <section className={styles.recent}>
                        <h2>Нещодавні пройдені</h2>
                        <div className={styles.card}>english words - 9 термінів</div>
                        <div className={styles.card}>words from YouTube - 2 терміни</div>
                    </section>

                    <footer>
                        footer
                    </footer>
                </main>
            </div>
        </div>
    )
}

export default HomePage