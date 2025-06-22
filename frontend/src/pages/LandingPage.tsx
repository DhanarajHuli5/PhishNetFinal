import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Globe, 
  Lock, 
  Zap, 
  Users, 
  TrendingUp,
  ArrowRight,
  Play,
  Star,
  Award,
  Eye,
  Brain,
  Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="relative z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-2 rounded-xl shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">PhishGuard</h1>
                <p className="text-cyan-200 text-xs">Advanced URL Protection</p>
              </div>
            </div>
            
            {!isAuthenticated && (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-white hover:text-cyan-200 transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Register
                </Link>
              </div>
            )}

            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-cyan-500/20 text-cyan-200 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-cyan-500/30">
              <Zap className="h-4 w-4 mr-2" />
              AI-Powered Protection
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Detect <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Phishing</span>
              <br />URLs Instantly
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Protect yourself and your organization from malicious websites with our advanced AI-powered 
              phishing detection system. Real-time analysis, comprehensive reports, and enterprise-grade security.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Get Started
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
              <button className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-200 transform hover:scale-105 border border-white/20">
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
            {[
              { icon: Eye, label: 'URLs Analyzed', value: '2.5M+' },
              { icon: Shield, label: 'Threats Blocked', value: '150K+' },
              { icon: Users, label: 'Protected Users', value: '50K+' },
              { icon: Award, label: 'Accuracy Rate', value: '99.2%' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <stat.icon className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-300 text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Advanced Protection Features</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our comprehensive security suite provides multi-layered protection against evolving phishing threats
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'AI-Powered Analysis',
                description: 'Machine learning algorithms trained on millions of URLs to detect even the most sophisticated phishing attempts.',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: Activity,
                title: 'Real-Time Monitoring',
                description: 'Continuous monitoring and instant alerts for suspicious activities and newly discovered threats.',
                color: 'from-green-500 to-teal-500'
              },
              {
                icon: Lock,
                title: 'Enterprise Security',
                description: 'Bank-grade encryption and security protocols to protect your data and maintain privacy.',
                color: 'from-blue-500 to-indigo-500'
              },
              {
                icon: Globe,
                title: 'Global Threat Intelligence',
                description: 'Access to worldwide threat databases and real-time intelligence from security researchers.',
                color: 'from-orange-500 to-red-500'
              },
              {
                icon: TrendingUp,
                title: 'Detailed Analytics',
                description: 'Comprehensive reports and analytics to understand threat patterns and improve security posture.',
                color: 'from-cyan-500 to-blue-500'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Sub-second analysis times with 99.9% uptime guarantee for uninterrupted protection.',
                color: 'from-yellow-500 to-orange-500'
              }
            ].map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 h-full">
                  <div className={`bg-gradient-to-r ${feature.color} p-3 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-md rounded-3xl p-12 border border-white/20">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Secure Your Digital Life?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust PhishGuard to protect them from phishing attacks. 
              Start with our free tier or upgrade for advanced features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
              <button className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-200 transform hover:scale-105 border border-white/20">
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-2 rounded-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-white font-bold">PhishGuard</div>
                <div className="text-gray-400 text-sm">Advanced URL Protection</div>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 PhishGuard. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;