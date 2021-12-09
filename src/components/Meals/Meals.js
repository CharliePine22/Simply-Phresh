import { Fragment } from 'react';
import Header from '../Layout/Header/Header';
import AvailableMeals from './AvailableMeals';
import MealsSummary from './MealsSummary';


const Meals = (props) => {
  const openCartHandler = () => {
    props.onShowCart()
  }

  return (
    <Fragment>
      <Header onShowCart={openCartHandler}/>
      <MealsSummary />
      <AvailableMeals />
    </Fragment>
  );
};

export default Meals;
