import styles from './Receipt.module.css';

const Receipt = (props) => {
  // Get date and time
  let options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const currTime = new Date();
  currTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  const readyTime = new Date();
  readyTime.setTime(currTime.getTime() + 30 * 60 * 1000);
  const fullDate = new Date().toLocaleDateString('en-US', options);

  const finalItems = props.items;

  // Create an empty counter to total up item quantity
  let totalQuantity = 0;
  for (let i = 0; i < finalItems.length; i++) {
    totalQuantity += finalItems[i].amount;
  }

  // Map each item to data to insert into table
  const newItems = finalItems.map((item) => (
    <tr className={styles.item}>
      <td>{item.name}</td>
      <td>{item.amount}</td>
      <td className={styles['item-price']}>${item.price.toFixed(2)}</td>
    </tr>
  ));

  return (
    <>
      <div className={styles['receipt-container']}>
        <h1 className={styles.logo}>Simply Phresh</h1>
        <div className={styles.details}>
          <p className={styles.date}>
            {fullDate} {currTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </p>
          <h3>Name: {props.info.name} </h3>
          <h3>
            Address: {props.info.street}, {props.info.city} {props.info.zipCode}
          </h3>
          <h3>Time Ready: {readyTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</h3>
        </div>
        <table className={styles.table}>
          <tr class={styles['table-headers']}>
            <th>
              <h3 className={styles['item-header']}>Item</h3>
            </th>
            <th id="quantity">
              <h3>Quantity</h3>
            </th>
            <th id="total">
              <h3>Total</h3>
            </th>
          </tr>
          <tbody>{newItems}</tbody>
          <tfoot>
            <tr className={styles['table-headers']}>
              <td className={styles['item-header']}>Total</td>
              <td>{totalQuantity}</td>
              <td id={styles.totalAmount} colspan="2">
                {props.total}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
};
export default Receipt;
