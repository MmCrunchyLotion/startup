import { useState, useEffect } from 'react';

export function useLoadGoogleMaps(apiKey) {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!apiKey) {
            console.error('Google Maps API key is missing');
            return;
        }

        // Already loaded?
        if (window.google && window.google.maps) {
            setLoaded(true);
            return;
        }

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
            console.log("Google Maps loaded!");
            setLoaded(true);
        };

        script.onerror = () => {
            console.error("Failed to load Google Maps script");
        };

        document.head.appendChild(script);

        return () => {
            // Optional cleanup if needed
            // document.head.removeChild(script);
        };
    }, [apiKey]);

    return loaded;
}
