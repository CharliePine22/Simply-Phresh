import { useContext, useEffect, useState } from 'react';
import CartIcon from '../../Cart/CartIcon';
import styles from './HeaderCartButton.module.css';
import CartContext from '../../../store/cart-context';

const HeaderCartButton = (props) => {
  const [btnActive, setBtnActive] = useState(false);
  const ctx = useContext(CartContext);
  const numberOfCartItems = ctx.items.reduce((currNumber, item) => {
    return currNumber + item.amount;
  }, 0);

  const { items } = ctx;
  const btnClasses = `${styles.button} ${btnActive ? styles.bump : ''}`;

  useEffect(() => {
    if (ctx.length === 0) return;
    setBtnActive(true);

    const timer = setTimeout(() => {setBtnActive(false)}, 300);
    return () => {
        clearTimeout(timer);
    }
  }, [items]);

  return (
    <button onClick={props.onClick} className={btnClasses}>
      <span className={styles.icon}>
        <CartIcon />
      </span>
      <span>Your Cart</span>
      <span className={styles.badge}>{numberOfCartItems}</span>
    </button>
  );
};

export default HeaderCartButton;
