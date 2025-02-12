import { FC, useEffect, useState } from "react"
import styles from "./App.module.scss"
import { MainPage } from "./pages/MainPage/MainPage"
import { AuthContext } from "./context/context"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import CreateQuizPage from "./pages/CreateQuizPage/CreateQuizPage"
import { ToastContainer } from "react-toastify"
import QuizInfoPage from "./pages/QuizInfoPage/QuizInfoPage"
import ResultsPage from "./pages/Quiz/ResultPage/ResultsPage"
import AuthorPage from "./pages/AuthorPage/AuthorPage"
import SearchPage from "./pages/SearchPage/SearchPage"
import LibraryPage from "./pages/LibraryPage/LibraryPage"
import QuizPage from "./pages/Quiz/QuizPage/QuizPage"
import HomePage from "./pages/HomePage/HomePage"

export const App: FC = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const tokenTimestamp = localStorage.getItem("tokenTimestamp");
    const tokenExpiry = 3600 * 1000; // 1 час в миллисекундах

    if (token && tokenTimestamp) {
      const expiryTime = parseInt(tokenTimestamp) + tokenExpiry;
      const now = Date.now();

      if (now < expiryTime) {
        setIsAuth(true);
        setTimeLeft(expiryTime - now);
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("tokenTimestamp");
        setIsAuth(false);
      }
    }
  }, []);

  useEffect(() => {
    if (isAuth) {
      const now = Date.now();
      localStorage.setItem("tokenTimestamp", now.toString());
      setTimeLeft(3600 * 1000);
    }
  }, [isAuth]);

  useEffect(() => {
    if (isAuth && timeLeft !== null) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev !== null && prev > 1000) {
            return prev - 1000;
          } else {
            clearInterval(interval);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("tokenTimestamp");
            setIsAuth(false);
            return null;
          }
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isAuth, timeLeft]);

  return (
    <div className={styles.app}>
      <ToastContainer theme="dark" style={{ zIndex: 1000 }} />
      <AuthContext.Provider value={{ isAuth, setIsAuth }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/create-quiz" element={<CreateQuizPage />} />
            <Route path="/quizInfo/:id" element={<QuizInfoPage />} />
            <Route path="/quiz" element={<QuizPage />} />
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