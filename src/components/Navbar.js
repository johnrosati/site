import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-white p-8 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="text-ghibli-brown text-1xl font-bold">John Rosati</a>
        <a href="/contact" className="text-ghibli-brown text-x.5">Contact</a>
      </div>
    </nav>
  );
};

export default Navbar;