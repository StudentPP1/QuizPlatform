import { FC, useEffect, useState } from "react";
import styles from "./scss/App.module.scss";
import { ToastContainer } from "react-toastify";
import { AuthContext } from "./context/context";
import Router from "./router/Router";
import { ACCESS_TOKEN_NAME } from "./constants/constants";
import { TokenService } from "./api/TokenService";

export const App: FC = () => {
  // TODO: start components
  const [isAuth, setIsAuth] = useState<boolean>(false);

  useEffect(() => {
    TokenService.refreshToken().then(() => {
      // TODO: set user in context
      // valid  sessionStorage.getItem(ACCESS_TOKEN_NAME) != null
      // if true => UserService.getUser => setUser()
    })
    setIsAuth(sessionStorage.getItem(ACCESS_TOKEN_NAME) != null)
  }, [])

  return (
    <div className={styles.app}>
      <ToastContainer theme="dark" style={{ zIndex: 1000 }} />
      <AuthContext.Provider value={{ isAuth, setIsAuth }}>
        <Router />
      </AuthContext.Provider>
    </div>
  )
}