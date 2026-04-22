/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react"
import "./home.css"
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { Link } from "react-router-dom";
import MovieList from "../../components/movieList/movieList";
import { tmdbGet, tmdbImageUrl } from "../../services/tmdb";

const Home = () => {

    const [ popularMovies, setPopularMovies ] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [loadedBackdropIds, setLoadedBackdropIds] = useState(() => new Set())

    useEffect(() => {
        setIsLoading(true)
        setError("")
        setLoadedBackdropIds(new Set())
        tmdbGet("/movie/popular")
          .then((data) => setPopularMovies(data.results || []))
          .catch((e) => {
              setPopularMovies([])
              setError(e?.message || "Gagal memuat film populer.")
          })
          .finally(() => setIsLoading(false))
    }, [])

    return (
        <>
            <div className="poster">
                {isLoading && <div style={{color:"white", padding:"0 1rem"}}>Loading...</div>}
                {!isLoading && error && <div style={{color:"white", padding:"0 1rem"}}>{error}</div>}
                <Carousel
                    showThumbs={false}
                    autoPlay={true}
                    transitionTime={500}
                    infiniteLoop={true}
                    showStatus={false}
                    swipeable={true}
                    emulateTouch={true}
                    stopOnHover={true}
                    transitionTimingFunction="ease-in-out"
                >
                    {
                        popularMovies.map(movie => (
                            <Link key={movie.id} style={{textDecoration:"none",color:"white"}} to={`/movie/${movie.id}`} >
                                <div className="posterImage">
                                    <img
                                        src={tmdbImageUrl(movie?.backdrop_path)}
                                        alt={movie?.original_title || ""}
                                        loading="lazy"
                                        decoding="async"
                                        style={{
                                            width: "100%",
                                            height: "600px",
                                            objectFit: "cover",
                                            objectPosition: "center top",
                                            display: "block",
                                            opacity: loadedBackdropIds.has(movie.id) ? 1 : 0,
                                            transition: "opacity .6s ease-in-out"
                                        }}
                                        onLoad={() => {
                                            setLoadedBackdropIds((prev) => {
                                                const next = new Set(prev);
                                                next.add(movie.id);
                                                return next;
                                            })
                                        }}
                                    />
                                </div>
                                <div className="posterImage__overlay">
                                    <div className="posterImage__title">{movie ? movie.original_title: ""}</div>
                                    <div className="posterImage__runtime">
                                        {movie ? movie.release_date : ""}
                                        <span className="posterImage__rating">
                                            {movie ? movie.vote_average :""}
                                            <i className="fas fa-star" />{" "}
                                        </span>
                                    </div>
                                    <div className="posterImage__description">{movie ? movie.overview : ""}</div>
                                </div>
                            </Link>
                        ))
                    }
                </Carousel>
                <MovieList />
            </div>
        </>
    )
}

export default Home