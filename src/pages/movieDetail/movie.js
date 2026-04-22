/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import React, {useEffect, useState} from "react"
import "./movie.css"
import { useParams } from "react-router-dom"
import { tmdbGet, tmdbImageUrl } from "../../services/tmdb"
import Cards from "../../components/card/card"

const Movie = () => {
    const [currentMovieDetail, setMovie] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const { id } = useParams()

    useEffect(() => {
        getData()
        window.scrollTo(0,0)
    }, [id])

    const getData = async () => {
        setIsLoading(true)
        setError("")
        try {
            const data = await tmdbGet(`/movie/${id}`, {
                append_to_response: "credits,videos,recommendations"
            })
            setMovie(data)
        } catch (e) {
            setMovie(undefined)
            setError(e?.message || "Gagal memuat detail film.")
        } finally {
            setIsLoading(false)
        }
    }

    const trailer = currentMovieDetail?.videos?.results?.find(
        (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
    )

    const cast = currentMovieDetail?.credits?.cast?.slice(0, 12) || []
    const recommendations = currentMovieDetail?.recommendations?.results?.slice(0, 12) || []

    return (
        <div className="movie">
            {isLoading && <div className="movie__status">Loading...</div>}
            {!isLoading && error && <div className="movie__status movie__status--error">{error}</div>}
            <div className="movie__intro">
                <img className="movie__backdrop" src={tmdbImageUrl(currentMovieDetail?.backdrop_path)} />
            </div>
            <div className="movie__detail">
                <div className="movie__detailLeft">
                    <div className="movie__posterBox">
                        <img className="movie__poster" src={tmdbImageUrl(currentMovieDetail?.poster_path)} />
                    </div>
                </div>
                <div className="movie__detailRight">
                    <div className="movie__detailRightTop">
                        <div className="movie__name">{currentMovieDetail ? currentMovieDetail.original_title : ""}</div>
                        <div className="movie__tagline">{currentMovieDetail ? currentMovieDetail.tagline : ""}</div>
                        <div className="movie__rating">
                            {currentMovieDetail ? currentMovieDetail.vote_average: ""} <i className="fas fa-star" />
                            <span className="movie__voteCount">{currentMovieDetail ? "(" + currentMovieDetail.vote_count + ") votes" : ""}</span>
                        </div>  
                        <div className="movie__runtime">{currentMovieDetail ? currentMovieDetail.runtime + " mins" : ""}</div>
                        <div className="movie__releaseDate">{currentMovieDetail ? "Release date: " + currentMovieDetail.release_date : ""}</div>
                        <div className="movie__genres">
                            {
                                currentMovieDetail && currentMovieDetail.genres
                                ? 
                                currentMovieDetail.genres.map(genre => (
                                    <span className="movie__genre" key={genre.id} id={genre.id}>{genre.name}</span>
                                )) 
                                : 
                                ""
                            }
                        </div>
                    </div>
                    <div className="movie__detailRightBottom">
                        <div className="synopsisText">Synopsis</div>
                        <div>{currentMovieDetail ? currentMovieDetail.overview : ""}</div>
                    </div>
                    
                </div>
            </div>
            <div className="movie__links">
                <div className="movie__heading">Useful Links</div>
                {
                    currentMovieDetail && currentMovieDetail.homepage && <a href={currentMovieDetail.homepage} target="_blank" style={{textDecoration: "none"}}><p><span className="movie__homeButton movie__Button">Homepage <i className="newTab fas fa-external-link-alt"></i></span></p></a>
                }
                {
                    currentMovieDetail && currentMovieDetail.imdb_id && <a href={"https://www.imdb.com/title/" + currentMovieDetail.imdb_id} target="_blank" style={{textDecoration: "none"}}><p><span className="movie__imdbButton movie__Button">IMDb<i className="newTab fas fa-external-link-alt"></i></span></p></a>
                }
            </div>

            {trailer?.key && (
                <div className="movie__section">
                    <div className="movie__heading">Trailer</div>
                    <div className="movie__trailer">
                        <iframe
                            title="Trailer"
                            src={`https://www.youtube.com/embed/${trailer.key}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}

            {cast.length > 0 && (
                <div className="movie__section">
                    <div className="movie__heading">Cast</div>
                    <div className="movie__castGrid">
                        {cast.map((person) => (
                            <div className="movie__castCard" key={person.cast_id || person.credit_id || person.id}>
                                <img
                                    className="movie__castImg"
                                    src={tmdbImageUrl(person.profile_path, "w185")}
                                    alt={person.name}
                                />
                                <div className="movie__castName">{person.name}</div>
                                <div className="movie__castRole">{person.character}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {recommendations.length > 0 && (
                <div className="movie__section">
                    <div className="movie__heading">Recommendations</div>
                    <div className="movie__recommendations">
                        {recommendations.map((m) => (
                            <Cards key={m.id} movie={m} />
                        ))}
                    </div>
                </div>
            )}

            <div className="movie__heading">Production companies</div>
            <div className="movie__production">
                {
                    currentMovieDetail && currentMovieDetail.production_companies && currentMovieDetail.production_companies.map(company => (
                        company.logo_path 
                            ? (
                                <span className="productionCompanyImage" key={company.id || company.name}>
                                    <img className="movie__productionComapany" src={tmdbImageUrl(company.logo_path)} />
                                    <span>{company.name}</span>
                                </span>
                            )
                            : null
                    ))
                }
            </div>
        </div>
    )
}

export default Movie