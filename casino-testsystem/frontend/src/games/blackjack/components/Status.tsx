import React from 'react';
import styles from './styles/Status.module.css';

type StatusProps = {
  message: string,
  balance: number,
  username: string,
};

const Status: React.FC<StatusProps> = ({ message, balance, username }) => {
  return (
    <div className={styles.statusContainer}>
      <div className={styles.status}>
        <h1 className={styles.value}>{message}</h1>
      </div>
      <div className={styles.balance}>
        <h1 className={styles.value}>${balance}</h1>
      </div>
      <div className={styles.username}>
        <span className={styles.usernameLabel}>Name</span>
        <div className={styles.usernameDisplay}>{username}</div>
      </div>
    </div>
  );
}

export default Status;
