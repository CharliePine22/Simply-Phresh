import { useState, useEffect, useContext } from 'react';
/* global google */
import { useLocation, Link } from 'react-router-dom';
import useInput from '../../hooks/use-input';
import AuthContext from '../../store/auth-context';
import Card from '../UI/Card/Card';
import styles from './AuthenticationForm.module.css';

const nameIsValid = (value) => value !== ''
const emailValid = (value) => (value !== '' && value.includes('@'))
const passwordValid = (value) => (value.length >= 6)

const AuthenticationForm = (props) => {
  // State used to determine if user is trying to login
  const [isLogin, setIsLogin] = useState(false);

  // State used to determine the action text on the button
  const [authAction, setAuthAction] = useState();
  const authCtx = useContext(AuthContext)
  const formattedError = authCtx.errorMessage;

  // State used to determine and display error if any
  const [error, setError] = useState();

  // FIRST NAME INPUT HOOK
  const {
    value: firstNameInputValue,
    hasError: firstNameHasError,
    isValid: firstNameIsValid,
    updateValue: firstNameUpdateValue,
    setBlur: firstNameSetBlur,
    resetFields: firstNameReset,
  } = useInput(nameIsValid)

  // LAST NAME INPUT HOOK
  const {
    value: lastNameInputValue,
    hasError: lastNameHasError,
    isValid: lastNameIsValid,
    updateValue: lastNameUpdateValue,
    setBlur: lastNameSetBlur,
    resetFields: lastNameReset,
  } = useInput(nameIsValid)

  // EMAIL INPUT HOOK
  const {
    value: emailInputValue,
    hasError: emailHasError,
    isValid: emailIsValid,
    updateValue: emailUpdateValue,
    setBlur: emailSetBlur,
    resetFields: emailReset,
  } = useInput(emailValid)

  // PASSWORD INPUT HOOK
  const {
    value: passwordInputValue,
    hasError: passwordHasError,
    isValid: passwordIsValid,
    updateValue: passwordUpdateValue,
    setBlur: passwordSetBlur,
    resetFields: passwordReset,
  } = useInput(passwordValid)

  // Location is used for grabbing the path
  const location = useLocation();

  // Determine what should be showed on screen when toggling, depending on the path
  let path;
  if (authAction === 'Login') {
    path = '/sign-up';
  } else {
    path = '/sign-in';
  }

  // If the pathname changes, rerender the component to show either the Login or Create Account section
  useEffect(() => {
    if (location.pathname === '/sign-up') {
      setAuthAction('Sign Up');
      setIsLogin(false);
    } else {
      setAuthAction('Login');
      setIsLogin(true);
    }
  }, [location.pathname]);

  // Toggler to switch form to other action based on current action
  const toggleAuthHandler = () => {
    setIsLogin(!isLogin);
    emailReset();
    passwordReset();
  };

   // Flag for determining if user can move on to next part
   let formValid = false; 
   if(!isLogin && (firstNameIsValid && lastNameIsValid && emailIsValid && passwordIsValid)) {
     formValid = true;
   } else if(isLogin && (emailIsValid && passwordIsValid)) {
     formValid = true;
   }

  const saveData = (event) => {
    event.preventDefault();
    if (isLogin) {
      // If user is logging in, only pass email and password data
      const data = {
        email: emailInputValue,
        password: passwordInputValue,
      };
      props.onSubmit(data, 'LOGIN');
    } else {
      // If user is creating new account pass name values as well
      const initialData = {
        firstName: firstNameInputValue,
        lastName: lastNameInputValue,
        email: emailInputValue,
        password: passwordInputValue,
      };
      props.onNext(initialData);
    }
  };

  useEffect(() => {
    setError(formattedError)
    const showError = setTimeout(() => {
      authCtx.displayError(null, 'RESET')
    }, 3000)
    return () => {
      clearInterval(showError)
    }
  }, [formattedError])

  // Set input styles based on error
  const firstNameInputClasses = firstNameHasError
    ? `${styles.control} ${styles.invalid}`
    : styles.control;
  const lastNameInputClasses = lastNameHasError
    ? `${styles.control} ${styles.invalid}`
    : styles.control;
  const emailInputClasses = emailHasError
    ? `${styles.control} ${styles.invalid}`
    : styles.control;
  const passwordInputClasses = passwordHasError
    ? `${styles.control} ${styles.invalid}`
    : styles.control;

  const inputClasses = isLogin ? '' : styles.group;
  // Also add Jessicas idea for address entry upon new account creation
  // Incorpate Ryan's AutoComplete address info

  return (
    <Card className={styles.card}>
      <section className={styles.auth}>
        <h1 className={styles.title}>{authAction}</h1>
        <form onSubmit={saveData}>
        <div className={styles.name}>
          {/* FIRST NAME INPUT */}
          {!isLogin && (
            <div className={firstNameInputClasses}>
              <label htmlFor="fname">First Name</label>
              <input value={firstNameInputValue} onChange={firstNameUpdateValue} onBlur={firstNameSetBlur} type="text" id="fname" />
              {firstNameHasError && <p>Please don't leave first name field blank!</p>}
            </div>
          )}

          {/* LAST NAME INPUT */}
          {!isLogin && (
            <div className={lastNameInputClasses}>
              <label htmlFor="lname">Last Name</label>
              <input value={lastNameInputValue} onChange={lastNameUpdateValue} onBlur={lastNameSetBlur} type="text" id="lname" />
              {lastNameHasError && <p>Please don't leave last name field blank!</p>}
            </div>
          )}
        </div>
          <div className={inputClasses}>
            {/* EMAIL INPUT */}
            <div className={emailInputClasses}>
              <label htmlFor="email">Email</label>
              <input value={emailInputValue} onChange={emailUpdateValue} onBlur={emailSetBlur} type="email" id="email" />
              {emailHasError && <p>Please enter a valid email!</p>}
            </div>

            {/* PASSWORD INPUT */}
            <div className={passwordInputClasses}>
              <label htmlFor="password">Password</label>
              <input value={passwordInputValue} onChange={passwordUpdateValue} onBlur={passwordSetBlur} type="password" id="password" />
              {passwordHasError && <p>Password must contain 6 or more characters!</p>}
            </div>

            <div>
              {isLogin && (
                <Link className={styles['reset-password']} to="sign-in">
                  Reset Password
                </Link>
              )}
            </div>
            {(isLogin && error) && <p className={styles.error}>{error}</p>}
          </div>

          <div className={styles.actions}>
            {/* BUTTON TO DETERMINE ACTION */}
            <button>{isLogin ? 'Login' : 'Next'}</button>

            {/* LINK TO TOGGLE LOGIN/CREATE ACCOUNT SECTION */}
            <Link
              className={styles.toggle}
              onClick={toggleAuthHandler}
              to={path}
            >
              {isLogin ? 'Create new account' : 'Login with existing account'}
            </Link>

            {/* LINK TO GO BACK TO MAIN MENU */}
            <Link
              to="/meals"
              className={styles.back}
              onClick={props.toggleAuth}
            >
              Main Menu
            </Link>
          </div>
        </form>
      </section>
    </Card>
  );
};

export default AuthenticationForm;
