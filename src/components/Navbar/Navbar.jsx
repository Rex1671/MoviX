import React, { useRef, useState } from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'
import search_icon from '../../assets/search_icon.svg'
import bell_icon from '../../assets/bell_icon.svg'
import profile_img from '../../assets/profile_img.png'
import caret_icon from '../../assets/caret_icon.svg'
import { logout } from '../../firebase'
import { Link, useNavigate } from 'react-router-dom'


const Navbar = () => {

  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSearch = (e) => {
    if (e.key === 'Enter' && inputValue) {
      navigate(`/search?q=${inputValue}`);
    }
  }

  return (
    <div className='navbar'>
      <div className='navbar-left'>
        <h1 className="logo" onClick={() => navigate('/')}>MoviX</h1>
        <ul>
          <li onClick={() => navigate('/')}>Home</li>
          <li onClick={() => navigate('/browse/tv')}>TV Shows</li>
          <li onClick={() => navigate('/browse/movie')}>Movies</li>
          <li onClick={() => navigate('/browse/upcoming')}>New & Popular</li>
          <li onClick={() => navigate('/mylist')}>My List</li>
        </ul>
      </div>
      <div className='navbar-right'>
        {showSearch ? (
          <input
            type="text"
            placeholder="Search..."
            className='search-input'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleSearch}
            onBlur={() => { if (!inputValue) setShowSearch(false) }}
            autoFocus
          />
        ) : (
          <img src={search_icon} alt="" className='icons' onClick={() => setShowSearch(true)} />
        )}
        <div className="navbar-profile">
          <img src={profile_img} alt="" className='profile' />
          <img src={caret_icon} alt="" />
          <div className="dropdown">
            <p onClick={() => { logout() }}>Sign Out</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Navbar
