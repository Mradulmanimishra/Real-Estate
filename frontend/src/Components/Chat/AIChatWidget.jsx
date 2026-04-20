import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './AIChatWidget.css';

import { API_PROPERTY } from '../../utils/api';

const API = API_PROPERTY;

const AIChatWidget = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hi! 👋 I\'m your property assistant. Ask me anything — "Show 2BHK in Vrindavan under ₹50L" or "What properties are available?"' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const token = localStorage.getItem('access');

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        try {
            const res = await axios.post(`${API}/chat/`, { message: userMsg }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(prev => [...prev, { role: 'bot', text: res.data.reply }]);
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'bot',
                text: 'Sorry, I couldn\'t connect to the AI service. Make sure GEMINI_API_KEY is set in your .env file.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ChatWidgetWrapper">
            {/* Floating button */}
            <button className="ChatToggleBtn" onClick={() => setOpen(!open)} title="AI Property Assistant">
                {open ? '✕' : '🤖'}
                {!open && <span className="ChatBadge">AI</span>}
            </button>

            {/* Chat window */}
            {open && (
                <div className="ChatWindow">
                    <div className="ChatHeader">
                        <div className="ChatHeaderLeft">
                            <div className="ChatAvatar">🤖</div>
                            <div>
                                <p className="ChatTitle">Property Assistant</p>
                                <p className="ChatSubtitle">Powered by Gemini AI</p>
                            </div>
                        </div>
                        <button className="ChatClose" onClick={() => setOpen(false)}>✕</button>
                    </div>

                    <div className="ChatMessages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`ChatBubble ${msg.role}`}>
                                {msg.text.split('\n').map((line, j) => (
                                    <span key={j}>{line}{j < msg.text.split('\n').length - 1 && <br />}</span>
                                ))}
                            </div>
                        ))}
                        {loading && (
                            <div className="ChatBubble bot">
                                <span className="TypingDots"><span /><span /><span /></span>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    <form className="ChatInputRow" onSubmit={sendMessage}>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Ask about properties..."
                            disabled={loading}
                        />
                        <button type="submit" disabled={loading || !input.trim()}>➤</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AIChatWidget;
