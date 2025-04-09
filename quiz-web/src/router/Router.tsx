import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainPage } from "../pages/MainPage/MainPage";
import HomePage from "../pages/HomePage/HomePage";
import LibraryPage from "../pages/LibraryPage/LibraryPage";
import CreateQuizPage from "../pages/CreateQuizPage/CreateQuizPage";
import QuizInfoPage from "../pages/QuizInfoPage/QuizInfoPage";
import QuizPage from "../pages/Quiz/QuizPage/QuizPage";
import ResultsPage from "../pages/Quiz/ResultPage/ResultsPage";
import AuthorPage from "../pages/AuthorPage/AuthorPage";
import SearchPage from "../pages/SearchPage/SearchPage";
import { useContext } from "react";
import { AuthContext } from "../context/context";

const Router = () => {
    const { user } = useContext(AuthContext);
    // TODO: security routes
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={user ? <HomePage /> : <MainPage />} />
                <Route path="/home" element={user ? <HomePage /> : <MainPage />} />
                <Route path="/library" element={user ? <LibraryPage /> : <MainPage />} />
                <Route path="/create-quiz" element={user ? <CreateQuizPage /> : <MainPage />} />
                <Route path="/quizInfo/:id" element={user ? <QuizInfoPage /> : <MainPage />} />
                <Route path="/quiz" element={user ? <QuizPage /> : <MainPage />} />
                <Route path="/results" element={user ? <ResultsPage /> : <MainPage />} />
                <Route path="/authorInfo/:id" element={user ? <AuthorPage /> : <MainPage />} />
                <Route path="/search/:text" element={user ? <SearchPage /> : <MainPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router;