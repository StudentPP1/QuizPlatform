import { FC } from "react"
import styles from "./Avatar.module.scss"

const Avatar: FC<{avatarUrl: string | undefined | null}> = ({avatarUrl}) => {
    return (
        <>
            {avatarUrl != undefined && avatarUrl != null && avatarUrl != ""
                ?
                <div className={styles.user_avatar}>
                    <img src={avatarUrl} />
                </div>
                :
                <div className={styles.avatar}></div>
            }
        </>
    )
}

export default Avatar