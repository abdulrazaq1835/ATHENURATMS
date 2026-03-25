import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `linear-gradient(to right, #1e293b 1px, transparent 1px),
                          linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }}></div>

      <div className="text-center max-w-md relative z-10">
        {/* 404 Number with Animation */}
        <div className="relative mb-6">
          <div className="text-9xl md:text-9xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 animate-scaleIn">
            404
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>

          {/* Floating Particles */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-indigo-400 rounded-full blur-2xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>

        {/* Error Message with Animation */}
        <div className="animate-slideUp">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Oops! Page Not Found
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mb-4 rounded-full animate-slideRight"></div>
          <p className="text-gray-600 mb-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Let's get you back on track.
          </p>
        </div>

        {/* Back to Home Button with Animation */}
        <div className="animate-slideUp animation-delay-200">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 duration-300 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Quick Navigation Links */}
        <div className="mt-8 pt-6 border-t border-gray-200 animate-fadeIn animation-delay-300">
          <p className="text-sm text-gray-500 mb-3">You might want to visit:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
              { name: "Contact", path: "/contact" },
              { name: "Help", path: "/help" },
              { name: "Login", path: "/login" }
            ].map((link, idx) => (
              <Link
                key={idx}
                to={link.path}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors px-2 py-1 rounded-lg hover:bg-blue-50"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center animate-fadeIn animation-delay-400">
          <p className="text-xs text-gray-400">
            Need assistance? <Link to="/contact" className="text-blue-500 hover:text-blue-600 hover:underline">Contact Support</Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
