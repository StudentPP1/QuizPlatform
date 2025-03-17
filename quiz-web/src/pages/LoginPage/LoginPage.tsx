import { FC, useContext, useState } from "react";
import { AuthService } from "../../api/AuthService";
import styles from "./LoginPage.module.scss";
import { useNavigate } from "react-router-dom";
import { AuthContext, AuthState } from "../../context/context";
import { ApiWrapper } from "../../api/utils/ApiWrapper";

const LoginPage: FC<{ setIsOpen: any }> = ({ setIsOpen }) => {
  const { setUser } = useContext<AuthState>(AuthContext);
  const [isLogin, setIsLogin] = useState<boolean>();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const authenticate = (result: any) => {
    setUser(result.user)
    localStorage.setItem("accessToken", result.accessToken)
    setIsOpen(false)
    navigate("/home")
  }

  const login = async () => {
    ApiWrapper.call(
      AuthService.login,
      (result: any) => { authenticate(result) },
      [email, password])
  }

  const register = async () => {
    ApiWrapper.call(
      AuthService.register,
      (result: any) => { authenticate(result) },
      [username, email, password])
  }

  const google = async () => {
    await AuthService.google()
  }

  const clearForm = () => {
    setUsername("")
    setEmail("")
    setPassword("")
    setShowPassword(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.image}></div>
      </div>

      <div className={styles.right}>
        <div className={styles.close_button_container}>
          <div></div>
          <div className={styles.close_button} onClick={() => setIsOpen(false)}>X</div>
        </div>
        <div className={styles.right_content}>
          <div>
            <div className={styles.login_buttons}>
              <span onClick={() => {
                clearForm()
                setIsLogin(false)
              }}>
                Register
              </span>
              <span onClick={() => {
                clearForm()
                setIsLogin(true)
              }}>
                Login
              </span>
            </div>

            <div className={styles.social_container}>
              <div className={styles.google} onClick={() => google()}>
                <img
                  className={styles.img}
                  alt="" src="../google.png"
                />
                <span>Continue with Google</span>
              </div>
            </div>

            <div className={styles.form_container}>

              {!isLogin
                ?
                <div className={styles.input_container}>
                  <input
                    placeholder="Enter username"
                    type="text"
                    value={username}
                    onChange={event => setUsername(event.target.value)}
                  />
                </div>
                : <></>}

              <div className={styles.input_container}>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                />
              </div>

              <div className={styles.input_container}>
                <div className={styles.password_container}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                  />
                  <div>
                    <button
                      onClick={(event) => {
                        event.preventDefault()
                        setShowPassword(!showPassword)
                      }}
                    >
                      <img
                        className={styles.img}
                        src={showPassword ? "../../../public/close-eye.svg" : "../../../public/eye.svg"}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.input_container}>
                <button
                  className={styles.login}
                  onClick={(event) => {
                    event.preventDefault()
                    isLogin ? login() : register()
                  }}
                >
                  {isLogin ? "Login" : "Register"}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div >
  );
}

export default LoginPage