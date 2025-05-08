import React from 'react'

const MovieCard = ({movie:{poster_path, title, vote_average, original_language, release_date}}) => {
  return (
    <div className='movie-card' > 
    <img src= {poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : 'No-Poster.png'} alt="movie-poster" /> 
      
      <div className='mt-4'> 
        <h3>{title}</h3> 
        <div className='content'>  
            <div className='rating'>  
                <img src="star.svg" alt="Star Icon" /> 
                <p>{vote_average? vote_average.toFixed() : 'N/A'}</p> 
                <span></span> 
                <p className='lang'>{original_language}</p> 
                 <span></span> 
                 <p className='year'>{release_date ? release_date.split('_')[0] : "N/A"}</p>

            </div>

        </div>
      </div>  

      
      
    </div>
  )
}

export default MovieCard
