import React, { useContext, useState } from 'react';
import styles from './Cart.module.css';
import Modal from '../UI/Modals/Modal';
import CartItem from './CartItem';
import CartContext from '../../store/cart-context';
import Checkout from './Checkout';

const Cart = (props) => {
  const [checkoutReady, setCheckoutReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const ctx = useContext(CartContext);
  const totalAmount = `$${ctx.totalAmount.toFixed(2)}`;
  const hasItems = ctx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    ctx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    ctx.addItem({ ...item, amount: 1 });
  };

  const checkoutHandler = () => {
    setCheckoutReady(true);
  };

  const sendDataHandler = async (userData) => {
    setIsSubmitting(true);
    await fetch('https://react-http-cee32-default-rtdb.firebaseio.com/orders.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: userData,
        orderedItems: ctx.items,
      }),
    });
    setIsSubmitting(false);
    setDidSubmit(true)
    ctx.clearCart()
  };

  const cartItems = (
    <ul className={styles['cart-items']}>
      {ctx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const cartModalContent =  <React.Fragment>
  {cartItems}
  <div className={styles['cart-items']}>
    <div className={styles.total}>
      <span>Total Amount</span>
      <span>{totalAmount}</span>
    </div>
    {!hasItems && <p>The cart is currently empty.</p>}
    <div className={styles.actions}>
      <button className={styles['button--alt']} onClick={props.onCloseCart}>
        Close
      </button>
      {hasItems && (
        <button onClick={checkoutHandler} className={styles.button}>
          Order
        </button>
      )}
      {checkoutReady && (
        <Checkout onSubmit={sendDataHandler} onCancel={props.onCloseCart} />
      )}
    </div>
  </div>
  </React.Fragment>

  const isSubmittingContent = <p>Sending order data...</p>
  const didSubmitContent = <section className={styles['confirm-section']}>
    <p>Successfully submitted order!</p>
    <button onClick={props.onCloseCart} className={styles['confirm-button']}>Close</button>
    </section>

  return (
    <Modal onCloseCart={props.onCloseCart}>
      {!isSubmitting && !didSubmit && cartModalContent}
      {isSubmitting && isSubmittingContent}
      {!isSubmitting && didSubmit && didSubmitContent}
    </Modal>
  );
};
export default Cart;
