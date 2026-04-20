import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

import { API_ACCOUNTS } from '../../utils/api';

const Login = () => {
    const navigate = useNavigate();
    const [authShow, setAuthShow] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [signupData, setSignupData] = useState({
        email: '', first_name: '', last_name: '', password: '', password2: ''
    });
    const [showDevVerify, setShowDevVerify] = useState(false);

    if (localStorage.getItem('access')) {
        return <Navigate to="/" replace />;
    }

    const handleLoginChange = (e) => {
        setError('');
        setLoginData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSignupChange = (e) => {
        setError('');
        setSignupData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (!loginData.email || !loginData.password) {
            setError('Please fill in all fields.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`${API_ACCOUNTS}/auth/login/`, loginData);
            localStorage.setItem('access', res.data.access_token || res.data.access);
            localStorage.setItem('refresh', res.data.refresh_token || res.data.refresh);
            localStorage.setItem('user_email', loginData.email);
            navigate('/');
        } catch (err) {
            const msg = err.response?.data?.detail || err.response?.data?.email?.[0] || 'Login failed. Check your credentials.';
            setError(msg);
            // Show dev-verify helper if email not verified
            if (msg.toLowerCase().includes('not verified')) {
                setShowDevVerify(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        if (signupData.password !== signupData.password2) {
            setError("Passwords don't match.");
            return;
        }
        if (signupData.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await axios.post(`${API_ACCOUNTS}/auth/register/`, signupData);
            setSuccessMsg('Account created! Check your email to verify, then log in.');
            setAuthShow(true);
        } catch (err) {
            const data = err.response?.data;
            const msg = data?.email?.[0] || data?.detail || data?.password?.[0] || 'Signup failed.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const switchToSignup = () => { setAuthShow(false); setError(''); setSuccessMsg(''); };
    const switchToLogin = () => { setAuthShow(true); setError(''); setSuccessMsg(''); };

    return (
        <>
            {authShow ? (
                <div className="LoginMainDiv">
                    <div className="Loginleft">
                        <div className="CompanyTitle">Banke Bihari Group</div>
                        <div className="logintitle">Login to Your Account</div>

                        {successMsg && <div className="AuthSuccess">{successMsg}</div>}
                        {error && <div className="AuthError">{error}</div>}
                        {showDevVerify && (
                            <div className="DevVerifyBox">
                                <p>⚠ Dev mode: email sending is disabled.</p>
                                <button
                                    type="button"
                                    className="DevVerifyBtn"
                                    onClick={async () => {
                                        try {
                                            await axios.post(`${API_ACCOUNTS}/auth/dev-verify/`, { email: loginData.email });
                                            setShowDevVerify(false);
                                            setError('');
                                            setSuccessMsg('Email verified! You can now log in.');
                                        } catch (e) {
                                            setError('Dev verify failed: ' + (e.response?.data?.error || e.message));
                                        }
                                    }}
                                >
                                    Click to verify "{loginData.email}" instantly
                                </button>
                            </div>
                        )}

                        <form className="loginDetail" onSubmit={handleLoginSubmit}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={loginData.email}
                                onChange={handleLoginChange}
                                autoComplete="email"
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                autoComplete="current-password"
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    </div>

                    <div className="Loginright">
                        <div className="newhere">New Here?</div>
                        <div className="loginsubtitle">
                            Sign Up and discover a great <br /> amount of new opportunities!
                        </div>
                        <div className="signup-btn">
                            <button onClick={switchToSignup}>Sign Up</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="SingupMainDiv">
                    <div className="signupleft">
                        <div className="Signuptitle">Hello Friend!</div>
                        <div className="singup-slogon">
                            Enter your personal details <br /> and start your journey with us
                        </div>
                        <div className="sign-btn">
                            <button onClick={switchToLogin}>Sign In</button>
                        </div>
                    </div>

                    <div className="signupRight">
                        <div className="Signuptitle-2">Create Your Account</div>

                        {error && <div className="AuthError AuthErrorSignup">{error}</div>}

                        <form className="signupDetail" onSubmit={handleSignupSubmit}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={signupData.email}
                                onChange={handleSignupChange}
                                autoComplete="email"
                            />
                            <input
                                type="text"
                                name="first_name"
                                placeholder="First Name"
                                value={signupData.first_name}
                                onChange={handleSignupChange}
                            />
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Last Name"
                                value={signupData.last_name}
                                onChange={handleSignupChange}
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={signupData.password}
                                onChange={handleSignupChange}
                                autoComplete="new-password"
                            />
                            <input
                                type="password"
                                name="password2"
                                placeholder="Confirm Password"
                                value={signupData.password2}
                                onChange={handleSignupChange}
                                autoComplete="new-password"
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? 'Creating account...' : 'Sign Up'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Login;
