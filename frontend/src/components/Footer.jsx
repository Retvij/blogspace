import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>© {new Date().getFullYear()} BlogSpace — Full-Stack Blog Platform. Built with React, Node.js, Express & MongoDB.</p>
      </div>
    </footer>
  );
};

export default Footer;
