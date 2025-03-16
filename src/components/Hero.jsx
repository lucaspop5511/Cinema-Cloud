import React from 'react';

function Hero() {
  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Cinema Cloud</h2>
        <p className="text-xl mb-6">A modern React application built from scratch</p>
        <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          Learn More
        </button>
      </div>
    </section>
  );
}

export default Hero;