import React, {useEffect, useState} from "react";
import axios from "./axios";
import YouTube from "react-youtube";
import movieTrailer from 'movie-trailer'
import './Row.css';

const baseUrl = 'https://image.tmdb.org/t/p/original/';

function Row({title, fetchUrl, isLargeRow}) {

    const [movies, setMovies] = useState([])
    const [trailerurl, setTrailerurl] = useState(null)

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            console.log(request.data.results)
            setMovies(request.data.results)
            return request;
        }
        fetchData();
    }, [fetchUrl]);

    const opts = {
        height: '390',
        width: '100%',
        playerVars: {
            autoplay: 1,
        },
    };

    const handleClick= (movie) => {
        if (trailerurl) {
            setTrailerurl(null)
        }
        else{
            movieTrailer(movie?.name || '')
                .then(url => {
                    const urlParams = new URLSearchParams(new URL(url).search)
                    setTrailerurl(urlParams.get('v'))
                })
                .catch(error => console.log(error))
        }

    }

    return(
        <div className='row'>
            <h2 className='row_title'>{title}</h2>
            <div className='row_posters'>

                {movies.map(movie =>(
                    <div className='movie_container' onClick={() => handleClick(movie)}>
                        <img
                            key={movie.id}
                            className={isLargeRow ? 'row_posterLarge movie_image': 'row_poster movie_image'}
                            src={isLargeRow ? baseUrl + movie.poster_path: baseUrl + movie.backdrop_path}
                            alt={movie.name}
                        />
                        <div className='row_poster'>
                            <p className='movie_title'>{movie?.title || movie?.name || movie?.original_name}</p>
                            <span className='movie_rating'>{movie.vote_average}</span>
                        </div>

                    </div>
                ))}

            </div>
            {trailerurl ? <YouTube videoId={trailerurl} opts={opts}/>: null}
         </div>
    )
}

export default Row
