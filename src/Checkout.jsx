import React, { useState } from 'react';
import { saveShippingAddress } from './services/shippingService';
import { useCart } from './cartContext';

// Declaring outside component to avoid recreation on each render
const emptyAddress = {
  city: '',
  country: ''
};

const STATUS = {
  IDLE: 'IDLE',
  SUBMITTED: 'SUBMITTED',
  SUBMITTING: 'SUBMITTING',
  COMPLETED: 'COMPLETED'
};

export default function Checkout() {
  const { cart, dispatch } = useCart();
  const [address, setAddress] = useState(emptyAddress);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [saveError, setSaveError] = useState(null);
  const [touched, setTouched] = useState({});

  // Derived State
  const errors = getErrors(address);
  const isValid = Object.keys(errors).length === 0;

  function handleChange(event) {
    event.persist(); //persist the event
    setAddress((curAddress) => {
      return { ...curAddress, [event.target.id]: event.target.value };
    });
  }

  function handleBlur(event) {
    event.persist(); //persist the event
    console.log('handleBlur', event);
    setTouched((cur) => {
      return { ...cur, [event.target.id]: true };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(STATUS.SUBMITTING);
    if (!isValid) {
      setStatus(STATUS.SUBMITTED);
      return;
    }

    try {
      await saveShippingAddress(address);
      dispatch({
        type: 'empty'
      });
      setStatus(STATUS.COMPLETED);
    } catch (e) {
      // setStatus(STATUS.IDLE);
      setSaveError(e);
    }
  }

  function getErrors(address) {
    const result = {};
    if (!address.city) result.city = 'City is required';
    if (!address.country) result.country = 'Country is required';
    return result;
  }

  if (saveError) throw saveError;
  if (status === STATUS.COMPLETED) {
    return <h1>Thanks</h1>;
  }
  return (
    <>
      <h1>Shipping Info</h1>
      {!isValid && status === STATUS.SUBMITTED && (
        <div role="alert">
          <p>
            Please fix the following errors
            <ul>
              {Object.keys(errors).map((key) => (
                <li key={key}>{errors[key]}</li>
              ))}
            </ul>
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="city">City</label>
          <br />
          <input
            id="city"
            type="text"
            value={address.city}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <p role="alert">
            {(touched.city || status === STATUS.SUBMITTED) && errors.city}
          </p>
        </div>

        <div>
          <label htmlFor="country">Country</label>
          <br />
          <select
            id="country"
            value={address.country}
            onBlur={handleBlur}
            onChange={handleChange}>
            <option value="">Select Country</option>
            <option value="China">China</option>
            <option value="India">India</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="USA">USA</option>
          </select>
          <p role="alert">
            {(touched.country || status === STATUS.SUBMITTED) && errors.country}
          </p>
        </div>

        <div>
          <input
            type="submit"
            disabled={status === STATUS.SUBMITTING}
            className="btn btn-primary"
            value="Save Shipping Info"
          />
        </div>
      </form>
    </>
  );
}
