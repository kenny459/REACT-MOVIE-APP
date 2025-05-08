import React from 'react'  




const Search = ({SearchTerm, setSearchTerm}) => { 

  return (
    <div className='search'>  
    <div> 
    <img src= "search.svg" alt="Search" /> 
        
       <input type="text"  

       placeholder = 'Find the movie you want!'  
        
       value = {SearchTerm}

       onChange={(e) => setSearchTerm(e.target.value) }/>
       </div> 
    </div>
  )
}

export default Search
