import { FC, useEffect, useState } from "react";
import styles from "./Sidebar.module.scss";
import { FaHome, FaFolder } from "react-icons/fa";
import { CgAdd } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

const Sidebar: FC = () => {
    const [index, setIndex] = useState<number>(2);
    const navigate = useNavigate();
    
    useEffect(() => {
        const savedIndex = localStorage.getItem("index");

        if (savedIndex != null) {
            setIndex(Number.parseInt(savedIndex))
        }
    },[])

    return (
        <aside className={styles.sidebar}>
            <ul>
                <li
                    onClick={() => {
                        localStorage.setItem("index", "1");
                        setIndex(1);
                        navigate("/create-quiz");
                    }}
                    className={`${index === 1 ? styles.active : ''}`}><CgAdd /></li>
                <li
                    onClick={() => {
                        localStorage.setItem("index", "2");
                        setIndex(2);
                        navigate("/home");
                    }}
                    className={`${index === 2 ? styles.active : ''}`}><FaHome /></li>
                <li
                    onClick={() => {
                        localStorage.setItem("index", "3");
                        setIndex(3);
                        navigate("/library");
                    }}
                    className={`${index === 3 ? styles.active : ''}`}><FaFolder /></li>
            </ul>
        </aside >
    );
};

export default Sidebar;
