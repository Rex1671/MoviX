import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './TitleCards.css';
import cards_data from '../../assets/cards/Cards_data';

const TitleCards = ({ title = "Popular on MoviX", category, contentType = "movie" }) => {

  const [apiData, setApiData] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const timerRef = useRef(null);

  const cardsRef = useRef(null);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`
    }
  };

  const handleMouseEnter = (id) => {
    timerRef.current = setTimeout(() => {
      setHoveredId(id);
      fetch(`https://api.themoviedb.org/3/${contentType}/${id}/videos?language=en-US`, options)
        .then(res => res.json())
        .then(res => {
          const trailer = res.results.find(vid => vid.type === "Trailer" || vid.type === "Teaser");
          if (trailer) setTrailerKey(trailer.key);
        })
        .catch(err => console.error(err));
    }, 800);
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setHoveredId(null);
    setTrailerKey(null);
  };

  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/${contentType}/${category ?
      category : "now_playing"}?language=en-US&page=1`, options)
      .then(res => res.json())
      .then(res => setApiData(res.results))
      .catch(err => console.error(err));

    const el = cardsRef.current;
    el.addEventListener('wheel', handleWheel);

    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, [category, contentType]);

  return (
    <div className="title-cards">
      <h2>{title}</h2>

      <div className="card-list" ref={cardsRef}>
        {apiData.map((card, index) => (
          <Link to={`/player/${contentType}/${card.id}`} className="card" key={index}
            onMouseEnter={() => handleMouseEnter(card.id)}
            onMouseLeave={handleMouseLeave}
          >
            {hoveredId === card.id && trailerKey ? (
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1`}
                title={card.original_title || card.original_name}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                style={{ width: '240px', height: '135px', borderRadius: '4px', pointerEvents: 'none' }}
              ></iframe>
            ) : (
              <img src={`https://image.tmdb.org/t/p/w500` + card.backdrop_path} alt="" />
            )}
            <p>{card.original_title || card.original_name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TitleCards;
