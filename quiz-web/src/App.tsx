import { FC, useState } from "react";
import styles from "./scss/App.module.scss";
import { ToastContainer } from "react-toastify";
import { AuthContext } from "./context/context";
import Router from "./router/Router";

export const App: FC = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);

  return (
    <div className={styles.app}>
      <ToastContainer theme="dark" style={{ zIndex: 1000 }} />
      <AuthContext.Provider value={{ isAuth, setIsAuth }}>
        <Router />
      </AuthContext.Provider>
    </div>
  )
}