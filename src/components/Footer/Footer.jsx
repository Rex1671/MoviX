import React from 'react'
import './Footer.css'
import youtube_icon from '../../assets/youtube_icon.png'
import twitter_icon from '../../assets/twitter_icon.png'
import instagram_icon from '../../assets/instagram_icon.png'
import facebook_icon from '../../assets/facebook_icon.png'








const Footer = () => {
  return (
    <div className='footer'>
      <div className="footer-icons">
        <a href="https://facebook.com" target="_blank" rel="noreferrer"><img src={facebook_icon} alt="Facebook" /></a>
        <a href="https://youtube.com" target="_blank" rel="noreferrer"><img src={youtube_icon} alt="YouTube" /></a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer"><img src={twitter_icon} alt="Twitter" /></a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer"><img src={instagram_icon} alt="Instagram" /></a>
      </div>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/mylist">My List</a></li>
        <li><a href="mailto:support@streamvibe.com">Contact Us</a></li>
        <li><a href="#">Terms of Use</a></li>
        <li><a href="#">Privacy Policy</a></li>
        <li><a href="#">Help Center</a></li>
      </ul>
      <p className='copyright-text'>© 1997-2025 MoviX, Inc.</p>
    </div>
  )
}

export default Footer
