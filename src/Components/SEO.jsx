import React, { useEffect } from 'react';

/**
 * SEO Component to handle page metadata
 * @param {Object} props
 * @param {string} props.title - The title of the page
 * @param {string} props.description - The meta description
 * @param {string} props.keywords - The meta keywords
 */
const SEO = ({ title, description, keywords }) => {
    useEffect(() => {
        // Update Document Title
        if (title) {
            document.title = `${title} | Flowrk.in`;
        }

        // Update Meta Description
        if (description) {
            let metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', description);
            } else {
                metaDescription = document.createElement('meta');
                metaDescription.name = 'description';
                metaDescription.content = description;
                document.head.appendChild(metaDescription);
            }
        }

        // Update Meta Keywords
        if (keywords) {
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (metaKeywords) {
                metaKeywords.setAttribute('content', keywords);
            } else {
                metaKeywords = document.createElement('meta');
                metaKeywords.name = 'keywords';
                metaKeywords.content = keywords;
                document.head.appendChild(metaKeywords);
            }
        }
    }, [title, description, keywords]);

    return null;
};

export default SEO;
