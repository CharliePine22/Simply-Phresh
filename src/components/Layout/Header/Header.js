import { Fragment, useContext } from 'react';
import styles from './Header.module.css';
import mealsImage from '../../../assets/meals.jpg'
import HeaderCartButton from './HeaderCartButton';

const Header = (props) => {
  return (
    <Fragment>
      <header className={styles.header}>
        <h1>Simply Phresh</h1>
        <HeaderCartButton onClick={props.onShowCart}>Cart</HeaderCartButton> 
      </header>
      <div className={styles['main-image']}>
        <img src={mealsImage} alt="A table full of delicious food" />
      </div>
    </Fragment>
  );
};

export default Header;
