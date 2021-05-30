import React, { useState } from 'react';
import YouTube from 'react-youtube';
import axios from './axios';
import movieTrailer from 'movie-trailer';
import './Row.css'

function Row({ title, fetchUrl, isLargeRow }) {

    const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/original';
    const [movies, setMovies] = React.useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    const fetchData = async () => {
        const response = await axios.get(fetchUrl);
        setMovies(response.data.results);
    }

    const handleClick = (movie) => {
        if (trailerUrl) {
            setTrailerUrl("");
        } else {
            movieTrailer(movie?.title || movie?.original_name || movie?.name || "")
                .then((url) => {
                    const newUrl = new URL(url);
                    console.log(newUrl);
                    const urlParams = new URLSearchParams(newUrl.search);
                    setTrailerUrl(urlParams.get('v'));
                })
                .catch((error) => console.log(error));
        }
    }

    React.useEffect(() => {
        fetchData();
    }, [fetchUrl]);

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        }
    };
    return (
        <div className="row">
            <h2>{title}</h2>
            <div className="row_posters">
                {
                    movies.map((movie) =>
                        <img
                            key={movie.id}
                            onClick={() => handleClick(movie)}
                            className={`row_poster ${isLargeRow && "row_posterLarge"}`}
                            src={`${BASE_IMAGE_URL}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                            alt={movie.name} />
                    )
                }
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
    );
}

export default Row;