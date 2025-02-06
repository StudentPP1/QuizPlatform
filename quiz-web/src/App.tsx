import { FC, useState } from "react"
import styles from "./scss/App.module.scss"
import { AuthService } from "./api/AuthService";

// TODO: validation & scss styles
export const App: FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const login = () => {
    AuthService.login(email, password)
  }

  const register = () => {
    AuthService.register(username, email, password)
  }

  const google = () => {
    AuthService.google()
  }

  const clearForm = () => {
    setUsername("")
    setEmail("")
    setPassword("")
    setShowPassword(false)
  }

  return (
    <div className={styles.app}>

      <div>
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

      <form>
        {!isLogin
          ?
          <div>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={event => setUsername(event.target.value)}
            />
          </div>
          :
          <div></div>
        }

        <div>
          <label>Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            required
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
          <button
            onClick={(event) => {
              event.preventDefault()
              setShowPassword(!showPassword)
            }}
            className={styles.password_button}
          >
            <img
              className={styles.img}
              alt="" src="../public/eye.svg"
            />
          </button>
        </div>

        <div>
          <button
            onClick={(event) => {
              event.preventDefault()
              if (isLogin) {
                login()
              } else {
                register()
              }
            }}
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </div>
      </form>

      <div className={styles.google_box} onClick={() => google()}>
        <img
          className={styles.img}
          alt="" src="../public/google.png"
        />
        <span>Continue with Google</span>
      </div>
    </div>
  )
}