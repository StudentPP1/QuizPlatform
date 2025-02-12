import { FC, useEffect, useState } from "react"
import Header from "../header/Header"
import Menu from "../menu/Menu"
import Sidebar from "../sidebar/Sidebar"
import styles from "./Wrapper.module.scss"
import Footer from "../footer/Footer"
import Avatar from "../avatar/Avatar"
import { Creator } from "../../models/Creator"
import { UserService } from "../../api/UserService"

const Wrapper: FC<{
    enabledFooter: boolean,
    enabledSearch: boolean,
    children: any
}> = ({ enabledFooter, enabledSearch, children }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [user, setUser] = useState<Creator | null>(null);

    useEffect(() => {
        const getUser = async () => {
            await UserService.getUser().then((result) => {
                console.log(result)
                setUser({
                    userId: result.id,
                    username: result.username,
                    email: result.email,
                    avatarUrl: result.avatarUrl,
                    participatedQuizzes: result.participatedQuizzes,
                    createdQuizzes: result.createdQuizzes,
                    rating: result.authorRating
                })
            })
        }
        getUser()
    }, [])
    console.log(user)
    return (
        <>
            <div className={styles.page_container}>
                <Header enabledSearch={enabledSearch}>
                    <div onClick={() => setOpen(!open)} className={styles.avatar_container}>
                        <Avatar avatarUrl={user?.avatarUrl} />
                    </div>
                </Header>

                <Menu open={open} user={user}/>

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