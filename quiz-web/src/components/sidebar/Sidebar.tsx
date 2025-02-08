import { FC } from "react";
import styles from "./Sidebar.module.scss";
import { FaHome, FaFolder } from "react-icons/fa";
import { CgAdd } from "react-icons/cg";

const Sidebar: FC = () => {
    return (
        <aside className={styles.sidebar}>
            <ul>
                <li><CgAdd/></li>
                <li><FaHome /></li>
                <li><FaFolder /></li>
            </ul>
        </aside>
    );
};

export default Sidebar;
