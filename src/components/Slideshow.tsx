
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const IMAGES = [
    'https://i.imgur.com/1lQaLLc.jpg',
    'https://i.imgur.com/abpM0Dd.jpg',
    'https://i.imgur.com/SRERseC.jpg',
    'https://i.imgur.com/2RST3y1.jpg'
];

const Slideshow: React.FC = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % IMAGES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="slideshow-container">
            <AnimatePresence mode="wait">
                <motion.img
                    key={IMAGES[index]}
                    src={IMAGES[index]}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                    className="slideshow-image"
                    referrerPolicy="no-referrer"
                />
            </AnimatePresence>
            <div className="slideshow-overlay" />
            <div className="slideshow-indicators">
                {IMAGES.map((_, i) => (
                    <div 
                        key={i} 
                        className={`slideshow-dot ${i === index ? 'active' : ''}`} 
                        onClick={() => setIndex(i)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Slideshow;
