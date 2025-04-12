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
import ProtectedRouters from "./ProtectedRouters";
import { useContext } from "react";
import { AuthContext } from "../context/context";

const Router = () => {
    const { user } = useContext(AuthContext);
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={user ? <HomePage /> : <MainPage />} />
                <Route element={<ProtectedRouters user={user} />}>
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/library" element={<LibraryPage />} />
                    <Route path="/create-quiz" element={<CreateQuizPage />} />
                    <Route path="/quizInfo/:id" element={<QuizInfoPage />} />
                    <Route path="/quiz" element={<QuizPage />} />
                    <Route path="/results" element={<ResultsPage />} />
                    <Route path="/authorInfo/:id" element={<AuthorPage />} />
                    <Route path="/search/:text" element={<SearchPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;