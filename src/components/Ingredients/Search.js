import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const {onLoadIngredients} = props; //array destructuring.
  
  const [enteredFilter, setEnteredFilter] = useState('');

  const inputRef = useRef(); 
  /* useRef hook is used to get the latest value from the input
  here entered filter maybe not get the latest value */

  useEffect(() => {
   const timer = setTimeout(() => {
      if(enteredFilter === inputRef.current.value){
      const query = enteredFilter.length === 0
      ? ''
      : `?orderBy="title"&equalTo="${enteredFilter}"`;

      fetch('https://react-hook-app-34f37.firebaseio.com/ingredients.json' + query)
      .then(response => response.json())
      .then(responseData => {
        const loadedIngredients = [];
        for(const key in responseData){
          loadedIngredients.push({
            id:key,
            title: responseData[key].title,
            amount: responseData[key].amount
          });
          console.log(responseData);
        }
        console.log(enteredFilter);
        
        console.log(loadedIngredients);
        console.log(loadedIngredients);
  
        onLoadIngredients(loadedIngredients);
        /* this leads to infinit loop because évery time we enter a data here, 'filteredIngredientsHandler'
        of Ingredients.js, execute. to avoid this situation we use useCallback hook.  */
      });
    }},500);//using timer to avoid making request after every key press.
    
    return()=>{
      clearTimeout(timer);
    }; //this is a cleanup function that clear the previous timer when the next character enter.
    //always have one ongoing timer
   
  }, [enteredFilter,onLoadIngredients,inputRef]);
  /* as we know functions in javascript also considered as objects.
  if any change in parent props is change, must this useEffect exicute, for that
  we destructor the props and took out the 'onLoadIngredients' function and pass it as
  the second argument of the second parameter of useEffect. so when the value change in parent,
  also this component re-ender*/

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
          ref={inputRef}
          type="text" 
          value={enteredFilter} 
          onChange={event => setEnteredFilter(event.target.value)}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
