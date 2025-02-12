import { FC, useState } from "react"
import styles from "./App.module.scss"
import { MainPage } from "./pages/MainPage/MainPage"
import { AuthContext } from "./context/context"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage/HomePage"
import CreateQuizPage from "./pages/CreateQuizPage/CreateQuizPage"
import { ToastContainer } from "react-toastify"
import QuizInfoPage from "./pages/QuizInfoPage/QuizInfoPage"
import Quiz from "./pages/Quiz/QuizPage/QuizPage"
import ResultsPage from "./pages/Quiz/ResultPage/ResultsPage"
import AuthorPage from "./pages/AuthorPage/AuthorPage"
import SearchPage from "./pages/SearchPage/SearchPage"
import LibraryPage from "./pages/LibraryPage/LibraryPage"

export const App: FC = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);

  return (
    <div className={styles.app}>
      <ToastContainer theme="dark" />
      <AuthContext.Provider value={{ isAuth, setIsAuth }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/create-quiz" element={<CreateQuizPage />} />
            <Route path="/quizInfo/:id" element={<QuizInfoPage />} />
            <Route path="/quiz/:id" element={<Quiz />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/authorInfo/:id" element={<AuthorPage />} />
            <Route path="/search/:text" element={<SearchPage />} />
            <Route path="/library" element={<LibraryPage />} />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  )
}