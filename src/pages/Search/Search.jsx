import React, { useEffect, useState } from 'react';
import './Search.css';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import netflix_spinner from '../../assets/netflix_spinner.gif';

const Search = () => {
    const [searchParams] = useSearchParams();
    const { type } = useParams(); // 'movie' or 'tv' for browse
    const query = searchParams.get('q');

    const [apiData, setApiData] = useState([]);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`
        }
    };

    useEffect(() => {
        setLoading(true);
        let url = "";
        if (query) {
            setTitle(`Search Results for "${query}"`);
            url = `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=1`;
        } else if (type) {
            if (type === 'upcoming') {
                setTitle("Upcoming Movies");
                url = `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1`;
            } else if (type === 'now_playing') {
                setTitle("Now Playing");
                url = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1`;
            } else if (type === 'tv') {
                setTitle("Popular TV Shows");
                url = `https://api.themoviedb.org/3/tv/popular?language=en-US&page=1`;
            } else {
                setTitle("Popular Movies");
                url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`;
            }
        }

        if (url) {
            fetch(url, options)
                .then(res => res.json())
                .then(res => {
                    setApiData(res.results);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [query, type]);

    if (loading) {
        return <div className="login-spinner"><img src={netflix_spinner} alt="" /></div>
    }

    return (
        <div className='search-page'>
            <Navbar />
            <div className="search-container">
                <h2>{title}</h2>
                <div className="search-grid">
                    {apiData && apiData.map((card, index) => {
                        if (!card.backdrop_path) return null; // Skip if no image

                        // Determine media type: 
                        // 1. Check card.media_type (from multi-search)
                        // 2. Check URL param 'type' (tv -> tv, others -> movie)
                        // 3. Default to 'movie'
                        let mediaType = card.media_type;
                        if (!mediaType) {
                            mediaType = type === 'tv' ? 'tv' : 'movie';
                        }

                        return (
                            <Link to={`/player/${mediaType}/${card.id}`} className="grid-card" key={index}>
                                <img src={`https://image.tmdb.org/t/p/w500` + card.backdrop_path} alt="" />
                                <p>{card.original_title || card.name}</p>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Search
