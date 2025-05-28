import { FC, useEffect, useState } from "react";
import styles from "./Sidebar.module.scss";
import { FaHome, FaFolder } from "react-icons/fa";
import { CgAdd } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

const Sidebar: FC = () => {
    const [index, setIndex] = useState<number>(2);
    const navigate = useNavigate();
    const pages: any = {
        1: {url: "/create-quiz", icon: <CgAdd />},
        2: {url: "/home", icon: <FaHome />},
        3: {url: "/library", icon: <FaFolder />},
    }
    useEffect(() => {
        const savedIndex = localStorage.getItem("index");

        if (savedIndex != null) {
            setIndex(Number.parseInt(savedIndex))
        }
    }, [])

    return (
        <aside className={styles.sidebar}>
            <ul>
                {Object.keys(pages).map((i) => 
                    <li
                    key={i}
                    onClick={() => {
                        localStorage.setItem("index", i.toString());
                        setIndex(Number.parseInt(i));
                        navigate(pages[i].url);
                    }}
                    className={`${index === Number.parseInt(i) ? styles.active : ''}`}>
                        {pages[i].icon}
                    </li>
                )}
            </ul>
        </aside >
    );
};

export default Sidebar;
