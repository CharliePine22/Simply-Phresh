import styles from './Receipt.module.css';

const Receipt = (props) => {
  // Set date and time formatting options
  let options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  // Format date to include just hour and minutes
  const currTime = new Date();
  currTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})

  // Add 30min to current time to act as dummy ready time
  const readyTime = new Date();
  readyTime.setTime(currTime.getTime() + 30 * 60 * 1000);

  // Grab the full date and time
  const fullDate = new Date().toLocaleDateString('en-US', options);

  // List of purchased items
  const finalItems = props.items;
  
  let apartment;
  if(props.info.apartment) {
      apartment = props.info.apartment
  } 

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
        <div id='details' className={styles.details}>
          <p className={styles.date}>
            {fullDate} {currTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </p>
          <h3>Name: {props.info.name} </h3>
          <h3>Email: {props.info.email} </h3>
          <h3>
            Address: {props.info.street}, {props.info.city} {props.info.zipCode} {props.info.apartment && 'Unit #'+apartment}
          </h3>
          <h3>Estimated Delivery Time: {readyTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</h3>
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
              <td className={styles['item-header']}><h3>Total</h3></td>
              <td><h3>{totalQuantity}</h3></td>
              <td id={styles.totalAmount} colspan="2">
                <h3>{props.total}</h3>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
};
export default Receipt;
