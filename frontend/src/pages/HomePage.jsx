import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// --- SVG Icon Components ---
const FiCodeIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);
const FiCpuIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
    <rect x="9" y="9" width="6" height="6"></rect>
    <line x1="9" y1="1" x2="9" y2="4"></line>
    <line x1="15" y1="1" x2="15" y2="4"></line>
    <line x1="9" y1="20" x2="9" y2="23"></line>
    <line x1="15" y1="20" x2="15" y2="23"></line>
    <line x1="20" y1="9" x2="23" y2="9"></line>
    <line x1="20" y1="14" x2="23" y2="14"></line>
    <line x1="1" y1="9" x2="4" y2="9"></line>
    <line x1="1" y1="14" x2="4" y2="14"></line>
  </svg>
);
const FiAwardIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="8" r="7"></circle>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
  </svg>
);
const FiLogInIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
    <polyline points="10 17 15 12 10 7"></polyline>
    <line x1="15" y1="12" x2="3" y2="12"></line>
  </svg>
);
const FiUserPlusIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="20" y1="8" x2="20" y2="14"></line>
    <line x1="17" y1="11" x2="23" y2="11"></line>
  </svg>
);
const FiArrowRightIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-cyan-400 hover:bg-gray-900/50 transition-all duration-300"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-cyan-400/10 text-cyan-400 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </motion.div>
);

const HomePage = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <header className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white">
            Code<span className="text-cyan-400">Joy</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <FiLogInIcon />
              <span>Login</span>
            </Link>
            <Link
              to="/signup"
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              <FiUserPlusIcon />
              <span>Sign Up</span>
            </Link>
          </div>
        </div>
      </header>
      <main>
        <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-black opacity-80 z-0"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,189,248,0.3),rgba(255,255,255,0))] z-0"></div>
          <motion.div
            className="relative z-10 px-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 leading-tight">
              Get ready for your OAs and Interviews
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Solve challenging problems, get hints along the way, and an instant feedback with AI-powered
              code reviews, only on CodeJoy.
              Enjoy Coding
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/questions"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
              >
                Start Solving Problems <FiArrowRightIcon className="mt-1" />
              </Link>
            </motion.div>
          </motion.div>
        </section>
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-white">
                Why CodeJoy?
              </h2>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                We provide a comprehensive platform for coding practice, interview preparation, and skill development.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<FiCodeIcon size={24} />}
                title="Diverse Problem Set"
                description="Tackle a wide range of algorithmic challenges curated from top tech companies and competitive programming contests."
                delay={0.1}
              />
              <FeatureCard
                icon={<FiCpuIcon size={24} />}
                title="AI Code Review & Hints"
                description="Get instant, constructive feedback on your code's efficiency and style, or ask for a hint when you're stuck."
                delay={0.2}
              />
              <FeatureCard
                icon={<FiAwardIcon size={24} />}
                title="Track Your Progress"
                description="Visualize your submission history, accuracy, and solved problems on your personal dashboard."
                delay={0.3}
              />
            </div>
          </div>
        </section>
        <section className="bg-gray-900 py-20">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-4xl font-extrabold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Create a free account to save your progress, track your stats, and
              join a community of passionate coders.
            </p>
            <div className="flex justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Create an Account
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Login to Your Account
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-black py-8">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} CodeJoy. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Built with passion in INDIA, by Vir Pareek.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
