import { FC, useState } from "react"
import styles from "./App.module.scss"
import { MainPage } from "./pages/MainPage/MainPage"
import { AuthContext } from "./context/context"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage/HomePage"

export const App: FC = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);

  return (
    <div className={styles.app}>
      <AuthContext.Provider value={{isAuth, setIsAuth}}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainPage />}/>
            <Route path="/home" element={<HomePage />}/>
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  )
}