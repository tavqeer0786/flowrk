import React, { useEffect } from 'react';

const GoogleTranslate = () => {
    useEffect(() => {
        // Check if script is already added
        if (!document.querySelector('#google-translate-script')) {
            const script = document.createElement('script');
            script.id = 'google-translate-script';
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.body.appendChild(script);

            // Define global init function
            window.googleTranslateElementInit = () => {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: 'en',
                        includedLanguages: 'en,hi,bn,te,mr,ta,gu,kn,ml,pa', // Indian languages + English
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                        autoDisplay: false,
                    },
                    'google_translate_element'
                );
            };
        }
    }, []);

    return (
        <div className="google-translate-container">
            <div id="google_translate_element" />
            <style>{`
        /* Hide Top Banner */
        .goog-te-banner-frame.skiptranslate {
            display: none !important;
        } 
        body {
            top: 0px !important; 
        }
        /* Style the Dropdown */
        .goog-te-gadget-simple {
            background-color: transparent !important;
            border: none !important;
            padding: 0 !important;
            font-size: 14px !important;
            display: flex !important;
            align-items: center !important;
            cursor: pointer !important;
        }
        .goog-te-gadget-simple img {
            display: none !important;
        }
        .goog-te-gadget-simple span {
            color: #4b5563 !important; /* Gray-600 */
            font-weight: 500 !important;
        }
        .goog-te-gadget-simple span:hover {
            color: #0d9488 !important; /* Teal-600 */
        }
        .goog-te-menu-value {
             margin: 0 !important;
        }
        .goog-te-menu-value span {
            border-left: none !important;
        }
        /* Floating Widget Fixes */
        #google_translate_element {
            display: inline-block;
        }
      `}</style>
        </div>
    );
};

export default GoogleTranslate;
