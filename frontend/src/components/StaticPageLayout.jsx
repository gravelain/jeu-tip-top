import React from 'react';

// Reusable layout component for simple static content pages
const StaticPageLayout = ({ title, children }) => {
  return (
    <main className="bg-gray-50 py-12 px-4 min-h-screen">
      <div className="container mx-auto max-w-4xl bg-white p-8 md:p-10 rounded-lg shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-teal-700 mb-8">
          {title}
        </h1>
        {/* Apply prose styles for better typography on static content */}
        <div className="prose prose-teal max-w-none prose-h2:text-teal-600 prose-h2:font-semibold prose-h2:mb-3 prose-h2:mt-6 prose-strong:font-semibold prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline">
          {children}
        </div>
      </div>
    </main>
  );
};

export default StaticPageLayout; 