import {useState} from "react";
import {useNavigate} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Landing.css";

const Landing = () => {
    const navigate = useNavigate();
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0});

    const handleMouseMove = (e) => {
        setMousePosition({x: e.clientX, y: e.clientY});
    };

    // Finance SVG icons
    const financeIcons = [
        'bi-currency-dollar',
        'bi-credit-card',
        'bi-graph-up',
        'bi-pie-chart',
        'bi-cash-coin',
        'bi-wallet2',
        'bi-bar-chart',
        'bi-receipt'
    ];

    return (
        <div
            className="landing-container"
            onMouseMove={handleMouseMove}
            style={{
                '--mouse-x': `${mousePosition.x}px`,
                '--mouse-y': `${mousePosition.y}px`
            }}
        >
            {/* Animated Gradient Background */}
            <div className="gradient-bg"></div>

            {/* Interactive Particles */}
            <div className="particles">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 20 + 5}px`,
                            height: `${Math.random() * 20 + 5}px`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* Floating Finance Icons */}
            <div className="floating-icons">
                {financeIcons.map((icon, index) => (
                    <i
                        key={index}
                        className={`bi ${icon}`}
                        style={{
                            top: `${Math.random() * 80 + 10}%`,
                            left: `${Math.random() * 80 + 10}%`,
                            fontSize: `${Math.random() * 1.5 + 1.5}rem`,
                            animationDelay: `${index * 0.5}s`,
                            animationDuration: `${Math.random() * 10 + 15}s`
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="content animate-fade">
                <h1 className="display-3 fw-bold mb-4">
                    <span className="gradient-text">BillingPro</span> Solutions
                </h1>

                <div className="animated-svg-container mb-4">
                    <svg viewBox="0 0 500 200" className="billing-svg">
                        {/* Invoice line */}
                        <path
                            d="M50,150 L150,50 L250,150 L350,50 L450,150"
                            stroke="url(#line-gradient)"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray="1000"
                            strokeDashoffset="1000"
                        />

                        {/* Data points */}
                        <circle cx="50" cy="150" r="8" fill="#0d6efd" className="pulse"/>
                        <circle cx="150" cy="50" r="8" fill="#0d6efd" className="pulse"/>
                        <circle cx="250" cy="150" r="8" fill="#0d6efd" className="pulse"/>
                        <circle cx="350" cy="50" r="8" fill="#0d6efd" className="pulse"/>
                        <circle cx="450" cy="150" r="8" fill="#0d6efd" className="pulse"/>

                        {/* Gradient definition */}
                        <defs>
                            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#6a11cb"/>
                                <stop offset="100%" stopColor="#2575fc"/>
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                <p className="lead mb-5">
                    Automated billing solutions for <span className="highlight">modern businesses</span>.
                    Track payments, generate invoices, and manage cash flow in one platform.
                </p>

                <div className="cta-container">
                    <button
                        className="btn btn-lg login-btn me-3"
                        onClick={() => navigate("/login")}
                    >
                        <i className="bi bi-box-arrow-in-right me-2"></i> Get Started
                    </button>
                </div>

                <div className="features mt-5">
                    <div className="feature-item">
                        <i className="bi bi-lightning"></i>
                        <span>Real-time Analytics</span>
                    </div>
                    <div className="feature-item">
                        <i className="bi bi-shield-check"></i>
                        <span>Bank-level Security</span>
                    </div>
                    <div className="feature-item">
                        <i className="bi bi-arrow-repeat"></i>
                        <span>Recurring Billing</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;