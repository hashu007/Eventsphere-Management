import React from 'react';
import { Box } from '@mui/material';
import logo from "../assets/logo.png";

function Logo({ size = 50, showText = true }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 200 200" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="logoGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#f093fb', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#f5576c', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* Main Circle */}
        <circle cx="100" cy="100" r="95" fill="url(#logoGrad1)"/>
        
        {/* Event Icon */}
        <rect x="60" y="70" width="80" height="60" rx="8" fill="white" opacity="0.9"/>
        <rect x="60" y="70" width="80" height="15" rx="8" fill="url(#logoGrad2)"/>
        <circle cx="80" cy="77.5" r="3" fill="white"/>
        <circle cx="120" cy="77.5" r="3" fill="white"/>
        
        {/* Sphere Elements */}
        <circle cx="100" cy="105" r="8" fill="#667eea"/>
        <circle cx="120" cy="95" r="6" fill="#764ba2" opacity="0.7"/>
        <circle cx="80" cy="95" r="6" fill="#764ba2" opacity="0.7"/>
        <circle cx="110" cy="115" r="5" fill="#667eea" opacity="0.5"/>
        <circle cx="90" cy="115" r="5" fill="#667eea" opacity="0.5"/>
      </svg>
      
      {showText && (
        <Box
          sx={{
            fontFamily: 'Arial, sans-serif',
            fontSize: size * 0.4,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          EventSphere
        </Box>
      )}
    </Box>
  );
}

export default Logo;