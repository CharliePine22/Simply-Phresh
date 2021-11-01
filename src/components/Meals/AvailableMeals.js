import { useState, useEffect } from 'react';
import Card from '../UI/Card/Card';
import styles from './AvailableMeals.module.css';
import MealsItem from './MealsItem';

const AvailableMeals = () => {
  const [meals, setMeals] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState();

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch(
          'https://react-http-cee32-default-rtdb.firebaseio.com/meals.json'
        );

        if(!response.ok) {
          throw new Error('Something went wrong!')
        }

        const data = await response.json();
        const all_meals = [];
        for (const meal in data) {
          all_meals.push({
            id: meal,
            mealName: meal,
            mealPrice: data[meal].price,
            mealDescription: data[meal].description,
          });
        }
        const mealsList = all_meals.map((meal) => (
          <li>
            <MealsItem
              id={meal.id}
              key={meal.id}
              name={meal.mealName}
              description={meal.mealDescription}
              price={meal.mealPrice}
            />
          </li>
        ));
        setMeals(mealsList);
      } catch (error) {
        setHttpError(error.message);
      }
      setIsLoading(false);
    };
    fetchMeals();
  }, [])

  const errorsClasses = `${styles['error-text']} ${styles.meals}`

  if(httpError) {
    return (
    <section className={errorsClasses}>
      <Card>
    <p>{httpError}</p>
    </Card>
    </section>
    )
  }

  return (
    <section className={styles.meals}>
      <Card>
        {isLoading && <p>Fetching the meals!</p>}
        <ul>{meals}</ul>
      </Card>
    </section>
  );
};
export default AvailableMeals;
