import { FC, useEffect, useState } from "react";
import styles from "./scss/App.module.scss";
import { ToastContainer } from "react-toastify";
import { AuthContext } from "./context/context";
import Router from "./router/Router";
import { refreshToken } from "./utils/refreshToken";
import { ACCESS_TOKEN_NAME } from "./constants/constants";

export const App: FC = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);

  useEffect(() => {
    refreshToken();
    if (sessionStorage.getItem(ACCESS_TOKEN_NAME) != null) {
      setIsAuth(true)
    }
    else {
      setIsAuth(false)
    }
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