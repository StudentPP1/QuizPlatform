import { FC } from 'react'
import styles from "./Footer.module.scss"

const Footer: FC = () => {
  return (
    <footer className={styles.wrapper}>
        <div className={styles.footer}>
          <p>© 2025 QuizPlatform, Inc.</p>
        </div>
    </footer>
  )
}

export default Footer