import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import './PropertyDetail.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

import { API_PROPERTY } from '../../utils/api';

const API = API_PROPERTY;

const StarRating = ({ value, onChange, readonly = false }) => (
    <div className="StarRow">
        {[1, 2, 3, 4, 5].map(s => (
            <span
                key={s}
                className={`Star ${s <= value ? 'filled' : ''} ${readonly ? 'readonly' : ''}`}
                onClick={() => !readonly && onChange && onChange(s)}
            >★</span>
        ))}
    </div>
);

const PropertyDetail = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [similar, setSimilar] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [activeTab, setActiveTab] = useState('details');
    const [showPhone, setShowPhone] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    // EMI
    const [emi, setEmi] = useState({ price: '', down: '20', rate: '8.5', tenure: '20', result: null });

    // Inquiry
    const [inquiry, setInquiry] = useState({ name: '', phone: '', message: '' });
    const [inquiryStatus, setInquiryStatus] = useState('');

    // Review
    const [review, setReview] = useState({ rating: 0, comment: '' });
    const [reviewStatus, setReviewStatus] = useState('');

    const token = localStorage.getItem('access');

    useEffect(() => {
        axios.get(`${API}/property/${id}/`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
            .then(res => {
                setProperty(res.data);
                // Track recently viewed
                const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
                const updated = [res.data, ...viewed.filter(p => p.id !== res.data.id)].slice(0, 5);
                localStorage.setItem('recentlyViewed', JSON.stringify(updated));
            })
            .catch(err => console.error(err));

        axios.get(`${API}/property/${id}/similar/`)
            .then(res => setSimilar(res.data)).catch(() => {});

        axios.get(`${API}/property/${id}/reviews/`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
            .then(res => setReviews(res.data)).catch(() => {});
    }, [id]);

    const calculateEMI = () => {
        const principal = parseFloat(emi.price || property?.price?.replace(/,/g, '') || 0);
        const loanAmount = principal * (1 - parseFloat(emi.down) / 100);
        const r = parseFloat(emi.rate) / 100 / 12;
        const n = parseFloat(emi.tenure) * 12;
        const monthly = r === 0 ? loanAmount / n : (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        setEmi(prev => ({ ...prev, result: monthly.toFixed(0) }));
    };

    const handleInquirySubmit = async (e) => {
        e.preventDefault();
        if (!inquiry.name || !inquiry.phone || !inquiry.message) {
            setInquiryStatus('error:Please fill all fields.');
            return;
        }
        try {
            await axios.post(`${API}/property/${id}/inquiry/`, inquiry, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setInquiryStatus('success:Inquiry sent! The seller will contact you soon.');
            setInquiry({ name: '', phone: '', message: '' });
        } catch (err) {
            setInquiryStatus('error:' + (err.response?.data?.error || 'Failed to send inquiry.'));
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!review.rating) { setReviewStatus('error:Please select a rating.'); return; }
        try {
            const res = await axios.post(`${API}/property/${id}/reviews/`, review, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReviews(prev => [res.data, ...prev]);
            setReviewStatus('success:Review submitted!');
            setReview({ rating: 0, comment: '' });
        } catch (err) {
            setReviewStatus('error:' + (err.response?.data?.error || 'Failed to submit review.'));
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!property) return (
        <div className="LoadingScreen">
            <div className="LoadingSpinner" />
            <p>Loading property...</p>
        </div>
    );

    const imageUrl = property.images?.startsWith('http')
        ? property.images
        : `http://localhost:8000${property.images?.startsWith('/') ? '' : '/'}${property.images}`;

    const whatsappMsg = encodeURIComponent(
        `Hi, I'm interested in: ${property.title}, ${property.city}. Price: ₹${property.price}. Please share details.`
    );
    const mapCenter = property.latitude && property.longitude
        ? [parseFloat(property.latitude), parseFloat(property.longitude)]
        : [27.5794, 77.6964];

    const statusColor = { Active: '#00C49A', Sold: '#e74c3c', 'Under Review': '#f39c12' };

    return (
        <div className="PropertyDetail">
            <header className="DetailHeader">
                <Link to="/" className="DetailLogo">Banke Bihari Group</Link>
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/buy">← Listings</Link>
                </nav>
            </header>

            <div className="DetailWrapper">
                <div className="DetailLeft">
                    {/* Image with lightbox */}
                    <div className="DetailImageWrap" onClick={() => property.images && setLightboxOpen(true)}>
                        {property.images
                            ? <img src={imageUrl} alt={property.title} className="DetailImage" />
                            : <div className="DetailNoImage">No Image Available</div>
                        }
                        {property.images && <div className="ImageOverlay">🔍 Click to enlarge</div>}
                    </div>

                    {property.images && (
                        <Lightbox
                            open={lightboxOpen}
                            close={() => setLightboxOpen(false)}
                            slides={[{ src: imageUrl }]}
                        />
                    )}

                    {/* Tabs */}
                    <div className="DetailTabs">
                        {['details', 'inquiry', 'reviews', 'emi', 'map'].map(tab => (
                            <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
                                {{ details: 'Details', inquiry: '📩 Inquiry', reviews: `⭐ Reviews (${reviews.length})`, emi: 'EMI', map: 'Map' }[tab]}
                            </button>
                        ))}
                    </div>

                    {/* ── DETAILS TAB ── */}
                    {activeTab === 'details' && (
                        <div className="DetailContent">
                            <div className="DetailTitleRow">
                                <div>
                                    <h1>{property.title}</h1>
                                    <div className="DetailBadges">
                                        <span className="DetailStatusBadge" style={{ background: statusColor[property.status] || '#00C49A' }}>
                                            {property.status || 'Active'}
                                        </span>
                                        {property.is_verified && (
                                            <span className="VerifiedBadge">✓ Verified</span>
                                        )}
                                    </div>
                                </div>
                                <button className="ShareBtn" onClick={handleShare} title="Copy link">
                                    {copied ? '✓ Copied!' : '🔗 Share'}
                                </button>
                            </div>

                            <p className="DetailLocation">📍 {property.city}, {property.locality}</p>
                            <p className="DetailPrice">₹{property.price}</p>

                            {/* Rating summary */}
                            {property.avg_rating && (
                                <div className="RatingSummary">
                                    <StarRating value={Math.round(property.avg_rating)} readonly />
                                    <span>{property.avg_rating}★ ({property.review_count} reviews)</span>
                                </div>
                            )}

                            <div className="DetailGrid">
                                {[
                                    ['Type', property.property_type],
                                    ['Size', `${property.size_sqft} sqft`],
                                    ['Bedrooms', property.bedrooms || 'N/A'],
                                    ['Bathrooms', property.bathrooms || 'N/A'],
                                    ['Furnishing', property.furnishing_status || 'N/A'],
                                    ['Construction', property.construction_status],
                                    ['Age', property.age_of_property],
                                    ['Floor', `${property.floor_number} / ${property.total_floors}`],
                                    ['Parking', property.parking ? '✓ Yes' : '✗ No'],
                                    ['Pincode', property.pincode],
                                ].map(([label, val]) => (
                                    <div key={label} className="DetailItem">
                                        <span>{label}</span><strong>{val}</strong>
                                    </div>
                                ))}
                            </div>

                            {property.description && (
                                <div className="DetailDescription">
                                    <h3>Description</h3>
                                    <p>{property.description}</p>
                                </div>
                            )}

                            <div className="SellerCard">
                                <div className="SellerInfo">
                                    <div className="SellerAvatar">{property.seller_name?.[0]?.toUpperCase()}</div>
                                    <div>
                                        <p className="SellerName">{property.seller_name}</p>
                                        <p className="SellerType">{property.seller_type}</p>
                                    </div>
                                </div>
                                <div className="ContactButtons">
                                    <button className="ContactBtn PhoneBtn" onClick={() => setShowPhone(!showPhone)}>
                                        📞 {showPhone ? property.seller_contact : 'Show Phone'}
                                    </button>
                                    <button className="ContactBtn EmailBtn" onClick={() => setShowEmail(!showEmail)}>
                                        ✉ {showEmail ? property.seller_email : 'Show Email'}
                                    </button>
                                    <a href={`https://wa.me/91${property.seller_contact}?text=${whatsappMsg}`}
                                        target="_blank" rel="noopener noreferrer" className="ContactBtn WhatsAppBtn">
                                        💬 WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── INQUIRY TAB ── */}
                    {activeTab === 'inquiry' && (
                        <div className="InquirySection">
                            <h2>Send Inquiry</h2>
                            <p className="InquirySubtitle">Interested in this property? Send a message to the seller.</p>
                            {inquiryStatus && (
                                <div className={`StatusMsg ${inquiryStatus.startsWith('success') ? 'success' : 'error'}`}>
                                    {inquiryStatus.split(':').slice(1).join(':')}
                                </div>
                            )}
                            <form className="InquiryForm" onSubmit={handleInquirySubmit}>
                                <div className="InquiryField">
                                    <label>Your Name</label>
                                    <input type="text" value={inquiry.name}
                                        onChange={e => setInquiry(p => ({ ...p, name: e.target.value }))}
                                        placeholder="Full name" />
                                </div>
                                <div className="InquiryField">
                                    <label>Phone Number</label>
                                    <input type="tel" value={inquiry.phone}
                                        onChange={e => setInquiry(p => ({ ...p, phone: e.target.value }))}
                                        placeholder="+91 XXXXX XXXXX" />
                                </div>
                                <div className="InquiryField InquiryFull">
                                    <label>Message</label>
                                    <textarea rows="4" value={inquiry.message}
                                        onChange={e => setInquiry(p => ({ ...p, message: e.target.value }))}
                                        placeholder={`Hi, I'm interested in ${property.title}. Please share more details.`} />
                                </div>
                                <button type="submit" className="InquiryBtn">Send Inquiry</button>
                            </form>
                        </div>
                    )}

                    {/* ── REVIEWS TAB ── */}
                    {activeTab === 'reviews' && (
                        <div className="ReviewsSection">
                            <h2>Reviews & Ratings</h2>

                            {/* Write review */}
                            <div className="WriteReview">
                                <h3>Write a Review</h3>
                                {reviewStatus && (
                                    <div className={`StatusMsg ${reviewStatus.startsWith('success') ? 'success' : 'error'}`}>
                                        {reviewStatus.split(':').slice(1).join(':')}
                                    </div>
                                )}
                                <form onSubmit={handleReviewSubmit}>
                                    <div className="ReviewRatingRow">
                                        <label>Your Rating</label>
                                        <StarRating value={review.rating} onChange={r => setReview(p => ({ ...p, rating: r }))} />
                                    </div>
                                    <textarea
                                        className="ReviewTextarea"
                                        rows="3"
                                        placeholder="Share your experience with this property..."
                                        value={review.comment}
                                        onChange={e => setReview(p => ({ ...p, comment: e.target.value }))}
                                    />
                                    <button type="submit" className="ReviewSubmitBtn">Submit Review</button>
                                </form>
                            </div>

                            {/* Reviews list */}
                            <div className="ReviewsList">
                                {reviews.length === 0 ? (
                                    <p className="NoReviews">No reviews yet. Be the first to review!</p>
                                ) : reviews.map(r => (
                                    <div key={r.id} className="ReviewCard">
                                        <div className="ReviewCardTop">
                                            <div className="ReviewAvatar">{r.user_email?.[0]?.toUpperCase()}</div>
                                            <div>
                                                <p className="ReviewEmail">{r.user_email}</p>
                                                <StarRating value={r.rating} readonly />
                                            </div>
                                            <span className="ReviewDate">
                                                {new Date(r.created_at).toLocaleDateString('en-IN')}
                                            </span>
                                        </div>
                                        {r.comment && <p className="ReviewComment">{r.comment}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── EMI TAB ── */}
                    {activeTab === 'emi' && (
                        <div className="EmiCalculator">
                            <h2>EMI Calculator</h2>
                            <p className="EmiSubtitle">Estimate your monthly home loan payment</p>
                            <div className="EmiForm">
                                {[
                                    ['Property Price (₹)', 'price', 'number', property.price?.replace(/,/g, '')],
                                    ['Down Payment (%)', 'down', 'number', null],
                                    ['Interest Rate (% p.a.)', 'rate', 'number', null],
                                    ['Loan Tenure (years)', 'tenure', 'number', null],
                                ].map(([label, key, type, placeholder]) => (
                                    <div key={key} className="EmiField">
                                        <label>{label}</label>
                                        <input type={type} value={emi[key]}
                                            placeholder={placeholder}
                                            onChange={e => setEmi(p => ({ ...p, [key]: e.target.value }))} />
                                    </div>
                                ))}
                                <button className="EmiCalcBtn" onClick={calculateEMI}>Calculate EMI</button>
                            </div>
                            {emi.result && (
                                <div className="EmiResult">
                                    <p>Estimated Monthly EMI</p>
                                    <h2>₹{parseInt(emi.result).toLocaleString('en-IN')}</h2>
                                    <p className="EmiNote">
                                        Loan: ₹{(parseFloat(emi.price || property.price?.replace(/,/g, '') || 0) * (1 - parseFloat(emi.down) / 100)).toLocaleString('en-IN')}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── MAP TAB ── */}
                    {activeTab === 'map' && (
                        <div className="MapContainer">
                            {!(property.latitude && property.longitude) && (
                                <div className="MapNote">📍 Showing approximate location for {property.city}.</div>
                            )}
                            <MapContainer center={mapCenter} zoom={14} style={{ height: '420px', width: '100%', borderRadius: '10px' }}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={mapCenter}>
                                    <Popup><strong>{property.title}</strong><br />{property.city}<br />₹{property.price}</Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    )}
                </div>
            </div>

            {/* Similar Properties */}
            {similar.length > 0 && (
                <div className="SimilarSection">
                    <h2>Similar Properties</h2>
                    <div className="SimilarGrid">
                        {similar.map(p => (
                            <Link key={p.id} to={`/property/${p.id}`} className="SimilarCard">
                                {p.images && <img src={p.images.startsWith('http') ? p.images : `http://localhost:8000/${p.images}`} alt={p.title} />}
                                <div className="SimilarInfo">
                                    <h4>{p.title}</h4>
                                    <p>📍 {p.city}</p>
                                    <p className="SimilarPrice">₹{p.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyDetail;
