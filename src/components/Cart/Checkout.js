import { useState } from 'react';
import useInput from '../../hooks/use-input';
import classes from './Checkout.module.css';

const entryValid = (value) => value !== '';

const Checkout = (props) => {
  const [hasApartment, setHasApartment] = useState(false);
  const [apartmentBlank, setApartmentBlank] = useState(false);

  // NAME INPUT HOOK
  const {
    value: nameInputValue,
    hasError: nameHasError,
    isValid: nameIsValid,
    updateValue: nameUpdateValue,
    setBlur: nameSetBlur,
    resetFields: nameReset,
  } = useInput(entryValid);

  // STREET ADDRESS INPUT HOOK
  const {
    value: streetInputValue,
    hasError: streetHasError,
    isValid: streetIsValid,
    updateValue: streetUpdateValue,
    setBlur: streetSetBlur,
    resetFields: streetReset,
  } = useInput(entryValid);

  // APARTMENT INPUT HOOK
  const {
    value: apartmentInputValue,
    hasError: apartmentHasError,
    isValid: apartmentIsValid,
    updateValue: apartmentUpdateValue,
    setBlur: apartmentSetBlur,
    resetFields: apartmentReset,
  } = useInput(entryValid);

  // ZIPCODE INPUT HOOK
  const {
    value: zipCodeInputValue,
    hasError: zipCodeHasError,
    isValid: zipCodeIsValid,
    updateValue: zipCodeUpdateValue,
    setBlur: zipCodeSetBlur,
    resetFields: zipCodeReset,
  } = useInput((value) => value.toString().length === 5);

  // CITY NAME INPUT HOOK
  const {
    value: cityInputValue,
    hasError: cityHasError,
    isValid: cityIsValid,
    updateValue: cityUpdateValue,
    setBlur: citySetBlur,
    resetFields: cityReset,
  } = useInput(entryValid);

  let formIsValid = false;
  if (nameIsValid && streetIsValid && zipCodeIsValid && cityIsValid) {
    formIsValid = true;
  }

  // Handler to check if the apartment checkbox was clicked
  const hasApartmentHandler = (event) => {
    if (event.target.checked) {
      setHasApartment(true);
    } else {
      setHasApartment(false);
    }
  };

  // HGANDLER TO SUBMIT DATA
  const confirmHandler = (event) => {
    event.preventDefault();
    if (hasApartment && apartmentInputValue === '') {
      setApartmentBlank(true);
      formIsValid = false;
    }

    if (!formIsValid) {
      return;
    }

    let userData;
    if (hasApartment) {
      userData = {
        name: nameInputValue,
        street: streetInputValue,
        apartment: apartmentInputValue,
        zipCode: zipCodeInputValue,
        city: cityInputValue,
      };
    }

    if (!hasApartment) {
      userData = {
        name: nameInputValue,
        street: streetInputValue,
        apartment: event.target.apartment.value,
        zipCode: zipCodeInputValue,
        city: cityInputValue,
      };
    }

    props.onSubmit(userData);
    nameReset();
    streetReset();
    apartmentReset();
    zipCodeReset();
    cityReset();
  };

  const nameInputClasses = nameHasError
    ? `${classes.control} ${classes.invalid}`
    : classes.control;
  const streetInputClasses = streetHasError
    ? `${classes.control} ${classes.invalid}`
    : classes.control;
  const zipCodeInputClasses = zipCodeHasError
    ? `${classes.control} ${classes.invalid}`
    : classes.control;
  const cityInputClasses = cityHasError
    ? `${classes.control} ${classes.invalid}`
    : classes.control;
  const apartmentClasses =
    apartmentBlank || apartmentHasError
      ? `${classes['full-address']} ${classes.invalid}`
      : classes['full-address'];

  return (
    <form className={classes.form} onSubmit={confirmHandler}>
      <div className={nameInputClasses}>
        <label htmlFor="name">Your Name</label>
        <input
          value={nameInputValue}
          type="text"
          id="name"
          onChange={nameUpdateValue}
          onBlur={nameSetBlur}
        />
        {nameHasError && <p>Please dont leave the name field empty!</p>}
      </div>
      <div className={streetInputClasses}>
        <label htmlFor="street">Street Address</label>
        <p className={classes.notify}>
          Check box if you need to add an apartment/unit number.
        </p>
        <span>
          <input
            value={streetInputValue}
            type="text"
            id="street"
            onChange={streetUpdateValue}
            onBlur={streetSetBlur}
          />
        </span>
        <span>
          <input
            className={classes['mobile-view-apartment']}
            id="mobile-view-apartment"
            type="text"
            name='apartment'
            placeholder="(Optional) Apartment/Unit number"
          />
          <input
            onChange={hasApartmentHandler}
            type="checkbox"
            id="has_apartment"
          />
        </span>
        {hasApartment && (
          <div className={apartmentClasses}>
            <span>
              <input
                id="apartment-number"
                onChange={apartmentUpdateValue}
                onBlur={apartmentSetBlur}
                value={apartmentInputValue}
                type="text"
                placeholder="#203"
              />
            </span>
            {(apartmentBlank || apartmentHasError) && (
              <span>
                <p>Please enter an apartment/unit number!</p>
              </span>
            )}
          </div>
        )}
        {streetHasError && <p>Please dont leave the address field empty!</p>}
      </div>
      <div className={zipCodeInputClasses}>
        <label htmlFor="postal">Postal Code</label>
        <input
          value={zipCodeInputValue}
          type="text"
          id="postal"
          onChange={zipCodeUpdateValue}
          onBlur={zipCodeSetBlur}
        />
        {zipCodeHasError && <p>Please enter a valid 5-didget zipcode!</p>}
      </div>
      <div className={cityInputClasses}>
        <label htmlFor="city">City</label>
        <input
          value={cityInputValue}
          type="text"
          id="city"
          onChange={cityUpdateValue}
          onBlur={citySetBlur}
        />
        {cityHasError && <p>Please dont leave the city field empty!</p>}
      </div>
      <div className={classes.actions}>
        <button type="button" onClick={props.onCancel}>
          Cancel
        </button>
        <button className={classes.submit}>Confirm</button>
      </div>
    </form>
  );
};

export default Checkout;
