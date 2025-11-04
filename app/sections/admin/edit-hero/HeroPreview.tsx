'use client';

import React from 'react';

interface HeroPreviewProps {
  image: string;
  headline: string;
  subHeadline: string;
}

const HeroPreview: React.FC<HeroPreviewProps> = ({ image, headline, subHeadline }) => {
  return (
    <div className="bg-white rounded-4 shadow-sm p-4">
      <h5 className="fw-bold mb-4">Preview Hero Section</h5>
      
      <div 
        className="position-relative rounded-4 overflow-hidden"
        style={{ 
          height: "400px",
          background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${image}) center/cover no-repeat`,
        }}
      >
        <div 
          className="position-absolute top-50 start-50 translate-middle text-center text-white"
          style={{ width: "80%" }}
        >
          <h1 className="display-4 fw-bold mb-3">
            {headline || "Headline akan muncul di sini"}
          </h1>
          <p className="lead">
            {subHeadline || "Sub headline akan muncul di sini"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroPreview;