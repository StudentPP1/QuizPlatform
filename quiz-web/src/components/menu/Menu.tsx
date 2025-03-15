import { FC, useContext } from "react";
import styles from "./Menu.module.scss";
import { AuthService } from "../../api/AuthService";
import { Creator } from "../../models/Creator";
import Avatar from "../avatar/Avatar";
import { ApiWrapper } from "../../api/utils/ApiWrapper";
import { AuthContext } from "../../context/context";

const Menu: FC<{ open: boolean, user: Creator | null }> = ({ open, user }) => {
  const { setIsAuth } = useContext(AuthContext);

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
        <div className={styles.logout} onClick={() => {
          ApiWrapper.call(
            AuthService.logout,
            () => { setIsAuth(false); sessionStorage.clear() },
            [])
        }}>Quit</div>
      </div>
    )

  )
}

export default Menu