import {Suspense, useEffect, useState } from 'react';  
import Search from './Components/search.jsx';
import Spinner from './Components/spinner.jsx'; 
import MovieCard from './movieCard.jsx';  
import {useDebounce} from 'react-use' 
import {updateSearchCount, getTrendingMovies} from './appwrite.js'
 
 
const API_BASE_URL = `https://api.themoviedb.org/3`;    

const API_KEY =  import.meta.env.VITE_TMBD_API_KEY;  

const options = { 
  method: 'GET', 
  headers:{ 
    accept: 'application/json',  
    Authorization: `Bearer ${API_KEY}` 
  }
 };   
  
const App = () => {  
const [isLoading, setIsLoading] = useState(false); 
const [movieList, setMovieList] = useState([]); 
const [errorMessage, setErrorMessage] = useState(""); 
const [searchTerm, setSearchTerm] = useState("");  
const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); 

const [trendingMovies, setTrendingMovies] = useState([]); 
const [loadTrendingMovies, setLoadTrendingMovies] = useState(false) 
const [errorTrendingMovies, setErrorTrendingMovies] = useState("")  

useDebounce(() => setDebouncedSearchTerm(searchTerm), 2000, [searchTerm])
  
const fetchMovies = async (query = "") => {  
  setIsLoading(true); 
  setErrorMessage(" "); 

  try{   
    
     
     const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURI(query)}`:
      `${API_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`; 
     
    const response = await fetch(endpoint, options); 
     
    if (!response.ok){ 
      throw new Error("Trouble fetching movies")
  }   

     const data = await response.json();   
     
      
    if(data.Response === "False"){ 
      setErrorMessage(data.Error || 'Failed to fetch movies') ;
      setMovieList([]);
      return;
    }

         
 setMovieList(data.results || []); 
 setErrorMessage(false);   

 if(query && data.results.length > 0) { 
  await updateSearchCount(query, data.results[0])}
} 
   
catch(error)
  {   
    console.error(`Error fetching movies: ${error} `); 
    setErrorMessage(`Error fetching movies. Please try again later`)
     
  } 
  finally{ 
    setIsLoading(false);  
    
  }}   
   
const fetchTrendingMovies = async () => {   
setLoadTrendingMovies(true); 
setErrorTrendingMovies('');
   
  try {
    const movies = await getTrendingMovies()   
     
    if (movies.Response === "False"){ 
      setErrorTrendingMovies(movies.error || "Failed to find trending movies at this time") 
      setTrendingMovies([])
    }
    console.log(movies);

    setTrendingMovies(movies || []); 
    setErrorTrendingMovies(false)
    
  
  } catch (error) {
    console.log(`Trending movies error; ${error}`);
    setErrorTrendingMovies('Failed to find trending movies at this time')
  } 
  finally{ 
    setLoadTrendingMovies(false);
  }
  
}
  
useEffect(() => { 
    fetchTrendingMovies()
   }, []);
   
  useEffect( () => {  
    fetchMovies(debouncedSearchTerm); 
   }, [debouncedSearchTerm]);   
     
return( 
  
  <main> 
    <div className='pattern'/>  
     
     <div className='wrapper'>  
      <header> 
        <img src="./hero.png" alt="Hero Banner" /> 
        <h1>Find <span className='text-gradient'>Movies </span>You'll Enjoy</h1>   

        <Search SearchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
         
      </header>   
       <section className='trending'>  
          <h2 className='mb-[20px]'>What we are watching</h2>  
          { 
          loadTrendingMovies ? <Spinner/> 
          :errorTrendingMovies ? (<p className='text-red-500 mt-[40px]'>{errorTrendingMovies}</p>) 
          :(  
           <ul> 
            { 
              trendingMovies.map((movie, index) => ( 
                <li key = {movie.$id}> 
                <p>{index + 1}</p>  
                <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))
            }
          </ul> ) }
         </section> 

  <section className='all-movies'> 
      <h2 className='text-white mt-[40px]'>All Movies</h2> 
       { 
        isLoading ? (<Spinner/>) : 
        errorMessage ? (<p className='text-red-500'>{errorMessage}</p>):  
        (  
          <ul> 
            {
              movieList.map((movie) =>  
                 (  
                  <div>
                 
                 <MovieCard key={movie.id} movie={movie}/> 
                 </div>
                 ) 
                 
              )  

              }  
          </ul> 
   
        )
         }      
    </section>

     </div>
  </main>
 ) 
 }    
export default App;
         
           
           




 