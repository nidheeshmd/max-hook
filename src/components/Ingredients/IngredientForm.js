import React, {useState} from 'react';

import Card from '../UI/Card';
import LoadingIndicator from '../UI/LoadingIndicator';

import './IngredientForm.css';

const IngredientForm = React.memo(props => {

  //const [inputState, setInputState] = useState({title:'', amount:''});

  const[enteredTitle, setEnteredTitle] = useState('');
  const[enteredAmount, setEnteredAmount] = useState('');

  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredient({
      title: enteredTitle,
      amount: enteredAmount
    });
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input 
            type="text" 
            id="title" 
            value={enteredTitle} 
            onChange={event => {
            setEnteredTitle(event.target.value)}}/>
            {/*'useState' always return an array with 2 elements.
            inputState[0] is the first element of useState hook, which is the current state.
            inputState[1] is the second element of use state, which is a function that assign the value to first element.
            here inputState[1]() represents a function.
            -------------------------------------------------------
            if we update one value of state the other values will replace, 
            so we must update every valeus of the state */}
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input 
            type="number" 
            id="amount" 
            value={enteredAmount}
            onChange={event => {
              setEnteredAmount(event.target.value)}}/>
            {/*in huge projects state will not update fast as we think. 
            so we using the arrow function here and 'prevInputState' here.
            it will update fastly. and it will automatically pass by react*/}
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            { props.loading ? <LoadingIndicator/> : null }
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
