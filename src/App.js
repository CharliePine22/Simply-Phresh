import { useState } from 'react';
import Cart from './components/Cart/Cart';
import Header from './components/Layout/Header/Header';
import Meals from './components/Meals/Meals';
import CartProvider from './store/CartProvider';

function App() {
  const [openCart, setOpenCart] = useState(false);
  const body = document.body
  const openCartHandler = () => {
    setOpenCart(true);
  };

  const closeCartHandler = () => {
    setOpenCart(false);
  };

  // Prevents body from scrolling when cart is open
  openCart ? body.style.cssText = "overflow: hidden;" : body.style.cssText = "overflow: auto;"

  return (
    <CartProvider>
      {openCart ? <Cart onCloseCart={closeCartHandler} /> : null}
      <Header onShowCart={openCartHandler} />
      <main>
        <Meals />
      </main>
    </CartProvider>
  );
}

export default App;
