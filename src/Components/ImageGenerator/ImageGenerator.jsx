import React, { useRef, useState } from 'react';
import './ImageGenerator.css';
import ai_logo from '../Assets/ai_logo.jpg';


const ImageGenerator = () => {
    const [imageUrl, setImageUrl] = useState("/");
    const inputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const imageGenerator = async () => {
        if (inputRef.current.value === "") {
            setError("Please enter a prompt.");
            return;
        }
        setError('');
        setLoading(true);

        try {
            const response = await fetch("https://api.openai.com/v1/images/generations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`, // Use environment variable
                },
                body: JSON.stringify({
                    prompt: inputRef.current.value,
                    n: 1,
                    size: "512x512",
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate image');
            }

            const data = await response.json();
            setImageUrl(data.data[0].url);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (imageUrl !== "/") {
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = 'generated_image.png'; // Set a default filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className='ai-image-generator'>
            <div className="header">AI Image<span> Generator</span></div>
            <div className="img-loading">
                <div className="image">
                    <img src={imageUrl === "/" ? ai_logo : imageUrl} alt="Generated" />
                </div>
                {loading && (
                    <div className="loading">
                        <div className="loading-bar-full"></div>
                        <div className="loading-text">Loading.....</div>
                    </div>
                )}
                {error && <div className="error-message">{error}</div>}
            </div>
            <div className="search-box">
                <input 
                    type="text" 
                    ref={inputRef} 
                    className='search-input' 
                    placeholder='Describe what you want to see'
                />
                <div className="generate-btn" onClick={imageGenerator}>Generate</div>
                {imageUrl !== "/" && (
                    <button className="download-btn" onClick={handleDownload}>download</button>
                      
                )}
            </div>
        </div>
    );
};

export default ImageGenerator;
