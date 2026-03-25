
import React from 'react';

const Header = () => {
    return (
        <header className="app-header">
            <div className="header-container">
                <div className="logo-wrapper">
                    <img 
                        src="https://files.oaiusercontent.com/file-9A8B7C6D5E4F3G2H1I0J" 
                        alt="Inti Everspring Logo" 
                        className="header-logo logo-inti"
                        referrerPolicy="no-referrer"
                    />
                </div>
                <div className="header-title">
                    <span className="title-main">5R AUDIT INTERNAL</span>
                    <span className="title-sub">SYSTEM</span>
                </div>
                <div className="logo-wrapper">
                    <img 
                        src="https://files.oaiusercontent.com/file-7Z8X9Y0A1B2C3D4E5F6G7H8I" 
                        alt="WH Logo" 
                        className="header-logo logo-wh"
                        referrerPolicy="no-referrer"
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
