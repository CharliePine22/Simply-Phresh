import { useRef, useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import Card from '../UI/Card/Card';
import styles from './ProfilePage.module.css';
import AuthContext from '../../store/auth-context';

const ProfilePage = (props) => {
  // Toggler to begin updating password
  const [changePassword, setChangePassword] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserData, setCurrentUserData] = useState([]);
  const navigate = useNavigate();

  // State to display and detect error
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const authCtx = useContext(AuthContext);
  const passwordRef = useRef();

  const email = localStorage.getItem('email');
  const password = localStorage.getItem('password');

  // Replace password with * for each letter in password
  const hiddenPassword = password.replace(/./g, '*');
  const eyeIcon = <FontAwesomeIcon icon={faEye} />;

  // Toggler to display password form
  const newPasswordHandler = () => {
    setChangePassword(!changePassword);
  };

  // Toggler to reveal user password
  const revealPasswordHandler = () => {
    setViewPassword(!viewPassword);
  };

  const focusHandler = (event) => {
    event.preventDefault();
    event.target.focus({ preventScroll: true });
  };

  const submitFormHandler = (event) => {
    event.preventDefault();
    const password = passwordRef.current.value;

    if (password.length === 0 || password.length < 6) {
      setError('New password must have 6 or more characters!');
      return;
    }

    // PASSWORD CHANGE FUNCTION
    const sendData = async () => {
      const response = await fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDhbI0X34ZPurUHsRtCas4ybNHgCLQqEfs',
        {
          method: 'POST',
          body: JSON.stringify({
            idToken: authCtx.token,
            password,
            returnSecureToken: true,
          }),
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        console.log(data.error.message);
        setError('Something went wrong, please try again!');
        passwordRef.current.value = '';
      }
      localStorage.setItem('password', password);
      setSuccess('Password reset successfully!');
      passwordRef.current.value = '';
      setTimeout(() => {
        navigate(0);
      }, 1500);
    };
    sendData();
  };

  // Retrieve user information hook
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `https://react-http-cee32-default-rtdb.firebaseio.com/users.json`
        );
        if (!response.ok) {
          console.log('FAILED TO FETCH');
        }
        const data = await response.json();
        const all_users = [];
        for (const key in data) {
          all_users.push(data[key]);
        }
        const currentUser = all_users.filter((item) => item.email === email);
        setCurrentUserData(currentUser);

      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    fetchUserData();
  }, []);

  if (currentUserData[0] === undefined) {
    return <p>Fetching data...</p>;
  }

  return (
    <section className={styles.page}>
      <h1>Profile</h1>
      <Card className={styles.card}>
        <div className={styles['user-info']}>
          <h1>User Details</h1>
          <table className={styles.table}>
            <tbody>
              <tr className={styles.details}>
                <td>
                  <h3>Name</h3>
                </td>
                <td>
                  <h3>Street Address</h3>
                </td>
              </tr>
              <tr className={styles.details}>
                <td>
                  {currentUserData && currentUserData[0].userData && (
                    <p>
                      {currentUserData[0].userData.firstName +
                        ' ' +
                        currentUserData[0].userData.lastName}
                    </p>
                  )}
                </td>
                <td>
                  {currentUserData &&
                    currentUserData[0].userData &&
                    !currentUserData[0].userData.apartment && (
                      <p>{currentUserData[0].userData.street}</p>
                    )}
                  {currentUserData &&
                    currentUserData[0].userData &&
                    currentUserData[0].userData.apartment && (
                      <p>
                        {currentUserData[0].userData.street +
                          ', Unit #' +
                          currentUserData[0].userData.apartment}
                      </p>
                    )}
                </td>
              </tr>
              <tr className={styles.details}>
                <td>
                  <h3>City/State</h3>
                </td>
                <td>
                  <h3>Zipcode</h3>
                </td>
              </tr>
              <tr className={styles.details}>
                <td>
                  {currentUserData && currentUserData[0].userData && (
                    <p>
                      {currentUserData[0].userData.city},{' '}
                      {currentUserData[0].userData.state}
                    </p>
                  )}
                </td>
                <td>
                  <p>{currentUserData[0].userData.zipcode}</p>
                </td>
              </tr>
              <tr className={styles.details}>
                <td>
                  <h3>Email</h3>
                </td>
                <td>
                  <h3>Password</h3>
                </td>
              </tr>
              <tr className={styles.details}>
                <td>
                  <p className={styles.email}>{email}</p>
                </td>
                <td className={styles.password}>
                  <span onClick={revealPasswordHandler}>{eyeIcon}</span>
                  <p>{viewPassword ? password : hiddenPassword}</p>
                </td>
              </tr>
            </tbody>
          </table>
          {error && <p className={styles.error}>{error}</p>}
          {success && !error && <p className={styles.success}>{success}</p>}
          {changePassword && (
            <form
              className={styles['password-change-form']}
              onSubmit={submitFormHandler}
            >
              <label htmlFor="new-password">New Password</label>
              <input
                type="text"
                onFocus={focusHandler}
                onWheel={(e) => e.target.blur()}
                onTouchMove={(e) => e.preventDefault()}
                id="new-password"
                ref={passwordRef}
              />
              <div className={styles['form-actions']}>
                <button>Submit</button>
                <button type="button" onClick={newPasswordHandler}>
                  Cancel
                </button>
              </div>
            </form>
          )}
          <div className={styles.actions}>
            {!changePassword && (
              <button className={styles.button} onClick={newPasswordHandler}>
                Change Password
              </button>
            )}
          </div>
          <Link className={styles.orders} to={`/profile/${email}/user-meals`}> See Past Orders</Link>
        </div>
      </Card>
      <Link to="/meals" className={styles.return}>
        Main Menu
      </Link>
    </section>
  );
};

export default ProfilePage;
