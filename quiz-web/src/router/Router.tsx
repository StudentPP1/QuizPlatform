import { useContext } from "react"
import { AuthContext, AuthState } from "../context/context"
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Router = () => {
    const { isAuth } = useContext<AuthState>(AuthContext);
    return (
        <BrowserRouter>
            <Routes>
                {/* <Route path="/" element={<MainPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/create-quiz" element={isAuth ? <CreateQuizPage /> : <MainPage />} />
                <Route path="/quizInfo/:id" element={isAuth ? <QuizInfoPage /> : <MainPage />} />
                <Route path="/quiz" element={isAuth ? <QuizPage /> : <MainPage />} />
                <Route path="/results" element={isAuth ? <ResultsPage /> : <MainPage />} />
                <Route path="/authorInfo/:id" element={isAuth ? <AuthorPage /> : <MainPage />} />
                <Route path="/search/:text" element={isAuth ? <SearchPage /> : <MainPage />} />
                <Route path="/library" element={isAuth ? <LibraryPage /> : <MainPage />} /> */}
            </Routes>
        </BrowserRouter>
    )
}

export default Router