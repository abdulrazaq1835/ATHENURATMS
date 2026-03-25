import React from 'react'
import { Athenura_Nav_Image, Athenura_Title_Image } from '../../assets'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  // Navigation data for easier maintenance
  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Contact', href: '#contact' },
    { name: 'Help Center', href: '#help' }
  ]

  const supportLinks = [
    { name: 'FAQ', href: '#faq' },
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
    { name: 'Cookie Policy', href: '#cookies' }
  ]

  const bottomLinks = [
    { name: 'Privacy', href: '#privacy' },
    { name: 'Terms', href: '#terms' },
    { name: 'Cookies', href: '#cookies' }
  ]

  const contactInfo = {
    address: '123 Business Street, NY 10001',
    email: 'contact@athenura.com',
    phone: '+1 (555) 123-4567'
  }

  // Icon components for better organization
  const LocationIcon = () => (
    <svg className="w-5 h-5 mt-1 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )

  const EmailIcon = () => (
    <svg className="w-5 h-5 mt-1 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )

  const PhoneIcon = () => (
    <svg className="w-5 h-5 mt-1 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  )

  return (
    <footer className="bg-white text-blue-900 border-t border-blue-100" role="contentinfo">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src={Athenura_Nav_Image}
                alt="Athenura logo"
                className="w-48 sm:w-60 h-auto object-contain"
                loading="lazy"
              />
            </div>
            <p className="text-blue-600 text-sm leading-relaxed">
              Your trusted platform for all your needs. We're here to help you succeed.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Quick Links</h3>
            <ul className="space-y-2" role="list">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Support</h3>
            <ul className="space-y-2" role="list">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Contact Us</h3>
            <ul className="space-y-3 text-blue-600" role="list">
              <li className="flex items-start gap-3">
                <LocationIcon />
                <span className="text-sm">{contactInfo.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <EmailIcon />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-sm hover:text-blue-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                >
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <PhoneIcon />
                <a
                  href={`tel:${contactInfo.phone.replace(/\D/g, '')}`}
                  className="text-sm hover:text-blue-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                >
                  {contactInfo.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar with copyright */}
      <div className="border-t border-blue-100 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-blue-700">
            <p>© {currentYear} Athenura. All rights reserved.</p>
            <div className="flex gap-6" role="list">
              {bottomLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="hover:text-blue-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative accent */}
      <div className="h-1 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300" aria-hidden="true"></div>
    </footer>
  )
}

export default Footer
