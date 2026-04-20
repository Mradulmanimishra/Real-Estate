import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BackgroundVideo from '../../assets/BackgroundVideo.webm';
import './Home.css';
import Project from './Project';
import AboutGroup from './AboutGroup';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user_email');
        navigate('/login');
    };
    
    const textslide = [
        {
            subtitle: 'Leading Real Estate Company',
            title: 'IN THE NATION',
        },
        {
            subtitle: 'Banke Bihari Group',
            title: 'NOW #1 IN THE VRINDAVAN',
        },
        {
            subtitle: '#1 Large Team * in',
            title: 'INDIA',
        },
        {
            subtitle: '#1 Large Team * in',
            title: 'MATHURA,UTTAR PRADESH',
        },
    ];
     const handleSellClick = () => {
        const token = localStorage.getItem('access');

        if (!token) {
            alert('Please login first to post your property.');
            navigate('/login');
        } else {
            navigate('/sell');
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % textslide.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [textslide.length]);

    return (
        <div className='MainHome'>
            {/* Hero Section with Video Background */}
            <div className="hero-section">
                <div className="background">
                    <video
                        src={BackgroundVideo}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="background-video"
                    />
                </div>
                <div className="contentdiv">
                    <div className="navbar">
                        <div className="left-part">
                            <div className='logo'>
                                <Link to="/">Banke Bihari Group</Link>
                            </div>
                        </div>
                        <div className="right-part-desktop">
                            <ul>
                                <li className="li-1">
                                    <Link to="/buy">Buy</Link>
                                </li>
                                <li className="li-2">
                                     <div onClick={handleSellClick} className='Sellbtn'>Sell</div>
                                </li>
                                <li className="li-3">
                                    <Link to="/dashboard">Dashboard</Link>
                                </li>
                                <li className="li-4">
                                    <div onClick={handleLogout} style={{cursor:'pointer'}}>Logout</div>
                                </li>
                                
                            </ul>
                        </div>
                        {/* --------Mobile View-------- */}
                        <div className="right-part-mobile">
                            <i className="ri-menu-line" onClick={()=>setShow(!show)}></i>
                        </div>
                    </div>
                    {show && <div className="mobile-menu">
                        <ul>
                            <li className="li-1" onClick={()=>setShow(false)}>
                                <Link to="/buy">Buy</Link>
                            </li>
                            <li className="li-2" onClick={()=>setShow(false)}>
                                 <button onClick={handleSellClick}>Sell</button>
                            </li>
                            <li className="li-3" onClick={()=>setShow(false)}>
                                <Link to="/dashboard">Dashboard</Link>
                            </li>
                            <li className="li-4" onClick={()=>{ setShow(false); handleLogout(); }}>
                                <div style={{cursor:'pointer'}}>Logout</div>
                            </li>
                            <li className="li-5" onClick={()=>setShow(false)}>
                                <Link to="/contact">Contact Us</Link>
                            </li>
                        </ul>
                    </div>}
                    <div className="text-slide">
                         <div className="text-slide-content">
                            <div className="subtitle">{textslide[currentSlide].subtitle}</div>
                            <div className="title">{textslide[currentSlide].title}</div>
                        </div>
                        <div className="slogan-1">
                        Our Client Satisfaction is Our Priority 
                    </div>
                    </div>
                    <div className='slogan-2'>
                        Find Your Dream Home By Clicking Below
                        <div className="buttons">
                            <Link to="/buy">
                                <button className='button-1'>Buy</button>
                            </Link>  
                                <button className='button-2' onClick={handleSellClick}>Sell</button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Project Section - Scrollable Content Below */}
            <div className="Project">
                <Project />
            </div>
            <div className="AboutGroup">
                <AboutGroup />
            </div>
        </div>
    );
};

export default Home;