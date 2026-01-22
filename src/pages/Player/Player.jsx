import React, { useEffect, useState } from 'react';
import './Player.css';
import back_arrow_icon from '../../assets/back_arrow_icon.png';
import netflix_spinner from '../../assets/netflix_spinner.gif';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';

const Player = () => {

  const { type, id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const [apiData, setApiData] = useState({
    name: "",
    key: "",
    published_at: "",
    type: "",
    poster_path: "",
    backdrop_path: "",
    overview: "",
    vote_average: 0,
    runtime: 0,
    tagline: "",
    genres: [],
    budget: 0,
    revenue: 0,
    original_language: "",
    cast: [],
    director: "",
    similar: [],
    status: "",
    spoken_languages: [],
    production_companies: [],
    homepage: "",
    imdb_id: ""
  });

  // ... (useEffect for auth remains changed/unchanged, we target lines below)

  const handleSave = () => {
    const storedList = JSON.parse(localStorage.getItem('watchlist')) || [];

    if (isSaved) {
      // Remove
      const newList = storedList.filter(movie => movie.id !== id);
      localStorage.setItem('watchlist', JSON.stringify(newList));
      setIsSaved(false);
      console.log("Movie Removed from My List:", id);
      toast.info("Removed from My List");
    } else {
      // Add
      const movieData = {
        id: id,
        title: apiData.name,
        poster_path: apiData.poster_path,
        addedAt: new Date().toISOString()
      };
      storedList.push(movieData);
      localStorage.setItem('watchlist', JSON.stringify(storedList));
      setIsSaved(true);
      console.log("Movie Added to My List:", movieData);
      toast.success("Added to My List");
    }
  }

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`
    }
  };

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.themoviedb.org/3/${type}/${id}?append_to_response=videos,credits,similar,external_ids&language=en-US`, options)
      .then(res => res.json())
      .then(data => {
        const trailer = data.videos.results.find(vid => vid.type === "Trailer" || vid.type === "Teaser") || data.videos.results[0];
        const director = data.credits.crew.find(person => person.job === "Director");

        setApiData({
          name: data.original_title || data.original_name || data.name,
          key: trailer ? trailer.key : "",
          published_at: data.release_date || data.first_air_date,
          type: trailer ? trailer.type : "Video",
          poster_path: data.poster_path,
          backdrop_path: data.backdrop_path,
          overview: data.overview,
          vote_average: data.vote_average,
          runtime: data.runtime || data.episode_run_time?.[0] || 0,
          tagline: data.tagline,
          genres: data.genres,
          budget: data.budget || 0,
          revenue: data.revenue || 0,
          original_language: data.original_language,
          cast: data.credits.cast.slice(0, 14),
          director: director ? director.name : "Unknown",
          similar: data.similar ? data.similar.results : [],
          status: data.status,
          spoken_languages: data.spoken_languages,
          production_companies: data.production_companies,
          homepage: data.homepage,
          imdb_id: data.external_ids ? data.external_ids.imdb_id : ""
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const formatCurrency = (num) => {
    return num ? "$" + num.toLocaleString() : "N/A";
  }

  if (loading) {
    return <div className="login-spinner"><img src={netflix_spinner} alt="" /></div>
  }

  return (
    <div className="player">
      <img src={back_arrow_icon} alt="Back" onClick={() => { navigate(-1) }} className='back-btn' />

      <iframe
        width="90%"
        height="90%"
        src={`https://www.youtube.com/embed/${apiData.key}`}
        title="trailer"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

      <div className="player-info">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p>{apiData.published_at}</p>
            <h2>{apiData.name}</h2>
          </div>
          <button className='btn' onClick={handleSave} style={{ marginLeft: '20px', padding: '10px 20px', background: isSaved ? '#333' : '#e50914', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {isSaved ? "✓ Saved" : "+ My List"}
          </button>
        </div>
        <p className="tagline">{apiData.tagline}</p>

        <div className="player-stats">
          <p>Rating: {apiData.vote_average ? apiData.vote_average.toFixed(1) : "N/A"}/10</p>
          <p>Runtime: {apiData.runtime ? `${Math.floor(apiData.runtime / 60)}h ${apiData.runtime % 60}m` : "N/A"}</p>
          <p>Status: {apiData.status}</p>
          <p>Director: {apiData.director}</p>
        </div>

        <div className="player-stats">
          <p>Budget: {formatCurrency(apiData.budget)}</p>
          <p>Revenue: {formatCurrency(apiData.revenue)}</p>
          <p>Genres: {apiData.genres ? apiData.genres.map(g => g.name).join(', ') : ""}</p>
        </div>

        <div className="player-stats">
          <p>Languages: {apiData.spoken_languages ? apiData.spoken_languages.map(l => l.english_name).join(', ') : ""}</p>
        </div>

        <div className="player-links" style={{ margin: '20px 0', display: 'flex', gap: '15px' }}>
          {apiData.homepage && <a href={apiData.homepage} target="_blank" rel="noreferrer" style={{ padding: '10px 20px', background: '#333', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Official Website</a>}
          {apiData.imdb_id && <a href={`https://www.imdb.com/title/${apiData.imdb_id}`} target="_blank" rel="noreferrer" style={{ padding: '10px 20px', background: '#f5c518', color: 'black', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>IMDb</a>}
        </div>

        <p className='player-desc'>{apiData.overview}</p>

        {apiData.production_companies && apiData.production_companies.length > 0 && <div className="production-companies" style={{ margin: '20px 0' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#a3a3a3' }}>Production</h3>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center', background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '8px' }}>
            {apiData.production_companies.map((comp, idx) => {
              if (!comp.logo_path) return <span key={idx} style={{ color: '#ccc', marginRight: '10px' }}>{comp.name}</span>
              return <img key={idx} src={`https://image.tmdb.org/t/p/w200${comp.logo_path}`} alt={comp.name} style={{ height: '30px', filter: 'brightness(0) invert(1)' }} />
            })}
          </div>
        </div>}

        {apiData.cast.length > 0 && <div className="cast-section">
          <h3>Top Cast</h3>
          <div className="cast-list">
            {apiData.cast.map((actor, idx) => (
              <div key={idx} className="cast-card">
                <img src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : "https://via.placeholder.com/100?text=No+Img"} alt={actor.name} />
                <p>{actor.name}</p>
                <span>as {actor.character}</span>
              </div>
            ))}
          </div>
        </div>}

        {apiData.similar && apiData.similar.length > 0 && <div className="cast-section">
          <h3>More Like This</h3>
          <div className="cast-list">
            {apiData.similar.map((item, idx) => (
              <div key={idx} className="cast-card" onClick={() => { navigate(`/player/${type}/${item.id}`); window.scrollTo(0, 0) }} style={{ cursor: 'pointer' }}>
                <img src={item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : "https://via.placeholder.com/150x225?text=No+Img"} alt={item.title || item.name} style={{ borderRadius: '4px', height: '180px' }} />
                <p>{item.title || item.name}</p>
              </div>
            ))}
          </div>
        </div>}
      </div>
    </div>
  );
};

export default Player;
