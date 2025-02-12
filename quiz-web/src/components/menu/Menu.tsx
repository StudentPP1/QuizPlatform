import { FC } from "react";
import styles from "./Menu.module.scss";
import { useNavigate } from "react-router-dom";

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
        {/* <ul className={styles.menuList}>
        <li>🏆 Досягнення</li>
        <li>⚙️ Налаштування</li>
        <li>🌞 Світлий режим</li>
      </ul> */}
        <div className={styles.logout} onClick={() => {
          localStorage.setItem("index", "2");
          navigate("/")
        }}>Quit</div>
        {/* <ul className={styles.footerMenu}>
        <li>Політика конфіденційності</li>
        <li>Допомога та відгуки</li>
        <li>Підписатися</li>
      </ul> */}
      </div>
    )

  )
}

export default Menu