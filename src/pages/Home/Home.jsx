import React, { useEffect, useState } from 'react'
import './Home.css'
import Navbar from '../../components/Navbar/Navbar'
import hero_banner from '../../assets/hero_banner.jpg';
import hero_title from '../../assets/hero_title.png';
import play_icon from '../../assets/Play_icon.png';
import info_icon from '../../assets/info_icon.png';
import TitleCards from '../../components/TitleCards/TitleCards';
import Footer from '../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import netflix_spinner from '../../assets/netflix_spinner.gif';

const Home = () => {

  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`
    }
  };

  useEffect(() => {
    setLoading(true);
    fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
      .then(response => response.json())
      .then(response => {
        const movies = response.results;
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        setApiData(randomMovie);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [])

  if (loading) {
    return <div className="login-spinner"><img src={netflix_spinner} alt="" /></div>
  }

  return (
    <div className='home'>
      <Navbar />
      <div className="hero">
        <img src={apiData ? `https://image.tmdb.org/t/p/original${apiData.backdrop_path}` : hero_banner} alt="" className='banner-img' />
        <div className="hero-caption">
          <h1 className='caption-title'>{apiData ? apiData.original_title : "MoviX"}</h1>
          <p>{apiData ? apiData.overview : "Discovering the best movies and TV shows."}</p>
          <div className="hero-btns">
            <button className='btn' onClick={() => { if (apiData.id) navigate(`/player/movie/${apiData.id}`) }}><img src={play_icon} alt="" />Play </button>
            <button className='btn dark-btn' onClick={() => { if (apiData.id) navigate(`/player/movie/${apiData.id}`) }}><img src={info_icon} alt="" />More Info </button>
          </div>
          <TitleCards />
        </div>
      </div>
      <div className="more-cards">
        <TitleCards title={"Blockbuster Movies"} category={"top_rated"} />
        <TitleCards title={"Only on MoviX"} category={"popular"} />
        <TitleCards title={"Upcoming"} category={"upcoming"} />
        <TitleCards title={"Top Picks for You"} category={"now_playing"} />
      </div>
      <Footer />
    </div>
  )
}

export default Home
