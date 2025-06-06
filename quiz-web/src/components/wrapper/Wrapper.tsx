import { FC, useContext, useState } from "react";
import styles from "./Wrapper.module.scss";
import Header from "../header/Header";
import Avatar from "../avatar/Avatar";
import Menu from "../userMenu/Menu";
import Sidebar from "../sidebar/Sidebar";
import { AuthContext } from "../../context/context";

const Wrapper: FC<{
    children: any
}> = ({ children }) => {
    const [open, setOpen] = useState<boolean>(false);
    const { user } = useContext(AuthContext)

    return (
        <div className={styles.page_container}>
            <Header>
                <div onClick={() => setOpen(!open)} className={styles.avatar_container}>
                    <Avatar avatarUrl={user?.avatarUrl} />
                </div>
            </Header>
            <Menu open={open} user={user} />
            <div className={styles.container}>
                <main className={styles.content}>
                    <Sidebar />
                    {children}
                </main>
            </div>
        </div>
    )
}

export default Wrapper