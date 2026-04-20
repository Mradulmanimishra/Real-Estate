import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import AIChatWidget from '../Chat/AIChatWidget';
import './BuyPage.css';

import { API_PROPERTY } from '../../utils/api';

const API = API_PROPERTY;

const BuyPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favourites, setFavourites] = useState(new Set());
    const [compareList, setCompareList] = useState([]);
    const [showCompare, setShowCompare] = useState(false);
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [priceTrend, setPriceTrend] = useState([]);
    const [showTrend, setShowTrend] = useState(false);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const PAGE_SIZE = 12;

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        city: searchParams.get('city') || '',
        property_type: searchParams.get('property_type') || '',
        bedrooms: searchParams.get('bedrooms') || '',
        min_price: searchParams.get('min_price') || '',
        max_price: searchParams.get('max_price') || '',
        verified: searchParams.get('verified') || '',
    });

    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user_email');
        navigate('/login');
    };

    const token = localStorage.getItem('access');

    const fetchProperties = useCallback(() => {
        setLoading(true);
        const params = Object.fromEntries(
            Object.entries(filters).filter(([, v]) => v !== '')
        );
        params.page = page;
        params.page_size = PAGE_SIZE;
        axios.get(`${API}/buy/`, {
            params,
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
            .then(res => {
                // Handle paginated response
                if (res.data.results) {
                    setProperties(res.data.results);
                    setTotalCount(res.data.count);
                } else {
                    setProperties(res.data);
                    setTotalCount(res.data.length);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [filters, token, page]);

    useEffect(() => { fetchProperties(); }, [fetchProperties]);

    // Load saved favourites from localStorage for non-logged-in users
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('favourites') || '[]');
        setFavourites(new Set(saved));
        // Load recently viewed
        const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        setRecentlyViewed(viewed);
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
        setSearchParams(params);
        fetchProperties();
    };

    const handleReset = () => {
        setFilters({ search: '', city: '', property_type: '', bedrooms: '', min_price: '', max_price: '', verified: '' });
        setSearchParams({});
        setPage(1);
    };

    const fetchPriceTrend = async () => {
        try {
            const res = await axios.get(`${API}/price-trend/`, {
                params: filters.city ? { city: filters.city } : {},
            });
            setPriceTrend(res.data);
            setShowTrend(true);
        } catch (err) { console.error(err); }
    };

    const toggleFavourite = async (e, propertyId) => {
        e.preventDefault();
        e.stopPropagation();
        if (!token) {
            // Guest: store in localStorage
            const newFavs = new Set(favourites);
            if (newFavs.has(propertyId)) newFavs.delete(propertyId);
            else newFavs.add(propertyId);
            setFavourites(newFavs);
            localStorage.setItem('favourites', JSON.stringify([...newFavs]));
            return;
        }
        try {
            await axios.post(`${API}/favourites/${propertyId}/toggle/`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const newFavs = new Set(favourites);
            if (newFavs.has(propertyId)) newFavs.delete(propertyId);
            else newFavs.add(propertyId);
            setFavourites(newFavs);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleCompare = (e, property) => {
        e.preventDefault();
        e.stopPropagation();
        setCompareList(prev => {
            const exists = prev.find(p => p.id === property.id);
            if (exists) return prev.filter(p => p.id !== property.id);
            if (prev.length >= 3) return prev; // max 3
            return [...prev, property];
        });
    };

    const handleSellClick = () => {
        if (!token) { alert('Please login first to post your property.'); navigate('/login'); }
        else navigate('/sell');
    };

    const statusColor = { Active: '#00C49A', Sold: '#e74c3c', 'Under Review': '#f39c12' };

    return (
        <div className="BuyPageContainer">
            <header className="BuyHeader">
                <Link to="/" className="BuyLogo">Banke Bihari Group</Link>
                <div className="BuyHeaderNav">
                    <Link to="/">Home</Link>
                    <div onClick={handleSellClick} className="Sellbtn">Sell</div>
                    {token && <Link to="/dashboard">Dashboard</Link>}
                    {token && <Link to="/favourites">❤ Saved</Link>}
                    <div onClick={handleLogout} style={{cursor:'pointer', color:'#ccc'}}>Logout</div>
                </div>
            </header>

            <section className="BuyIntro">
                <h1>Find Your Dream Property</h1>
                <p>Explore handpicked properties across Vrindavan & Mathura</p>
            </section>

            {/* Search & Filter Bar */}
            <form className="FilterBar" onSubmit={handleSearch}>
                <input
                    className="FilterInput FilterSearch"
                    type="text"
                    name="search"
                    placeholder="Search by title, city, locality..."
                    value={filters.search}
                    onChange={handleFilterChange}
                />
                <input
                    className="FilterInput"
                    type="text"
                    name="city"
                    placeholder="City"
                    value={filters.city}
                    onChange={handleFilterChange}
                />
                <select className="FilterSelect" name="property_type" value={filters.property_type} onChange={handleFilterChange}>
                    <option value="">All Types</option>
                    <option>House</option>
                    <option>Apartment</option>
                    <option>Plot</option>
                    <option>Commercial</option>
                </select>
                <select className="FilterSelect" name="bedrooms" value={filters.bedrooms} onChange={handleFilterChange}>
                    <option value="">Bedrooms</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4+ BHK</option>
                </select>
                <input
                    className="FilterInput FilterPrice"
                    type="number"
                    name="min_price"
                    placeholder="Min Price (₹)"
                    value={filters.min_price}
                    onChange={handleFilterChange}
                />
                <input
                    className="FilterInput FilterPrice"
                    type="number"
                    name="max_price"
                    placeholder="Max Price (₹)"
                    value={filters.max_price}
                    onChange={handleFilterChange}
                />
                <button type="submit" className="FilterBtn">Search</button>
                <button type="button" className="FilterResetBtn" onClick={handleReset}>Reset</button>
                <label className="VerifiedFilter">
                    <input type="checkbox" checked={filters.verified === 'true'}
                        onChange={e => setFilters(p => ({ ...p, verified: e.target.checked ? 'true' : '' }))} />
                    ✓ Verified only
                </label>
                <button type="button" className="TrendBtn" onClick={fetchPriceTrend}>📈 Price Trend</button>
            </form>

            {/* Price Trend Chart */}
            {showTrend && priceTrend.length > 0 && (
                <div className="TrendChart">
                    <div className="TrendChartHeader">
                        <h3>Average Price Trend {filters.city ? `— ${filters.city}` : '(All Cities)'}</h3>
                        <button onClick={() => setShowTrend(false)}>✕</button>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={priceTrend} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
                            <Tooltip formatter={v => [`₹${parseInt(v).toLocaleString('en-IN')}`, 'Avg Price']} />
                            <Line type="monotone" dataKey="avg_price" stroke="#6C63FF" strokeWidth={2.5} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Compare bar */}
            {compareList.length > 0 && (
                <div className="CompareBar">
                    <span>{compareList.length} selected for comparison</span>
                    <button onClick={() => setShowCompare(true)} className="CompareBtn">Compare Now</button>
                    <button onClick={() => setCompareList([])} className="CompareClearBtn">Clear</button>
                </div>
            )}

            {/* Results count */}
            <div className="ResultsCount">
                {loading ? 'Loading...' : `${totalCount} properties found`}
            </div>

            <section className="BuyListings">
                {!loading && properties.length === 0 && (
                    <div className="NoResults">
                        <p>No properties found. Try adjusting your filters.</p>
                        <button onClick={handleReset} className="FilterResetBtn">Clear Filters</button>
                    </div>
                )}
                {properties.map(property => (
                    <Link key={property.id} to={`/property/${property.id}`} className="BuyCardLink">
                        <div className="BuyCard">
                            {/* Status Badge */}
                            <div className="StatusBadge" style={{ backgroundColor: statusColor[property.status] || '#00C49A' }}>
                                {property.status || 'Active'}
                            </div>

                            {/* Heart Button */}
                            <button
                                className={`HeartBtn ${favourites.has(property.id) ? 'hearted' : ''}`}
                                onClick={(e) => toggleFavourite(e, property.id)}
                                title="Save to favourites"
                            >
                                {favourites.has(property.id) ? '❤' : '♡'}
                            </button>

                            {property.images ? (
                                <img
                                    src={property.images.startsWith('http') ? property.images : `http://localhost:8000${property.images.startsWith('/') ? '' : '/'}${property.images}`}
                                    alt={property.title}
                                />
                            ) : (
                                <div className="no-image">No Image</div>
                            )}
                            <div className="BuyCardInfo">
                                <h2>{property.title}</h2>
                                <p className="BuyLocation">📍 {property.city}, {property.locality}</p>
                                <div className="BuyCardMeta">
                                    <span className="BuyType">{property.property_type}</span>
                                    {property.bedrooms && <span className="BuyBed">🛏 {property.bedrooms} BHK</span>}
                                    {property.size_sqft && <span className="BuySize">📐 {property.size_sqft} sqft</span>}
                                </div>
                                <p className="BuyPrice">₹{property.price}</p>
                                <div className="BuyCardActions">
                                    <button className="BuyBtn">View Details</button>
                                    <button
                                        className={`CompareCardBtn ${compareList.find(p => p.id === property.id) ? 'selected' : ''}`}
                                        onClick={(e) => toggleCompare(e, property)}
                                    >
                                        {compareList.find(p => p.id === property.id) ? '✓ Added' : '⇄ Compare'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </section>

            {/* Pagination */}
            {totalCount > PAGE_SIZE && (
                <div className="Pagination">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                    <span>Page {page} of {Math.ceil(totalCount / PAGE_SIZE)}</span>
                    <button disabled={page >= Math.ceil(totalCount / PAGE_SIZE)} onClick={() => setPage(p => p + 1)}>Next →</button>
                </div>
            )}

            {/* Recently Viewed */}
            {recentlyViewed.length > 0 && (
                <div className="RecentlyViewed">
                    <h3>Recently Viewed</h3>
                    <div className="RecentGrid">
                        {recentlyViewed.map(p => (
                            <Link key={p.id} to={`/property/${p.id}`} className="RecentCard">
                                {p.images && (
                                    <img src={p.images.startsWith('http') ? p.images : `http://localhost:8000/${p.images}`} alt={p.title} />
                                )}
                                <div className="RecentInfo">
                                    <p className="RecentTitle">{p.title}</p>
                                    <p className="RecentPrice">₹{p.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Compare Modal */}
            {showCompare && (
                <div className="CompareOverlay" onClick={() => setShowCompare(false)}>
                    <div className="CompareModal" onClick={e => e.stopPropagation()}>
                        <div className="CompareModalHeader">
                            <h2>Property Comparison</h2>
                            <button onClick={() => setShowCompare(false)}>✕</button>
                        </div>
                        <div className="CompareGrid">
                            {compareList.map(p => (
                                <div key={p.id} className="CompareCard">
                                    {p.images && (
                                        <img src={p.images.startsWith('http') ? p.images : `http://localhost:8000/${p.images}`} alt={p.title} />
                                    )}
                                    <table className="CompareTable">
                                        <tbody>
                                            <tr><td>Title</td><td><strong>{p.title}</strong></td></tr>
                                            <tr><td>Price</td><td>₹{p.price}</td></tr>
                                            <tr><td>Type</td><td>{p.property_type}</td></tr>
                                            <tr><td>City</td><td>{p.city}</td></tr>
                                            <tr><td>Size</td><td>{p.size_sqft} sqft</td></tr>
                                            <tr><td>Bedrooms</td><td>{p.bedrooms || 'N/A'}</td></tr>
                                            <tr><td>Bathrooms</td><td>{p.bathrooms || 'N/A'}</td></tr>
                                            <tr><td>Age</td><td>{p.age_of_property}</td></tr>
                                            <tr><td>Parking</td><td>{p.parking ? 'Yes' : 'No'}</td></tr>
                                            <tr><td>Status</td><td>{p.status}</td></tr>
                                        </tbody>
                                    </table>
                                    <Link to={`/property/${p.id}`} className="CompareViewBtn">View Details</Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <AIChatWidget />
        </div>
    );
};

export default BuyPage;
