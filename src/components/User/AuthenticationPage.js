import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthenticationPage.module.css';
import AuthenticationForm from './AuthenticationForm';
import AutoCompleteInputs from './AutoCompleteInputs';
import AuthContext from '../../store/auth-context';

const AuthenticationPage = (props) => {
  // State to change form to the next step
  const [nextStep, setNextStep] = useState(false);

  // Save the data from the first step of sign up form
  const [newUserInfo, setNewUserInfo] = useState({});
  const [error, setError] = useState();

  // Context used to login, and save user info to firebase db
  const authCtx = useContext(AuthContext);

  // Navigate is used to redirect user
  const navigate = useNavigate();

  // Function to save form data from part 1 and move on to form part 2 or go back if on part 2
  const nextPart = (data) => {
    setNewUserInfo(data);
    setNextStep(!nextStep);
  };

  const submitFormHandler = (info, action) => {
    let userData;

    if (action === 'SUBMIT') {
      // Grab new data info from form submission
      userData = {
        email: newUserInfo.email,
        password: newUserInfo.password,
        returnSecureToken: true,
      };
    } else {
      // Grab login information
      userData = {
        email: info.email,
        password: info.password,
        returnSecureToken: true,
      };
    }

    const sendData = async () => {
      let url;
      if (action === 'LOGIN') {
        url =
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDhbI0X34ZPurUHsRtCas4ybNHgCLQqEfs';
      } else {
        url =
          'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDhbI0X34ZPurUHsRtCas4ybNHgCLQqEfs';
      }
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (!response.ok) {
        // Make error messages user friendly based on firebase error messages.
        if (action === 'LOGIN') {
          authCtx.displayError(data.error.message, 'LOGIN');
        } else {
          authCtx.displayError(data.error.message, 'SUBMIT');
        }
        return;
      } 
      
      // Set expiration time for 30 mins
      const expirationTime = new Date(
        new Date().getTime() + +data.expiresIn * 500
      );
      
      authCtx.login(data.idToken, expirationTime.toISOString());
      if (action === 'SUBMIT') {
        authCtx.saveNewUserData(data.email, newUserInfo.password, {
          firstName: newUserInfo.firstName,
          lastName: newUserInfo.lastName,
          street: info.address,
          apartment: info.address2,
          city: info.city,
          state: info.state,
          zipcode: info.zipcode,
          country: info.country,
        });
      } else {
        authCtx.saveExistingUserData(data.email, info.password);
      }
      navigate('/meals', { replace: true });
    };
    sendData();
  };

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Simply Phresh</h1>
      </div>
      <div className={styles.form}>
        {!nextStep && (
          <AuthenticationForm onSubmit={submitFormHandler} onNext={nextPart} />
        )}
        {nextStep && (
          <AutoCompleteInputs onSubmit={submitFormHandler} onBack={nextPart} />
        )}
      </div>
    </section>
  );
};

export default AuthenticationPage;
