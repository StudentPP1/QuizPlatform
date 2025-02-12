import { FC, useEffect, useState } from "react"
import Header from "../header/Header"
import Menu from "../menu/Menu"
import Sidebar from "../sidebar/Sidebar"
import styles from "./Wrapper.module.scss"
import Footer from "../footer/Footer"
import Avatar from "../avatar/Avatar"

const Wrapper: FC<{ 
    enabledFooter: boolean,
    enabledSearch: boolean, 
    children: any 
}> = ({ enabledFooter, enabledSearch, children }) => {
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        // TODO: GET /api/users
    })

    return (
        <>
            <div className={styles.page_container}>
                <Header enabledSearch={enabledSearch}>
                    {/* <Avatar avatarUrl={}/> */}
                    <div className={styles.user_avatar} onClick={() => { setOpen(!open) }}>
                        <img src="https://i.pravatar.cc/40" alt="User Avatar" />
                    </div>
                </Header>

                <Menu open={open} />

                <div className={styles.container}>
                    <main className={styles.content}>
                        <Sidebar />

                        {children}
                        
                        {enabledFooter && <Footer />}
                    </main>
                </div>
            </div>
        </>
    )
}

export default Wrapper