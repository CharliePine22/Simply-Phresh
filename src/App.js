import { useState, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Cart from './components/Cart/Cart';
import Meals from './components/Meals/Meals';
import AuthenticationForm from './components/User/AuthenticationForm';
import AuthenticationPage from './components/User/AuthenticationPage';
import UserPastOrders from './components/User/UserPastOrders';
import ProfilePage from './components/User/ProfilePage';
import AuthContext from './store/auth-context';
import CartProvider from './store/CartProvider';

function App() {
  const [openCart, setOpenCart] = useState(false);
  const authCtx = useContext(AuthContext)
  const body = document.body;


  const openCartHandler = () => {
    setOpenCart(true);
  };

  const closeCartHandler = () => {
    setOpenCart(false);
  };


  // Prevents body from scrolling when cart is open
  openCart
    ? (body.style.cssText = 'overflow: hidden; height:100%;')
    : (body.style.cssText = 'overflow: auto;');

  return (
    <CartProvider>
          {openCart ? <Cart onCloseCart={closeCartHandler} /> : null}
          <main>
        <Routes>
        <Route path="/" element={<Navigate to="/meals" />} />
          <Route element={<AuthenticationPage />} >
            <Route path="/sign-in" key='sign-in' element={<AuthenticationForm />} />
            <Route path="/sign-up" key='sign-up' element={<AuthenticationForm />} />
          </Route>
          <Route path="/meals" element={<Meals onShowCart={openCartHandler}/>}/>
          {authCtx.isLoggedIn && <Route path='/profile' element={<ProfilePage />}/>}
          {authCtx.isLoggedIn && <Route path='/profile/:user/user-meals' element={<UserPastOrders />}/> }
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
          </main>
      </CartProvider>
  );
}

export default App;
