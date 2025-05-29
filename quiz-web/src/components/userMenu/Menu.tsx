import { FC, useContext } from "react";
import styles from "./Menu.module.scss";
import { AuthService } from "../../api/services/AuthService";
import { Creator } from "../../models/Creator";
import Avatar from "../avatar/Avatar";
import { AuthContext } from "../../context/context";
import { globalCache } from "../../hooks/useCachedFetch";
import { ACCESS_TOKEN_NAME } from "../../constants/constants";

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
          AuthService.logout().then(() => { setUser(null); globalCache.delete(ACCESS_TOKEN_NAME) })
        }>Quit</div>
      </div>
    )
  )
}

export default Menu