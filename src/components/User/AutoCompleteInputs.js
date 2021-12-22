/* global google */
import React, { useEffect, useRef, useContext, useState } from 'react';
import AuthContext from '../../store/auth-context';
import styles from './AutoCompleteInputs.module.css'
import Card from '../UI/Card/Card';

export default function AutoCompleteInputs(props) {
  'use strict';
  const googleScript = document.getElementById('google-map-script');

  const authCtx = useContext(AuthContext)
  const formattedError = authCtx.errorMessage;
  const [error, setError] = useState()

  const streetRef = useRef();
  const optionalAddressRef = useRef();
  const cityRef = useRef();
  const zipcodeRef = useRef();
  const stateRef = useRef();
  const countryRef = useRef();

  const componentForm = [
    'location',
    'locality',
    'administrative_area_level_1',
    'country',
    'postal_code',
  ];

  let map;
  let marker;

  // When user is typing suggest auto-complete fields
  useEffect(() => {
    const initMap = () => {
      if (google) {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 11,
          center: { lat: 37.4221, lng: -122.0841 },
          mapTypeControl: false,
          fullscreenControl: true,
          zoomControl: true,
          streetViewControl: true,
        });

        marker = new google.maps.Marker({ map: map, draggable: false });
        const autocompleteInput = document.getElementById('location');
        const autocomplete = new google.maps.places.Autocomplete(
          autocompleteInput,
          {
            fields: ['address_components', 'geometry', 'name'],
            types: ['address'],
          }
        );
        autocomplete.addListener('place_changed', function () {
          marker.setVisible(false);
          const place = autocomplete.getPlace();
          if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert(
              "No details available for input: '" + place.name + "'"
            );
            return;
          }
          renderAddress(place);
          fillInAddress(place);
        });
      }
      googleScript.addEventListener('load', () => {
        // Patiently waiting to do the thing
        console.log('LOADING');
      });
    };
    initMap();
  }, []);

  // Automatically fills in the rest of the input based on user selection
  function fillInAddress(place) {
    // optional parameter
    const addressNameFormat = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'short_name',
      country: 'long_name',
      postal_code: 'short_name',
    };
    // Grab entire unformatted address
    const getAddressComp = function (type) {
      for (const component of place.address_components) {
        if (component.types[0] === type) {
          return component[addressNameFormat[type]];
        }
      }
      return '';
    };
    streetRef.current.value =
      getAddressComp('street_number') + ' ' + getAddressComp('route');
    for (const component of componentForm) {
      // Location field is handled separately above as it has different logic.
      if (component !== 'location') {
        document.getElementById(component).value = getAddressComp(component);
      }
    }
  }

  // Position predictions and render below
  function renderAddress(place) {
    map.setCenter(place.geometry.location);
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
  }


  // SUBMIT NEW USER DATA
  const submitForm = () => {
    const addressData = {
      address: streetRef.current.value,
      address2: optionalAddressRef.current.value,
      city: cityRef.current.value,
      state: stateRef.current.value,
      zipcode: zipcodeRef.current.value,
      country: countryRef.current.value
    }
    props.onSubmit(addressData, 'SUBMIT')
  }

  // Load error if any
  useEffect(() => {
    setError(formattedError)
    const showError = setTimeout(() => {
      authCtx.displayError(null, 'RESET')
    }, 3000)
    return () => {
      clearInterval(showError)
    }
  }, [formattedError])

  return <Card className={styles.card}>
    <h1 className={styles.title}>Address Info</h1>
    <div className={styles.auth}>
      <div className={styles.control}>
        <label htmlFor='location'>Address</label>
        <input
          type="text"
          ref={streetRef}
          placeholder="Address"
          autoComplete="off"
          id="location"
        />
        <label htmlFor='address2'>Address 2</label>
        <input type="text" ref={optionalAddressRef} placeholder="Apt, Suite, etc (optional)" id="address2"/>
        <label htmlFor='locality'>City</label>
        <input type="text" ref={cityRef} placeholder="City" id="locality" />
        <div class="half-input-container">
          <label htmlFor='administrative_area_level_1'>State</label>
          <input
            ref={stateRef}
            type="text"
            class="half-input"
            placeholder="State/Province"
            id="administrative_area_level_1"
          />
          <label htmlFor='postal_code'>Zipcode</label>
          <input
            ref={zipcodeRef}
            type="text"
            class="half-input"
            placeholder="Zip/Postal code"
            id="postal_code"
          />
        </div>
        <label htmlFor='country'>Country</label>
        <input
          type="text"
          ref={countryRef}
          placeholder="Country"
          id="country"
        />
      </div>
      <div class="map" id="map"></div>
      {error && <p className={styles.error}>{error}</p>}
    <button className={styles.button} onClick={submitForm}>Create Account</button>
    <button className={styles['return-button']} onClick={props.onBack}>Go Back</button>
    </div>
    </Card>
}
