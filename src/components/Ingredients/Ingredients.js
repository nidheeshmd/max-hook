import React, {useState, useEffect, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

import Search from './Search';

const Ingredients = () => {

  const [UserIngredients, setUserIngredients] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const [AppError, setAppError] = useState();

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

  const addIngredientHandler = (ingredient) => {
    setIsLoading(true);
    fetch('https://react-hook-app-34f37.firebaseio.com/ingredients.json',
    {method:'POST', 
    body: JSON.stringify(ingredient),
    headers:{'Content-Type' : 'application/json'}
    }).then(response => {
      setIsLoading(false);
     return response.json();
    }).then(responseData =>{
      setUserIngredients((prevIngredients) => [
        ...prevIngredients,
        {id: responseData.name, ...ingredient}]);
    });
  };

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
      setUserIngredients(filteredIngredients)
  },[]);

  /* useCallback have 2 argument, first one is our function and 2nd one is 
  the dependency that change leads to execution of this hook.
  if [] then execute only once. */

  const removeIngredientHandler = ingredientId => {
    setIsLoading(true);
    fetch(`https://react-hook-app-34f37.firebaseio.com/ingredients/${ingredientId}.jon`,
    {method:'DELETE'
    }).then(response => {
      setUserIngredients(prevIngredients =>
        prevIngredients.filter(ingredient => ingredient.id !==ingredientId))
        setIsLoading(false);
    }).catch( error => {
      setAppError(error.message);
    });
  };

  const clearError = () => {
    setAppError(null);
    setIsLoading(false);
  }

  return (
    <div className="App">
      {AppError ? <ErrorModal onClose={clearError}>{AppError}</ErrorModal> : null}
      <IngredientForm 
      onAddIngredient = {addIngredientHandler}
      loading = {IsLoading}/>

      <section>
        <Search onLoadIngredients ={filteredIngredientsHandler}/>
       <IngredientList ingredients={UserIngredients} onRemoveItem ={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
