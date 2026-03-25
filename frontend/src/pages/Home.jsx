import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineOfficeBuilding,
  HiOutlineUsers,
  HiOutlineDocumentReport,
  HiOutlineChartBar,
  HiOutlineSparkles,
  HiOutlineArrowNarrowRight,
  HiCheck,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineTrendingUp,
  HiOutlineCog,
  HiOutlineViewGrid,
  HiOutlineChip
} from 'react-icons/hi';

const Home = () => {
  const [currentTagline, setCurrentTagline] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  const taglines = [
    { text: "Streamline Your Workflow", icon: HiOutlineCog },
    { text: "Empower Your Teams", icon: HiOutlineUsers },
    { text: "Track Progress Seamlessly", icon: HiOutlineChartBar },
    { text: "Achieve More Together", icon: HiOutlineSparkles }
  ];

  // Typing Animation Effect
  useEffect(() => {
    const currentFullText = taglines[currentTagline].text;

    const handleTyping = () => {
      if (isDeleting) {
        setDisplayText(prev => prev.slice(0, -1));
        setTypingSpeed(50);
      } else {
        setDisplayText(prev => currentFullText.slice(0, prev.length + 1));
        setTypingSpeed(100);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);

    // Handle deletion and rotation
    if (!isDeleting && displayText === currentFullText) {
      setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setCurrentTagline((prev) => (prev + 1) % taglines.length);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentTagline, taglines, typingSpeed]);

  const features = [
    {
      icon: HiOutlineOfficeBuilding,
      title: 'Project Management',
      desc: 'Create projects, set deadlines, and monitor progress across teams.',
      gradient: 'from-slate-700 to-slate-800',
      iconBg: 'bg-slate-100'
    },
    {
      icon: HiOutlineUsers,
      title: 'Team Coordination',
      desc: 'Assign Team Leaders, onboard interns in bulk, and manage hierarchies.',
      gradient: 'from-indigo-700 to-indigo-800',
      iconBg: 'bg-indigo-100'
    },
    {
      icon: HiOutlineDocumentReport,
      title: 'Daily Reporting',
      desc: 'Date-wise task submissions with status tracking and remarks.',
      gradient: 'from-emerald-700 to-emerald-800',
      iconBg: 'bg-emerald-100'
    },
    {
      icon: HiOutlineChartBar,
      title: 'Analytics Dashboard',
      desc: 'Role-based dashboards for Admin & Manager with performance visibility.',
      gradient: 'from-amber-700 to-amber-800',
      iconBg: 'bg-amber-100'
    },
  ];

  const hierarchy = [
    { name: 'Admin', description: 'Oversight & Control', icon: '👑', color: 'from-purple-600 to-purple-700' },
    { name: 'Manager', description: 'Strategy & Planning', icon: '📊', color: 'from-blue-600 to-blue-700' },
    { name: 'Team Leader', description: 'Coordination & Guidance', icon: '👥', color: 'from-emerald-600 to-emerald-700' },
    { name: 'Interns', description: 'Execution & Learning', icon: '🎯', color: 'from-amber-600 to-amber-700' }
  ];

  const stats = [
    { value: '500+', label: 'Active Organizations', icon: HiOutlineOfficeBuilding, trend: '+28%' },
    { value: '10k+', label: 'Projects Managed', icon: HiOutlineDocumentReport, trend: '+156%' },
    { value: '98%', label: 'Satisfaction Rate', icon: HiOutlineTrendingUp, trend: '+12%' },
    { value: '24/7', label: 'Support Available', icon: HiOutlineClock, trend: 'Always' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section with Card */}
      <section className="pt-24 pb-20 px-4 relative overflow-hidden">
        {/* Elegant Background Elements */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-slate-200/30 to-indigo-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-amber-200/20 to-rose-200/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="text-left animate-slideRight">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-full px-4 py-2 mb-6 shadow-lg animate-scaleIn">
                <HiOutlineSparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium tracking-wide">TASK MANAGEMENT SYSTEM</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold mb-4 animate-fadeIn">
                <span className="bg-gradient-to-r from-slate-800 via-slate-700 to-indigo-600 bg-clip-text text-transparent">
                  TMS
                </span>
              </h1>

              {/* Typing Animation */}
              <div className="h-20 mb-6 animate-slideUp animation-delay-200">
                <div className="flex items-center gap-2">
                  <div className="text-2xl lg:text-3xl font-semibold text-slate-600">
                    {displayText}
                    <span className="animate-pulse text-indigo-500">|</span>
                  </div>
                </div>
              </div>

              <p className="text-lg text-slate-600 mb-8 leading-relaxed animate-slideUp animation-delay-300">
                Role-based project management system for modern organizations.
                Streamline projects, empower teams, and track daily work with
                intelligent monitoring and analytics.
              </p>

              <div className="flex flex-wrap gap-4 animate-slideUp animation-delay-400">
                <Link
                  to="/register"
                  className="group px-8 py-3 bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-xl font-semibold hover:from-slate-700 hover:to-slate-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 transform hover:scale-105 duration-300"
                >
                  Get Started
                  <HiOutlineArrowNarrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/about"
                  className="px-8 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right Side - Hero Card */}
            <div className="relative animate-scaleIn animation-delay-500">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl animate-pulse"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200 p-6 transform hover:scale-[1.02] transition-all duration-500">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <HiOutlineChip className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">TaskFlow TMS</h3>
                      <p className="text-xs text-slate-500">Enterprise Edition</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl p-4 border border-slate-200 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Projects</span>
                      <span className="text-xs font-semibold text-emerald-600 animate-fadeInDown">+23%</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-800 mb-2">24</div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full w-3/4 animate-slideRight"></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">8 projects due this week</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <HiOutlineUsers className="w-5 h-5 text-indigo-500 mb-2" />
                      <div className="text-xl font-bold text-slate-800">48</div>
                      <div className="text-xs text-slate-500">Team Members</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <HiOutlineClock className="w-5 h-5 text-emerald-500 mb-2" />
                      <div className="text-xl font-bold text-slate-800">92%</div>
                      <div className="text-xs text-slate-500">On-time Delivery</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold hover:scale-110 transition-transform duration-300">JD</div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold hover:scale-110 transition-transform duration-300">MK</div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold hover:scale-110 transition-transform duration-300">AL</div>
                      <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-slate-600 text-xs font-bold hover:scale-110 transition-transform duration-300">+12</div>
                    </div>
                    <Link to="/dashboard" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group">
                      View Workplace
                      <HiOutlineArrowNarrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hierarchy Flow - Elegant Version */}
      <section className="py-20 px-4 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-50 rounded-full px-4 py-1.5 mb-4 animate-scaleIn">
              <HiOutlineViewGrid className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">Organizational Structure</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4 animate-slideUp">Clear Role-Based Hierarchy</h2>
            <p className="text-slate-600 max-w-2xl mx-auto animate-slideUp animation-delay-200">Streamlined management flow from strategic oversight to operational execution</p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
            {hierarchy.map((role, idx) => (
              <React.Fragment key={role.name}>
                <div className="group relative animate-fadeIn" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className={`bg-gradient-to-br ${role.color} rounded-2xl shadow-lg px-6 py-4 min-w-[140px] text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{role.icon}</div>
                    <span className="text-lg font-semibold text-white block">{role.name}</span>
                    <span className="text-xs text-white/80 block mt-1">{role.description}</span>
                  </div>
                </div>
                {idx < hierarchy.length - 1 && (
                  <div className="hidden md:flex items-center animate-fadeIn animation-delay-300">
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                    <HiOutlineArrowNarrowRight className="w-5 h-5 text-slate-400 animate-pulse" />
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="mt-12 text-center animate-slideUp animation-delay-500">
            <div className="inline-flex items-center gap-2 text-slate-600 bg-slate-50 px-6 py-2 rounded-full border border-slate-200 hover:shadow-md transition-shadow duration-300">
              <HiCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-sm">Clear responsibility flow from leadership to execution level</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Enhanced */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-50 rounded-full px-4 py-1.5 mb-4 animate-scaleIn">
              <HiOutlineSparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">Powerful Features</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4 animate-slideUp">Everything You Need to Succeed</h2>
            <p className="text-slate-600 max-w-2xl mx-auto animate-slideUp animation-delay-200">Comprehensive tools for project management, team coordination, and performance tracking</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-slate-200 overflow-hidden animate-fadeIn"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className={`h-2 bg-gradient-to-r ${feature.gradient} group-hover:h-3 transition-all duration-300`}></div>
                <div className="p-6">
                  <div className={`w-12 h-12 ${feature.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-slate-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Enhanced */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-scaleIn"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <stat.icon className="w-8 h-8 text-indigo-500 mx-auto mb-3 hover:scale-110 transition-transform duration-300" />
                <div className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</div>
                <div className="text-slate-500 text-sm mb-2">{stat.label}</div>
                <div className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full animate-pulse">
                  <HiOutlineTrendingUp className="w-3 h-3" />
                  <span>{stat.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Elegant Version */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl animate-scaleIn">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-indigo-800"></div>
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px'
              }}
            />

            <div className="relative z-10 p-12 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-slideUp">Ready to Transform Your Workflow?</h2>
              <p className="text-slate-200 mb-8 text-lg max-w-2xl mx-auto animate-slideUp animation-delay-200">
                Join thousands of organizations that trust TaskFlow for efficient project management and team collaboration.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white text-slate-800 px-8 py-3 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-slideUp animation-delay-300"
              >
                Start Free Trial
                <HiOutlineArrowNarrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-slate-300 text-sm mt-6 animate-fadeIn animation-delay-400">No credit card required • Free 14-day trial</p>
            </div>
          </div>
        </div>
      </section>

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
      `}</style>
    </div>
  );
};

export default Home;
