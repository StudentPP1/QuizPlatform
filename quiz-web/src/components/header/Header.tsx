import { FC, useState } from "react"
import styles from "./Header.module.scss"
import { useNavigate } from "react-router-dom";

const Header: FC<{ enabledSearch: boolean, children: any }> = ({ enabledSearch, children }) => {
    const navigate = useNavigate();
    const [text, setText] = useState<string>("");

    const handleSearch = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && text.trim() !== "") {
            navigate(`/search/${text}`);
        }
    };

    return (
        <>
            {/* Header */}
            <header className={styles.header}>
                {/* Site Logo */}
                <div className={styles.logo}>QuizPlatform</div>

                {/* Search Input */}
                {enabledSearch
                    ?
                    <>
                        <div className={styles.search_box}>
                            <input
                                onChange={(event) => { setText(event.target.value) }}
                                value={text}
                                type="text"
                                placeholder="Search..." 
                                onKeyDown={handleSearch} // Обробка натискання Enter
                                />
                        </div>
                    </>
                    :
                    <></>
                }

                {children}
            </header >
        </>
    )
}

export default Header