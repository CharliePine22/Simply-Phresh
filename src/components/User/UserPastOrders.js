import { useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './UserPastOrders.module.css';
import useFetchData from '../../hooks/use-fetch-data';
import AuthContext from '../../store/auth-context';
import UserPastOrdersItem from './UserPastOrdersItem';
import Card from '../UI/Card/Card';

const UserPastOrders = () => {
  const { isLoading, currentUserData } = useFetchData();
  const authContext = useContext(AuthContext);

  const generateFilteredOrders = () => {
    // Object with keys as the date ordered and values as the orders placed that date
    let userFilteredOrders = {};
    // Object containing the prices based on the date to display order total
    let totals = {};

    if (!isLoading && authContext.isLoggedIn) {
      for (const key in currentUserData.orders) {
        // Set variable to the value of each key
        let dateOrdered = currentUserData.orders[key].dateOrdered;
        for (let i = 0; i < currentUserData.orders[key].order.length; i++) {
          // If the object already has a key, push the data onwards
          if (userFilteredOrders.hasOwnProperty(dateOrdered)) {
            userFilteredOrders[dateOrdered].push(
              currentUserData.orders[key].order[i]
            );
            totals[dateOrdered].push(currentUserData.orders[key].order[i].price)
          } else {
            // If the object doesnt have a key, create a list with data
            userFilteredOrders[dateOrdered] = [
              currentUserData.orders[key].order[i],
            ];
            totals[dateOrdered] = [currentUserData.orders[key].order[i].price]
          }
        }
      }
    }
    return {totals, userFilteredOrders};
  };

  // Blank variable to assign content once finished fetching
  let content;

  if (!isLoading) {
    const userData = generateFilteredOrders();
    const orders = userData.userFilteredOrders;
    const totals = userData.totals;

    content = (
      <div>
        {/* Loop through the orders object and assign keys as headers */}
        {Object.entries(orders).map(([key, val]) => (
          <>
            <h2 className={styles.date}>{key}</h2>
            {/* Loop through the values of each key (date) */}
            {val.map((item) => (
              <>
                <UserPastOrdersItem
                  name={item.name}
                  amount={item.amount}
                  price={item.price}
                />
              </>
            ))}
            {/* Display total based on key */}
            <h4 className={styles.total}>Total: ${totals[key].reduce((partial_sum, a) => partial_sum + a, 0)}</h4>
          </>
        ))}
      </div>
    );
  }

  return (
    <section className={styles.page}>
      <h2 className={styles.title}>Past Orders</h2>
      <Card className={styles.card}>
        <div className={styles.content}>
        {content}
        <div className={styles.actions}>
        <Link className to='/profile' className={styles.return}>Return to Profile</Link>
        </div>
        </div>
        
        </Card>
    </section>
  );
};

export default UserPastOrders;
