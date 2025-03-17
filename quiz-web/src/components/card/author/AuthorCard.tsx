import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./AuthorCard.module.scss";
import Avatar from '../../avatar/Avatar';
import { CreatorDTO } from '../../../models/CreatorDTO';

const AuthorCard: FC<{ author: CreatorDTO }> = ({ author }) => {
  const navigate = useNavigate();
  return (
    <div
      key={author.userId}
      onClick={() => {
        localStorage.setItem("index", "0");
        navigate(`/authorInfo/${author.userId}`);
      }}
      className={styles.author_card}>
      <div className={styles.author_content}>
        <div className={styles.author_info}>
          <div className={styles.author}>
            <Avatar avatarUrl={author.avatarUrl} />
            <span className={styles.name}>{author.username}</span>
          </div>
          <div className={styles.author_stats}>
            <span> {author.numberOfQuizzes} tests </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthorCard