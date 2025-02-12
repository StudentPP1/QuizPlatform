import { FC, useContext, useEffect, useState } from "react"
import Header from "../header/Header"
import Menu from "../menu/Menu"
import Sidebar from "../sidebar/Sidebar"
import styles from "./Wrapper.module.scss"
import Footer from "../footer/Footer"
import Avatar from "../avatar/Avatar"
import { Creator } from "../../models/Creator"
import { UserService } from "../../api/UserService"
import { AuthService } from "../../api/AuthService"
import { AuthContext, AuthState } from "../../context/context"

const Wrapper: FC<{
    enabledFooter: boolean,
    enabledSearch: boolean,
    children: any
}> = ({ enabledFooter, enabledSearch, children }) => {
    const { isAuth, setIsAuth } = useContext<AuthState>(AuthContext);

    const [open, setOpen] = useState<boolean>(false);
    const [user, setUser] = useState<Creator | null>(null);

    useEffect(() => {
        const getUser = async () => {
            await UserService.getUser().then((result) => {
                console.log(5)
                console.log("user: ", result)
                setUser(result)
            })
        }
        const refreshToken = async () => {
            await AuthService.refreshToken().then((result) => {
                if (!result.hasOwnProperty("statusCode")) {
                    localStorage.setItem("accessToken", result.accessToken)
                    setIsAuth(true)
                }
            })
        }
        if (localStorage.getItem("accessToken") == null) {
            refreshToken().then(() => {
                getUser()
            })
        } else {
            getUser()
        }
    }, [])

    return (
        <>
            <div className={styles.page_container}>
                <Header enabledSearch={enabledSearch}>
                    <div onClick={() => setOpen(!open)} className={styles.avatar_container}>
                        <Avatar avatarUrl={user?.avatarUrl} />
                    </div>
                </Header>

                <Menu open={open} user={user} />

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