import React, {useState, useReducer, useEffect, useCallback, useMemo} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

import Search from './Search';

const ingredientReducer = (currentIngredients, action) => {
  switch(action.type){
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
      default:
        throw new Error('should not get there!');
  }
};

const httpReducer = (curHttpState, action) => {
  switch(action.type){
    case 'SEND':
      return {
        loading: true, error: null
      };
    case 'RESPONSE':
      return{
        ...curHttpState, loading: false
      };
    case 'ERROR':
      return {
        loading: false, error: action.errorMessage
      };
    case 'CLEAR':
      return{...curHttpState, error: null}
    default:
    throw new Error('End of switch');
  }
};

const Ingredients = () => {
const [UserIngredients, dispatch]=useReducer(ingredientReducer,[]);
const [httpState, dispatchHttp] = useReducer(httpReducer, {loading:false, error: null});
/* useReducer takes two arguments 1st one is our reducer class(here: ingredientReducer)
and second one (optional argument) is starting state. here we passing empty array as currentIngredients at first 
useReducer returns an array with 2 elements. first one is a state(here: UserIngredients)
second one is a function that handle by the reducer. we can put any name to the 
function.
here we call second function 'dispatch' instead of 'setUserIngredients'*/

  //const [UserIngredients, setUserIngredients] = useState([]);
  //const [IsLoading, setIsLoading] = useState(false);
  //const [AppError, setAppError] = useState();

  //useEffect will work after and every component renter.
  /* useEffect always have two arguments.1st one is the function that execute after every rendered cycle.
  2nd argument is the array with the dependency of your function. That is it will work only when the dependency
  change. Example - here : UserIngredients 
  when it is []    (empty array, useEffect will work only once, after the first render)*/
  /*useEffect(() => {
    fetch('https://react-hook-app-34f37.firebaseio.com/ingredients.json')
  .then(response => response.json())
  .then(responseData => {
    const loadedIngredients = [];
    for(const key in responseData){
      loadedIngredients.push({
        id:key,
        title: responseData[key].title,
        amount: responseData[key].amount
      });
    }
    setUserIngredients(loadedIngredients);
  });
  }, []);*/

  useEffect(() => {
    console.log('updated',UserIngredients);
  },[UserIngredients]);

  const addIngredientHandler = useCallback((ingredient) => {
    //setIsLoading(true);
dispatchHttp({type:'SEND'}); //this will automatically set loading is true and error is null
    fetch('https://react-hook-app-34f37.firebaseio.com/ingredients.json',
    {method:'POST',
    body: JSON.stringify(ingredient),
    headers:{'Content-Type' : 'application/json'}
    }).then(response => {
      //setIsLoading(false);
      dispatchHttp({type:'RESPONSE'});
     return response.json();
    }).then(responseData =>{
      //setUserIngredients((prevIngredients) => [
      //  ...prevIngredients,
      //  {id: responseData.name, ...ingredient}]);
      dispatch({
        type: 'ADD', 
        ingredient:{id: responseData.name, ...ingredient}});
    });
  },[]);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
      //setUserIngredients(filteredIngredients);
      dispatch({type: 'SET', ingredients: filteredIngredients});
  },[]);

  /* useCallback have 2 argument, first one is our function and 2nd one is 
  the dependency that change leads to execution of this hook.
  if [] then execute only once. */

  const removeIngredientHandler = useCallback((ingredientId) => {
    //setIsLoading(true);
    dispatchHttp({type:'SEND'});
    fetch(`https://react-hook-app-34f37.firebaseio.com/ingredients/${ingredientId}.json`,
    {method:'DELETE'
    }).then(response => {
      dispatchHttp({type:'RESPONSE'});
      //setUserIngredients(prevIngredients =>
      //prevIngredients.filter(ingredient => ingredient.id !==ingredientId));
        dispatch({type: 'DELETE', id:ingredientId});
        //setIsLoading(false);
    }).catch( error => {
      //setAppError(error.message);
      dispatchHttp({type: 'ERROR', errorMessage: error.message});
    });
  },[]);

  const clearError = useCallback(() => {
    //setAppError(null);
    //setIsLoading(false);
    dispatchHttp({type: 'CLEAR'});
  },[]);

  const ingredientList = useMemo(() => {
    return(
      <IngredientList 
      ingredients={UserIngredients} 
      onRemoveItem ={removeIngredientHandler}/>
    );
  },[UserIngredients,removeIngredientHandler]);

  return (
    <div className="App">
      {httpState.error ? <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal> : null}
      <IngredientForm 
      onAddIngredient = {addIngredientHandler}
      loading = {httpState.loading}/>

      <section>
        <Search onLoadIngredients ={filteredIngredientsHandler}/>
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
