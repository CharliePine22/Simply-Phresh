import styles from './UserPastOrdersItem.module.css';

const UserPastOrdersItem = (props) => {
  return (
    <>
      <li className={styles['list-item']}>
        <div className={styles.container}>
          <div className={styles.name}>
            <h4>{props.name}</h4>
            <ul className={styles['list-item']}>
                <li>Amount Ordered: {props.amount}</li>
                <li>Price: ${props.price.toFixed(2)}</li>
            </ul>
          </div>
        </div>
      </li>
    </>
  );
};

export default UserPastOrdersItem;
