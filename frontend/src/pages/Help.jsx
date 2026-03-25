import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      q: "Who can log in to TaskFlow?",
      a: "Only Admins and Managers have login access. Team Leaders have a limited task submission form, and Interns do not log in.",
      category: "access",
      icon: "🔐"
    },
    {
      q: "How are interns onboarded?",
      a: "Managers can upload interns in bulk using CSV or Excel files. The system validates emails, unique IDs, and formats.",
      category: "onboarding",
      icon: "👥"
    },
    {
      q: "Can a Team Leader create projects?",
      a: "No, Team Leaders cannot create projects. They only submit daily work reports for their assigned team members.",
      category: "projects",
      icon: "📋"
    },
    {
      q: "How does task reporting work?",
      a: "Team Leaders select a project, date, team member, enter work description, status, and remarks. Reports are stored date-wise.",
      category: "reporting",
      icon: "📊"
    },
    {
      q: "What happens if a project deadline is missed?",
      a: "Admins and Managers can monitor deadlines on dashboards; email notifications can be enabled for alerts.",
      category: "deadlines",
      icon: "⏰"
    }
  ];

  const categories = [
    { name: "All", value: "all", icon: "🎯" },
    { name: "Access", value: "access", icon: "🔐" },
    { name: "Onboarding", value: "onboarding", icon: "👥" },
    { name: "Projects", value: "projects", icon: "📋" },
    { name: "Reporting", value: "reporting", icon: "📊" }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          faq.a.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section with Decoration */}
        <div className="text-center mb-12 animate-slideUp">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300 animate-scaleIn">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 bg-clip-text text-transparent mb-4 animate-fadeIn">
            How can we help you?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-slideUp animation-delay-200">
            Find answers, get support, and learn how to make the most of TaskFlow
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10 animate-slideUp animation-delay-300">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-blue-100 rounded-2xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 shadow-sm hover:shadow-md text-gray-700"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fadeIn animation-delay-400">
          {categories.map((cat, idx) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === cat.value
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200'
                  : 'bg-white text-gray-600 hover:bg-blue-50 border-2 border-blue-100'
              }`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* FAQ Cards */}
        <div className="grid gap-6 mb-12">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-100 hover:border-blue-300 animate-slideUp"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full text-left p-6 focus:outline-none"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                      {faq.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {faq.q}
                        </h3>
                        <svg
                          className={`w-6 h-6 text-blue-500 transform transition-transform duration-300 ${
                            expandedFaq === idx ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          expandedFaq === idx ? 'mt-4' : 'max-h-0'
                        }`}
                      >
                        <div className="pt-2">
                          <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-3 animate-slideRight"></div>
                          <p className="text-gray-600 leading-relaxed">{faq.a}</p>

                          {/* Quick Actions */}
                          <div className="mt-4 flex gap-3">
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group">
                              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                              </svg>
                              Share
                            </button>
                            <button className="text-sm text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1 group">
                              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12 animate-fadeIn">
              <div className="text-6xl mb-4 animate-bounce">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
              <p className="text-gray-500">Try adjusting your search or browse by category</p>
            </div>
          )}
        </div>

        {/* Support Section with Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Contact Support Card */}
          <div className="group bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-slideUp animation-delay-500">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Need direct support?</h2>
            <p className="text-blue-100 mb-6">Our team is ready to help you with any questions</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105 group"
            >
              Contact Support
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Quick Links Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 animate-scaleIn animation-delay-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m3.172-3.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Quick Resources</h3>
            </div>
            <div className="space-y-3">
              {['Getting Started Guide', 'Video Tutorials', 'API Documentation', 'Release Notes'].map((item, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors group/item animate-fadeIn"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <span className="text-gray-700 group-hover/item:text-blue-600">{item}</span>
                  <svg className="w-5 h-5 text-gray-400 group-hover/item:text-blue-500 transform group-hover/item:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          <div className="text-center p-4 animate-scaleIn" style={{ animationDelay: '0ms' }}>
            <div className="text-3xl font-bold text-blue-600 mb-1 animate-pulse">24/7</div>
            <div className="text-sm text-gray-500">Support Available</div>
          </div>
          <div className="text-center p-4 border-x border-blue-100 animate-scaleIn" style={{ animationDelay: '100ms' }}>
            <div className="text-3xl font-bold text-blue-600 mb-1 animate-pulse">&lt; 2hr</div>
            <div className="text-sm text-gray-500">Response Time</div>
          </div>
          <div className="text-center p-4 animate-scaleIn" style={{ animationDelay: '200ms' }}>
            <div className="text-3xl font-bold text-blue-600 mb-1 animate-pulse">98%</div>
            <div className="text-sm text-gray-500">Satisfaction Rate</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
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

export default Help;
