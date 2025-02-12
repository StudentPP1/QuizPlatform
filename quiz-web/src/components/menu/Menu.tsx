import { FC } from "react";
import styles from "./Menu.module.scss";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../api/AuthService";

const Menu: FC<{ open: boolean }> = ({ open }) => {
  const navigate = useNavigate();

  return (
    open && (
      <div className={styles.userMenu}>
        <div className={styles.header}>
          <img src="https://i.pravatar.cc/40" className={styles.avatar}>
          </img>
          <div className={styles.userInfo}>
            <h3>aboba_abiba3</h3>
            <p>cumaboba988@gmail.com</p>
          </div>
        </div>
        <div className={styles.logout} onClick={async () => {
          await AuthService.logout().then(() => {
            localStorage.setItem("index", "2");
            navigate("/")
          })
        }}>Quit</div>
      </div>
    )

  )
}

export default Menu