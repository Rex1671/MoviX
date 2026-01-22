import React, { useEffect, useState } from 'react';
import './MyList.css';
import Navbar from '../../components/Navbar/Navbar';
import { Link } from 'react-router-dom';

const MyList = () => {
    const [savedMovies, setSavedMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedList = JSON.parse(localStorage.getItem('watchlist')) || [];
        setSavedMovies(storedList);
        setLoading(false);
    }, []);

    return (
        <div className='mylist-page'>
            <Navbar />
            <div className="mylist-container">
                <h2>My List</h2>
                {loading ? <p>Loading...</p> : (
                    <div className="mylist-grid">
                        {savedMovies.length > 0 ? savedMovies.map((card, index) => (
                            <Link to={`/player/${card.type || 'movie'}/${card.id}`} className="grid-card" key={index}>
                                <img src={card.poster_path ? `https://image.tmdb.org/t/p/w500${card.poster_path}` : "https://via.placeholder.com/200x300"} alt="" />
                                <p>{card.title}</p>
                            </Link>
                        )) : <p className="empty-msg">You haven't added anything to your list yet.</p>}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyList
