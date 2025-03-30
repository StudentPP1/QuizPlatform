import { FC, useContext } from "react";
import styles from "./Menu.module.scss";
import { AuthService } from "../../api/services/AuthService";
import { Creator } from "../../models/Creator";
import Avatar from "../avatar/Avatar";
import { AuthContext } from "../../context/context";

const Menu: FC<{ open: boolean, user: Creator | null }> = ({ open, user }) => {
  const { setUser } = useContext(AuthContext);

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
        <div className={styles.logout} onClick={() =>
          AuthService.logout().then(() => { setUser(null); sessionStorage.clear() })
        }>Quit</div>
      </div>
    )

  )
}

export default Menu