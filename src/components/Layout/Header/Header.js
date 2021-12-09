import { Fragment, useContext } from 'react';
import { NavLink } from 'react-router-dom'
import styles from './Header.module.css';
import mealsImage from '../../../assets/meals.jpg'
import HeaderCartButton from './HeaderCartButton';
import AuthContext from '../../../store/auth-context';

const Header = (props) => {
  const authCtx = useContext(AuthContext)

  const logoutHandler = () => {
    authCtx.logout()
  }


  return (
    <Fragment>
      <header className={styles.header}>
        <div className={styles.auth}>
          <NavLink className={styles.logo} to='/meals'><h1>Simply Phresh</h1></NavLink>
          <div className={styles.actions}>
           {!authCtx.isLoggedIn && <NavLink className={styles.login} onClick={props.toggleAuth} to='/sign-in'>Sign In</NavLink> }
           {authCtx.isLoggedIn && <NavLink className={styles.login} onClick={props.toggleAuth}  to='/profile'>Profile</NavLink> }
            <span>|</span>
           {!authCtx.isLoggedIn && <NavLink className={styles.login} onClick={props.toggleAuth} to='/sign-up'>Sign Up</NavLink>}
           {authCtx.isLoggedIn && <NavLink className={styles.login} onClick={logoutHandler} to='/sign-in'>Logout</NavLink>}
          </div>
        </div>
        <HeaderCartButton onClick={props.onShowCart} />
      </header>
      <div className={styles['main-image']}>
        <img src={mealsImage} alt="A table full of delicious food" />
      </div> 
    </Fragment>
  );
};

export default Header;
