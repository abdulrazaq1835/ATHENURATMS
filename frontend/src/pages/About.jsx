import React from 'react';
import {
  HiOutlineClipboardList,
  HiOutlineUserGroup,
  HiOutlineShieldCheck,
  HiCheck,
  HiOutlineSparkles
} from 'react-icons/hi';

const About = () => {
  const objectives = [
    'Centralized project monitoring',
    'Efficient team creation & bulk intern onboarding via CSV/Excel',
    'Deadline tracking & date-wise work reporting',
    'Role-based dashboards & performance visibility'
  ];

  const roles = [
    { name: 'Admin', desc: 'Superuser with full monitoring access, views all projects, managers, interns, and reports.', gradient: 'from-blue-600 to-blue-700', icon: '👑' },
    { name: 'Manager', desc: 'Creates projects, sets deadlines, uploads interns, forms teams, assigns leaders.', gradient: 'from-blue-500 to-blue-600', icon: '📊' },
    { name: 'Team Leader', desc: 'Execution coordinator, submits daily work reports for assigned team members.', gradient: 'from-sky-500 to-blue-500', icon: '👥' },
    { name: 'Interns', desc: 'System users under Team Leaders, no login access.', gradient: 'from-sky-400 to-blue-400', icon: '🎓' }
  ];

  const features = [
    { title: 'Real-time Monitoring', desc: 'Track progress and performance instantly', color: 'blue' },
    { title: 'Bulk Operations', desc: 'CSV/Excel import for efficient onboarding', color: 'sky' },
    { title: 'Deadline Alerts', desc: 'Never miss important deadlines', color: 'indigo' },
    { title: 'Role-based Access', desc: 'Secure and organized data visibility', color: 'cyan' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section with Gradient */}
        <div className="text-center mb-16 animate-slideUp">
          <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-6 animate-scaleIn">
            <HiOutlineSparkles className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Next Generation Task Management</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 bg-clip-text text-transparent mb-6 animate-fadeIn">
            About TaskFlow
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-slideUp animation-delay-200">
            A structured, role-based web application designed to manage projects, teams, interns, and daily work reporting transparently.
          </p>
        </div>

        {/* System Overview Card */}
        <div className="bg-white rounded-2xl shadow-xl mb-12 overflow-hidden border border-blue-100 animate-slideRight">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <HiOutlineClipboardList className="text-white animate-pulse" />
              System Overview
            </h2>
          </div>
          <div className="p-8">
            <p className="text-gray-700 mb-8 leading-relaxed animate-fadeIn">
              The platform follows a hierarchical workflow ensuring proper monitoring, reporting, and accountability at every level.
              Admins oversee operations, Managers handle project execution, Team Leaders coordinate daily tasks, and Interns contribute under supervision.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 animate-slideUp animation-delay-300">
                <h3 className="font-bold text-blue-800 mb-4 text-lg">System Manages</h3>
                <ul className="space-y-2 text-gray-700">
                  {['Projects', 'Teams', 'Interns', 'Team Leaders', 'Daily Work Reports', 'Deadlines & Progress'].map((item, idx) => (
                    <li key={item} className="flex items-center gap-2 group animate-fadeIn" style={{ animationDelay: `${idx * 50}ms` }}>
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition group-hover:scale-110">
                        <HiCheck className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="group-hover:text-blue-700 transition group-hover:translate-x-1 inline-block">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 animate-slideUp animation-delay-400">
                <h3 className="font-bold text-blue-800 mb-4 text-lg">Key Objectives</h3>
                <ul className="space-y-2 text-gray-700">
                  {objectives.map((obj, idx) => (
                    <li key={idx} className="flex items-center gap-2 group animate-fadeIn" style={{ animationDelay: `${idx * 50}ms` }}>
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition group-hover:scale-110">
                        <HiCheck className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="group-hover:text-blue-700 transition group-hover:translate-x-1 inline-block">{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* System Roles with Gradient Cards */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-4 animate-scaleIn">
              <HiOutlineUserGroup className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Role-Based Architecture</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 animate-slideUp">System Roles</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role, idx) => (
              <div key={role.name} className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-blue-100 animate-fadeIn" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className={`bg-gradient-to-r ${role.gradient} px-5 py-4`}>
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300 inline-block">{role.icon}</div>
                  <h3 className="text-xl font-bold text-white">{role.name}</h3>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 text-sm leading-relaxed">{role.desc}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center animate-slideUp animation-delay-500">
            <p className="text-sm text-gray-500 bg-blue-50 inline-block px-4 py-2 rounded-full hover:shadow-md transition-all duration-300">
              *Only Admin and Manager have login access. Team Leaders have limited form access; Interns have no system access.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, idx) => (
            <div key={idx} className={`bg-gradient-to-br from-${feature.color}-50 to-white rounded-xl p-6 border border-${feature.color}-200 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-scaleIn`} style={{ animationDelay: `${idx * 100}ms` }}>
              <div className={`w-12 h-12 rounded-full bg-${feature.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <HiCheck className={`w-6 h-6 text-${feature.color}-600`} />
              </div>
              <h3 className={`font-bold text-${feature.color}-800 mb-2`}>{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Security & Tech Stack Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100 animate-slideUp">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <HiOutlineShieldCheck className="text-white animate-pulse" />
              Security & Tech Stack
            </h2>
          </div>
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="animate-slideRight">
                <h3 className="font-bold text-blue-800 mb-3 text-lg">Technology Stack</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['Node.js', 'Spring Boot', 'REST APIs', 'JWT', 'React.js', 'MongoDB'].map((tech, idx) => (
                    <span key={tech} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold hover:bg-blue-200 hover:scale-105 transition-all duration-300 cursor-default animate-fadeIn" style={{ animationDelay: `${idx * 50}ms` }}>
                      {tech}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Backend: Node.js / Spring Boot with REST APIs, JWT Authentication, CSV Parser.<br />
                  Frontend: React.js with role dashboards.<br />
                  Database: MongoDB with optimized queries.
                </p>
              </div>
              <div className="animate-slideRight animation-delay-300">
                <h3 className="font-bold text-blue-800 mb-3 text-lg">Security Features</h3>
                <ul className="space-y-2 text-gray-600">
                  {[
                    'Encrypted passwords with bcrypt',
                    'Role-based route protection',
                    'Unique email validation',
                    'Secure file upload with validation',
                    'JWT token expiration & refresh'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 group animate-fadeIn" style={{ animationDelay: `${idx * 50}ms` }}>
                      <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-150 transition-transform"></div>
                      <span className="group-hover:text-blue-600 transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
