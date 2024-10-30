import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-xl">
        <header className="py-4 mb-4 text-center">
          <h1 className="text-3xl font-bold text-black">Task Manager by Alparo, C. L.</h1>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
