import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const HomePage = () => {
  const navigate = useNavigate();
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const studentContent = {
    title: "For Students",
    description:
      "Students, your feedback is crucial for improving the quality of our courses. Participate in our anonymous feedback process to share your thoughts and suggestions. Your input helps us enhance the learning experience for everyone. Submit feedback after mid-term and final exams. Answer questions on course content, teaching methods, and overall experience. Your responses are confidential and cannot be edited once submitted.",
  };

  const professorContent = {
    title: "For Professors",
    description:
      "Professors, gain valuable insights into your teaching effectiveness by reviewing student feedback. Use this information to refine your teaching methods and course materials. Request student identities in case of abusive language. Respond to feedback anonymously and engage with students to address concerns. View visual representations of feedback to identify areas for improvement.",
  };

  return (
    <div className="min-h-screen bg-gradient">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-white">F</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                FeedFusion
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Home</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection(aboutRef); }} className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">About</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection(contactRef); }} className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Contact</a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-6 py-2.5 border-2 border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-all transform hover:scale-105 active:scale-95"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center pt-24 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to Campus Polls and opinions.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your comprehensive platform for managing and providing academic feedback
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl w-full px-4">
          {/* Student Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all hover:scale-105">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">{studentContent.title}</h2>
            <p className="text-gray-600">{studentContent.description}</p>
          </div>

          {/* Professor Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all hover:scale-105">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">{professorContent.title}</h2>
            <p className="text-gray-600">{professorContent.description}</p>
          </div>
        </div>

        {/* About Section */}
        <div ref={aboutRef} className="w-full max-w-6xl mt-24 mb-12 px-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">About </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-indigo-600 mb-4">Our Mission</h3>
                <p className="text-gray-600 mb-6">
                  To create a transparent and efficient feedback system that enhances the quality of education through meaningful communication between students and educators.
                </p>
                <h3 className="text-xl font-semibold text-indigo-600 mb-4">Our Vision</h3>
                <p className="text-gray-600">
                  To revolutionize educational feedback by providing a platform that promotes continuous improvement and mutual understanding between students and faculty.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-indigo-600 mb-4">What Sets Us Apart</h3>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    Anonymous and secure feedback system
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    Real-time analytics and insights
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    Two-way communication channel
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    Comprehensive reporting tools
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div ref={contactRef} className="w-full max-w-6xl mb-12 px-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Contact Us</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-indigo-600 mb-4">Get in Touch</h3>
                  <p className="text-gray-600">
                    Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <i className="fas fa-map-marker-alt text-indigo-600 mt-1"></i>
                    <div>
                      <h4 className="font-semibold text-gray-900">Address</h4>
                      <p className="text-gray-600">123 Education Street, Academic District, 12345</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <i className="fas fa-phone text-indigo-600 mt-1"></i>
                    <div>
                      <h4 className="font-semibold text-gray-900">Phone</h4>
                      <p className="text-gray-600">+1 234 567 8900</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <i className="fas fa-envelope text-indigo-600 mt-1"></i>
                    <div>
                      <h4 className="font-semibold text-gray-900">Email</h4>
                      <p className="text-gray-600">info@feedbacksystem.edu</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <form className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Subject"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Your Message"
                      rows="5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105 active:scale-95"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
