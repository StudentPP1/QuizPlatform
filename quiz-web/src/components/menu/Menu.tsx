import { FC } from "react";
import styles from "./Menu.module.scss";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../api/AuthService";
import { Creator } from "../../models/Creator";
import Avatar from "../avatar/Avatar";

const Menu: FC<{ open: boolean, user: Creator | null }> = ({ open, user }) => {
  const navigate = useNavigate();

  return (
    open && (
      <div className={styles.userMenu}>
        <div className={styles.header}>
          <Avatar avatarUrl={user?.avatarUrl} />
          <div className={styles.userInfo}>
            <h3>{user?.username}</h3>
            <p>{user?.email}</p>
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