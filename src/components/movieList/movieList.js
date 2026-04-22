/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from "react"
import "./movieList.css"
import { useParams } from "react-router-dom"
import Cards from "../card/card"
import { tmdbGet } from "../../services/tmdb"


const MovieList = () => {
    
    const [movieList, setMovieList] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const {type} = useParams()

    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        getData()
    }, [type])

    const getData = () => {
        const safeType = type ? type : "popular"
        setIsLoading(true)
        setError("")
        tmdbGet(`/movie/${safeType}`)
          .then((data) => setMovieList(data.results || []))
          .catch((e) => {
              setMovieList([])
              setError(e?.message || "Gagal memuat daftar film.")
          })
          .finally(() => setIsLoading(false))
    }

    return (
        <div className="movie__list">
            <h2 className="list__title">{(type ? type : "popular").replaceAll("_", " ").toUpperCase()}</h2>
            {isLoading && <div style={{color:"white"}}>Loading...</div>}
            {!isLoading && error && <div style={{color:"white"}}>{error}</div>}
            <div className="list__cards">
                {
                    movieList.map(movie => (
                        <Cards key={movie.id} movie={movie} />
                    ))
                }
            </div>
        </div>
    )
}

export default MovieList