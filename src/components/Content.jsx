import React from 'react';

function Content() {
  return (
    <section className="py-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white p-6 rounded shadow">
              <h3 className="text-xl font-bold mb-2">Feature {item}</h3>
              <p>
                This is a brief description of feature {item}. Replace this with your actual content.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Content;