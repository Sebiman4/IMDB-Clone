/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./Header.css"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"

const Header = () => {
    const navigate = useNavigate()
    const [query, setQuery] = useState("")

    const onSubmit = (e) => {
        e.preventDefault()
        const q = query.trim()
        if (!q) return
        navigate(`/search?q=${encodeURIComponent(q)}`)
    }

    return (
        <div className="header">
            <div className="headerLeft">
                <Link to="/"><img className="header__icon" src={logo} alt="CINEDB" /></Link>
                <Link to="/movies/popular" style={{textDecoration: "none"}}><span>Popular</span></Link>
                <Link to="/movies/top_rated" style={{textDecoration: "none"}}><span>Top Rated</span></Link>
                <Link to="/movies/upcoming" style={{textDecoration: "none"}}><span>Upcoming</span></Link>
            </div>
            <div className="headerRight">
                <form className="headerSearch" onSubmit={onSubmit}>
                    <input
                        className="headerSearch__input"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search movies..."
                        aria-label="Search movies"
                    />
                    <button className="headerSearch__button" type="submit">Search</button>
                </form>
            </div>
        </div>
    )
}

export default Header;