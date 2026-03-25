
import React from 'react';

const Header = () => {
    return (
        <header className="app-header">
            <div className="header-container">
                <div className="logo-wrapper">
                    <img 
                        src="https://api.dicebear.com/7.x/initials/svg?seed=5R&backgroundColor=2dd4bf&fontFamily=Inter&fontWeight=700" 
                        alt="5R Logo" 
                        className="header-logo logo-5r"
                        referrerPolicy="no-referrer"
                    />
                </div>
                <div className="header-title">
                    <span className="title-main">5R PRO AUDIT</span>
                    <span className="title-sub">SYSTEM</span>
                </div>
                <div className="logo-wrapper">
                    <img 
                        src="https://api.dicebear.com/7.x/initials/svg?seed=IE&backgroundColor=0f172a&fontFamily=Inter&fontWeight=700" 
                        alt="Inti Everspring Logo" 
                        className="header-logo logo-circular"
                        referrerPolicy="no-referrer"
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
