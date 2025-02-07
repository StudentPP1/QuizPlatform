import { FC } from "react"
import styles from "./App.module.scss"
import {MainPage} from "./pages/MainPage/MainPage"

export const App: FC = () => {
  return (
    <div className={styles.app}>
      <MainPage/>  
    </div>
  )
}