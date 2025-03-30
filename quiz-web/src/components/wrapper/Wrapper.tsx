import { FC, useEffect, useState } from "react";
import { Creator } from "../../models/Creator";
import styles from "./Wrapper.module.scss";
import Header from "../header/Header";
import Avatar from "../avatar/Avatar";
import Menu from "../menu/Menu";
import Sidebar from "../sidebar/Sidebar";
import { UserService } from "../../api/services/UserService";

const Wrapper: FC<{
    children: any
}> = ({ children }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [user, setUser] = useState<Creator | null>(null);

    useEffect(() => {
        UserService.getUser()
            .then((result: any) => { setUser(result) })
            .catch(() => { setUser(null) })
    }, [])

    return (
        <>
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
        </>
    )
}

export default Wrapper