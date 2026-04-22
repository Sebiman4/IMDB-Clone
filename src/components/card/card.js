/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "./card.css"
import { Link } from "react-router-dom"
import { tmdbImageUrl } from "../../services/tmdb";

const Cards = ({movie}) => {

    const [isImgLoading, setIsImgLoading] = useState(true)

    const title = movie?.title || movie?.original_title || movie?.name || movie?.original_name || ""
    const date = movie?.release_date || movie?.first_air_date || ""

    return (
        <Link to={`/movie/${movie.id}`} style={{textDecoration:"none", color:"white"}}>
            <div className="cards">
                {isImgLoading && (
                    <SkeletonTheme color="#202020" highlightColor="#444">
                        <Skeleton height={300} duration={2} />
                    </SkeletonTheme>
                )}
                <img
                    className="cards__img"
                    src={tmdbImageUrl(movie?.poster_path)}
                    alt={title}
                    style={isImgLoading ? { display: "none" } : undefined}
                    onLoad={() => setIsImgLoading(false)}
                    onError={() => setIsImgLoading(false)}
                />
                <div className="cards__overlay">
                    <div className="card__title">{title}</div>
                    <div className="card__runtime">
                        {date}
                        <span className="card__rating">{movie?movie.vote_average:""}<i className="fas fa-star" /></span>
                    </div>
                    <div className="card__description">{movie ? movie.overview.slice(0,118)+"..." : ""}</div>
                </div>
            </div>
        </Link>
    )
}

export default Cards