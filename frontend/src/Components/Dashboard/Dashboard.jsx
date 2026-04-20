import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

import { API_PROPERTY } from '../../utils/api';

const API = API_PROPERTY;

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('listings');
    const [listings, setListings] = useState([]);
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('access');

    useEffect(() => {
        if (!token) { navigate('/login'); return; }
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'listings') {
                const res = await axios.get(`${API}/my-listings/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setListings(res.data);
            } else {
                const res = await axios.get(`${API}/favourites/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFavourites(res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this listing?')) return;
        try {
            await axios.delete(`${API}/my-listings/${id}/delete/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setListings(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            alert('Could not delete: ' + (err.response?.data?.detail || err.message));
        }
    };

    const handleRemoveFavourite = async (propertyId) => {
        try {
            await axios.post(`${API}/favourites/${propertyId}/toggle/`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFavourites(prev => prev.filter(f => f.property !== propertyId));
        } catch (err) {
            console.error(err);
        }
    };

    const statusColor = { Active: '#00C49A', Sold: '#e74c3c', 'Under Review': '#f39c12' };

    return (
        <div className="DashboardPage">
            <header className="DashboardHeader">
                <Link to="/" className="DashLogo">Banke Bihari Group</Link>
                <nav>
                    <Link to="/buy">Browse</Link>
                    <Link to="/sell">+ Post Property</Link>
                </nav>
            </header>

            <div className="DashboardContainer">
                <div className="DashboardSidebar">
                    <div className="DashAvatar">
                        {(localStorage.getItem('user_email') || 'U')[0].toUpperCase()}
                    </div>
                    <p className="DashEmail">{localStorage.getItem('user_email') || 'My Account'}</p>
                    <div className="DashMenu">
                        <button
                            className={activeTab === 'listings' ? 'active' : ''}
                            onClick={() => setActiveTab('listings')}
                        >
                            🏠 My Listings
                        </button>
                        <button
                            className={activeTab === 'favourites' ? 'active' : ''}
                            onClick={() => setActiveTab('favourites')}
                        >
                            ❤ Saved Properties
                        </button>
                    </div>
                </div>

                <div className="DashboardMain">
                    <div className="DashMainHeader">
                        <h2>{activeTab === 'listings' ? 'My Listings' : 'Saved Properties'}</h2>
                        {activeTab === 'listings' && (
                            <Link to="/sell" className="DashPostBtn">+ Post New Property</Link>
                        )}
                    </div>

                    {loading ? (
                        <div className="DashLoading">Loading...</div>
                    ) : activeTab === 'listings' ? (
                        listings.length === 0 ? (
                            <div className="DashEmpty">
                                <p>You haven't posted any properties yet.</p>
                                <Link to="/sell" className="DashPostBtn">Post Your First Property</Link>
                            </div>
                        ) : (
                            <div className="DashListings">
                                {listings.map(p => (
                                    <div key={p.id} className="DashCard">
                                        {p.images && (
                                            <img
                                                src={p.images.startsWith('http') ? p.images : `http://localhost:8000/${p.images}`}
                                                alt={p.title}
                                            />
                                        )}
                                        <div className="DashCardInfo">
                                            <div className="DashCardTop">
                                                <h3>{p.title}</h3>
                                                <span className="DashStatusBadge" style={{ background: statusColor[p.status] || '#00C49A' }}>
                                                    {p.status}
                                                </span>
                                            </div>
                                            <p className="DashLocation">📍 {p.city}, {p.locality}</p>
                                            <p className="DashPrice">₹{p.price}</p>
                                            <p className="DashMeta">{p.property_type} · {p.size_sqft} sqft · {p.bedrooms || 0} BHK</p>
                                            <div className="DashCardActions">
                                                <Link to={`/property/${p.id}`} className="DashViewBtn">View</Link>
                                                <button className="DashDeleteBtn" onClick={() => handleDelete(p.id)}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        favourites.length === 0 ? (
                            <div className="DashEmpty">
                                <p>No saved properties yet. Browse and click ♡ to save.</p>
                                <Link to="/buy" className="DashPostBtn">Browse Properties</Link>
                            </div>
                        ) : (
                            <div className="DashListings">
                                {favourites.map(fav => {
                                    const p = fav.property_detail;
                                    if (!p) return null;
                                    return (
                                        <div key={fav.id} className="DashCard">
                                            {p.images && (
                                                <img
                                                    src={p.images.startsWith('http') ? p.images : `http://localhost:8000/${p.images}`}
                                                    alt={p.title}
                                                />
                                            )}
                                            <div className="DashCardInfo">
                                                <h3>{p.title}</h3>
                                                <p className="DashLocation">📍 {p.city}, {p.locality}</p>
                                                <p className="DashPrice">₹{p.price}</p>
                                                <p className="DashMeta">{p.property_type} · {p.size_sqft} sqft</p>
                                                <div className="DashCardActions">
                                                    <Link to={`/property/${p.id}`} className="DashViewBtn">View</Link>
                                                    <button className="DashDeleteBtn" onClick={() => handleRemoveFavourite(p.id)}>Remove</button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
