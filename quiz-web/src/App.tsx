import { FC, useEffect, useState } from "react";
import styles from "./scss/App.module.scss";
import { ToastContainer } from "react-toastify";
import { AuthContext } from "./context/context";
import Router from "./router/Router";
import { ACCESS_TOKEN_NAME } from "./constants/constants";
import { TokenService } from "./api/TokenService";
import { Creator } from "./models/Creator";
import { ApiWrapper } from "./api/utils/ApiWrapper";
import { UserService } from "./api/UserService";

export const App: FC = () => {
  // TODO: test login & go to do user library
  const [user, setUser] = useState<Creator | null>(null);

  useEffect(() => {
    TokenService.refreshToken().then(() => {
      if (sessionStorage.getItem(ACCESS_TOKEN_NAME) != null) {
        ApiWrapper.call(
          UserService.getUser,
          (result: any) => { setUser(result) },
          [],
          () => { setUser(null) }
        )
      }
    })
  }, [])

  return (
    <div className={styles.app}>
      <ToastContainer theme="dark" style={{ zIndex: 1000 }} />
      <AuthContext.Provider value={{ user, setUser }}>
        <Router />
      </AuthContext.Provider>
    </div>
  )
}