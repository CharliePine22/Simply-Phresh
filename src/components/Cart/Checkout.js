import useInput from '../../hooks/use-input';
import classes from './Checkout.module.css';

const entryValid = value => value !== ''

const Checkout = (props) => {
    // NAME INPUT HOOK
  const {
      value: nameInputValue,
      hasError: nameHasError,
      isValid: nameIsValid,
      updateValue: nameUpdateValue,
      setBlur: nameSetBlur,
      resetFields: nameReset
  } = useInput(entryValid)

  // STREET ADDRESS INPUT HOOK
  const {
      value: streetInputValue,
      hasError: streetHasError,
      isValid: streetIsValid,
      updateValue: streetUpdateValue,
      setBlur: streetSetBlur,
      resetFields: streetReset
  } = useInput(entryValid)

  // ZIPCODE INPUT HOOK
  const {
      value: zipCodeInputValue,
      hasError: zipCodeHasError,
      isValid: zipCodeIsValid,
      updateValue: zipCodeUpdateValue,
      setBlur: zipCodeSetBlur,
      resetFields: zipCodeReset
  } = useInput(value => value.toString().length === 5)

  // CITY NAME INPUT HOOK
  const {
      value: cityInputValue,
      hasError: cityHasError,
      isValid: cityIsValid,
      updateValue: cityUpdateValue,
      setBlur: citySetBlur,
      resetFields: cityReset
  } = useInput(entryValid)

  let formIsValid = false;
  if (nameIsValid && streetIsValid && zipCodeIsValid && cityIsValid) {
    formIsValid = true
}

  const confirmHandler = (event) => {
    event.preventDefault();
    if (!formIsValid) {
        console.log('INVALID')
        return;
    }
  
    const userData = {
        name: nameInputValue,
        street: streetInputValue,
        zipCode: zipCodeInputValue,
        street: streetInputValue
    }
    props.onSubmit(userData)

    nameReset()
    streetReset()
    zipCodeReset()
    cityReset()
  };

  const nameInputClasses = nameHasError ?  `${classes.control} ${classes.invalid}` : classes.control
  const streetInputClasses = streetHasError ? `${classes.control} ${classes.invalid}` : classes.control 
  const zipCodeInputClasses = zipCodeHasError ? `${classes.control} ${classes.invalid}` : classes.control 
  const cityInputClasses = cityHasError ? `${classes.control} ${classes.invalid}` : classes.control

  return (
    <form className={classes.form} onSubmit={confirmHandler}>
      <div className={nameInputClasses}>
        <label htmlFor='name'>Your Name</label>
        <input value={nameInputValue} type='text' id='name' onChange={nameUpdateValue} onBlur={nameSetBlur}/>
        {nameHasError && <p>Please dont leave the name field empty!</p>}
      </div>
      <div className={streetInputClasses}>
        <label htmlFor='street'>Street</label>
        <input value={streetInputValue} type='text' id='street' onChange={streetUpdateValue} onBlur={streetSetBlur}/>
        {streetHasError && <p>Please dont leave the address field empty!</p>}
      </div>
      <div className={zipCodeInputClasses}>
        <label htmlFor='postal'>Postal Code</label>
        <input value={zipCodeInputValue} type='text' id='postal' onChange={zipCodeUpdateValue} onBlur={zipCodeSetBlur}/>
        {zipCodeHasError && <p>Please enter a valid 5-didget zipcode!</p>}
      </div>
      <div className={cityInputClasses}>
        <label htmlFor='city'>City</label>
        <input value={cityInputValue} type='text' id='city' onChange={cityUpdateValue} onBlur={citySetBlur}/>
        {cityHasError && <p>Please dont leave the city field empty!</p>}
      </div>
      <div className={classes.actions}>
        <button type='button' onClick={props.onCancel}>
          Cancel
        </button>
        <button className={classes.submit}>Confirm</button>
      </div>
    </form>
  );
};

export default Checkout;