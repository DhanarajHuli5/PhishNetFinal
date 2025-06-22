import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { apiService } from '../services/api';
import { 
  User, 
  Settings, 
  Shield, 
  LogOut, 
  Mail, 
  Calendar, 
  CheckCircle, 
  AlertTriangle,
  Search,
  Globe,
  Activity,
  TrendingUp,
  Eye,
  Clock,
  AlertCircle,
  Download,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart,
  Zap,
  UserPlus,
  LogIn
} from 'lucide-react';
import Input from '../components/Input';
import LoadingButton from '../components/LoadingButton';
import { ChangePasswordData } from '../types/auth';
import { Link } from 'react-router-dom';

interface URLCheckForm {
  url: string;
}

interface ScanResult {
  id: string;
  url: string;
  status: 'safe' | 'suspicious' | 'dangerous';
  confidence: number;
  timestamp: string;
  details: string[];
}

const DashboardPage: React.FC = () => {
  const { user, logout, changePassword, resendEmailVerification, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'scanner' | 'history' | 'analytics' | 'profile' | 'security'>('scanner');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([
    {
      id: '1',
      url: 'https://suspicious-bank-login.com',
      status: 'dangerous',
      confidence: 94,
      timestamp: '2024-01-15T10:30:00Z',
      details: ['Known phishing domain', 'Suspicious redirects detected', 'Reported by users']
    },
    {
      id: '2',
      url: 'https://google.com',
      status: 'safe',
      confidence: 99,
      timestamp: '2024-01-15T09:15:00Z',
      details: ['Domain verified', 'SSL certificate valid', 'Trusted reputation']
    },
    {
      id: '3',
      url: 'https://new-crypto-exchange.net',
      status: 'suspicious',
      confidence: 72,
      timestamp: '2024-01-15T08:45:00Z',
      details: ['Recently registered domain', 'Limited reputation data', 'Unusual URL structure']
    }
  ]);

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    watch,
    formState: { errors: passwordErrors }
  } = useForm<ChangePasswordData & { confirmPassword: string }>();

  const {
    register: registerURL,
    handleSubmit: handleURLSubmit,
    reset: resetURLForm,
    formState: { errors: urlErrors }
  } = useForm<URLCheckForm>();

  const password = watch('newPassword');

  const handleChangePassword = async (data: ChangePasswordData & { confirmPassword: string }) => {
    if (!isAuthenticated) return;
    
    setIsChangingPassword(true);
    try {
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      });
      resetPasswordForm();
    } catch (error) {
      // Error handling is done in the auth context
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleURLScan = async (data: URLCheckForm) => {
    setIsScanning(true);
    try {
      // Call the ML model API
      const response = await apiService.analyzeUrl(data.url);
      
      // Determine status based on risk level
      let status: 'safe' | 'suspicious' | 'dangerous';
      if (response.risk_factors.overall_risk === 'Low') {
        status = 'safe';
      } else if (response.risk_factors.overall_risk === 'Medium') {
        status = 'suspicious';
      } else {
        status = 'dangerous';
      }
      
      // Convert ML model's confidence score to percentage
      const confidence = response.ml_prediction.phishing_probability 
        ? Math.round(response.ml_prediction.phishing_probability * 100)
        : 50;
      
      // Extract risk factors as details
      const details = response.risk_factors.risk_factors.length > 0 
        ? response.risk_factors.risk_factors 
        : ['No specific risk factors identified'];
      
      const newScan: ScanResult = {
        id: Date.now().toString(),
        url: data.url,
        status,
        confidence,
        timestamp: new Date().toISOString(),
        details
      };
      
      setScanResults(prev => [newScan, ...prev]);
      resetURLForm();
    } catch (error) {
      console.error('Error scanning URL:', error);
      // Handle error - add error notification
      const errorScan: ScanResult = {
        id: Date.now().toString(),
        url: data.url,
        status: 'suspicious',
        confidence: 50,
        timestamp: new Date().toISOString(),
        details: ['Error analyzing URL. The ML service may be unavailable.']
      };
      setScanResults(prev => [errorScan, ...prev]);
    } finally {
      setIsScanning(false);
    }
  };

  const handleResendVerification = async () => {
    if (!isAuthenticated) return;
    
    try {
      await resendEmailVerification();
    } catch (error) {
      // Error handling is done in the auth context
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-600 bg-green-50 border-green-200';
      case 'suspicious': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'dangerous': return 'text-red-600 bg-red-50 border-red-200';
      default: return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return <CheckCircle className="h-5 w-5" />;
      case 'suspicious': return <AlertTriangle className="h-5 w-5" />;
      case 'dangerous': return <AlertCircle className="h-5 w-5" />;
      default: return null;
    }
  };

  const stats = {
    totalScans: scanResults.length,
    threatsBlocked: scanResults.filter(r => r.status === 'dangerous').length,
    suspiciousUrls: scanResults.filter(r => r.status === 'suspicious').length,
    safeUrls: scanResults.filter(r => r.status === 'safe').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-xl shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PhishGuard Dashboard</h1>
                <p className="text-gray-600">
                  {isAuthenticated ? `Welcome back, ${user?.username}!` : 'Advanced URL Protection'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register
                  </Link>
                </>
              ) : (
                <button
                  onClick={logout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Eye, label: 'Total Scans', value: stats.totalScans, color: 'from-blue-500 to-indigo-500' },
            { icon: Shield, label: 'Threats Blocked', value: stats.threatsBlocked, color: 'from-red-500 to-pink-500' },
            { icon: AlertTriangle, label: 'Suspicious URLs', value: stats.suspiciousUrls, color: 'from-yellow-500 to-orange-500' },
            { icon: CheckCircle, label: 'Safe URLs', value: stats.safeUrls, color: 'from-green-500 to-emerald-500' }
          ].map((stat, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sticky top-8">
              <nav className="space-y-2">
                {[
                  { id: 'scanner', icon: Search, label: 'URL Scanner' },
                  { id: 'history', icon: Clock, label: 'Scan History' },
                  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
                  ...(isAuthenticated ? [
                    { id: 'profile', icon: User, label: 'Profile' },
                    { id: 'security', icon: Settings, label: 'Security' }
                  ] : [])
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="h-4 w-4 mr-3" />
                    {tab.label}
                  </button>
                ))}
              </nav>
              
              {!isAuthenticated && (
                <div className="mt-6 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-2">Get More Features</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Register to access profile management, security settings, and more!
                  </p>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200"
                  >
                    Sign Up Free
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              
              {/* URL Scanner Tab */}
              {activeTab === 'scanner' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 rounded-full">
                      <Search className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">URL Scanner</h2>
                      <p className="text-gray-600">Analyze URLs for potential phishing threats</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-6">
                    <form onSubmit={handleURLSubmit(handleURLScan)} className="space-y-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <Input
                            type="url"
                            placeholder="https://example.com"
                            label="Enter URL to scan"
                            error={urlErrors.url?.message}
                            {...registerURL('url', {
                              required: 'Please enter a URL to scan',
                              pattern: {
                                value: /^https?:\/\/.+/,
                                message: 'Please enter a valid URL starting with http:// or https://'
                              }
                            })}
                          />
                        </div>
                        <div className="md:pt-6">
                          <LoadingButton
                            loading={isScanning}
                            type="submit"
                            className="w-full md:w-auto"
                          >
                            <Search className="h-4 w-4 mr-2" />
                            {isScanning ? 'Scanning...' : 'Scan URL'}
                          </LoadingButton>
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* Recent Scans */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Scans</h3>
                    <div className="space-y-4">
                      {scanResults.slice(0, 3).map((result) => (
                        <div key={result.id} className={`p-4 rounded-xl border-2 ${getStatusColor(result.status)}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(result.status)}
                              <div>
                                <p className="font-medium truncate max-w-md">{result.url}</p>
                                <p className="text-sm opacity-80">
                                  {new Date(result.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{result.confidence}%</div>
                              <div className="text-xs opacity-80">Confidence</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Scan History Tab */}
              {activeTab === 'history' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full">
                        <Clock className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Scan History</h2>
                        <p className="text-gray-600">View all your previous URL scans</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        <Filter className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        <Download className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        <RefreshCw className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {scanResults.map((result) => (
                      <div key={result.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(result.status)}
                            <div>
                              <p className="font-medium text-gray-900">{result.url}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(result.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(result.status)}`}>
                            {result.status.toUpperCase()} ({result.confidence}%)
                          </div>
                        </div>
                        <div className="space-y-1">
                          {result.details.map((detail, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                              <span>{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-full">
                      <BarChart3 className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
                      <p className="text-gray-600">Insights into your scanning activity</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Threat Detection Rate</h3>
                        <PieChart className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {((stats.threatsBlocked / stats.totalScans) * 100).toFixed(1)}%
                      </div>
                      <p className="text-sm text-gray-600">
                        {stats.threatsBlocked} threats detected out of {stats.totalScans} scans
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Safety Score</h3>
                        <Zap className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {((stats.safeUrls / stats.totalScans) * 100).toFixed(1)}%
                      </div>
                      <p className="text-sm text-gray-600">
                        {stats.safeUrls} safe URLs identified
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Scanning Activity</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">This Week</span>
                        <span className="font-medium">{stats.totalScans} scans</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Average per Day</span>
                        <span className="font-medium">{Math.round(stats.totalScans / 7)} scans</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Most Active Day</span>
                        <span className="font-medium">Today</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Profile Tab - Only show if authenticated */}
              {activeTab === 'profile' && isAuthenticated && user && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-full">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                      <p className="text-gray-600">Manage your account details</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <p className="text-gray-900 font-medium">{user.username}</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-900 font-medium">{user.email}</p>
                          {user.isEmailVerified ? (
                            <div className="flex items-center text-green-600 text-sm">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Verified
                            </div>
                          ) : (
                            <div className="flex items-center text-amber-600 text-sm">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              Unverified
                            </div>
                          )}
                        </div>
                        {!user.isEmailVerified && (
                          <button
                            onClick={handleResendVerification}
                            className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            Resend verification email
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                        <div className="flex items-center text-gray-900 font-medium">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                        <div className="flex items-center">
                          <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-gray-900 font-medium">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab - Only show if authenticated */}
              {activeTab === 'security' && isAuthenticated && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-4 rounded-full">
                      <Settings className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
                      <p className="text-gray-600">Manage your account security</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex">
                      <Shield className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-amber-800">Change Password</h3>
                        <p className="text-sm text-amber-700 mt-1">
                          Keep your account secure by using a strong, unique password.
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handlePasswordSubmit(handleChangePassword)} className="space-y-6">
                    <Input
                      label="Current Password"
                      type="password"
                      placeholder="Enter your current password"
                      showPasswordToggle
                      error={passwordErrors.oldPassword?.message}
                      {...registerPassword('oldPassword', {
                        required: 'Current password is required'
                      })}
                    />

                    <Input
                      label="New Password"
                      type="password"
                      placeholder="Enter your new password"
                      showPasswordToggle
                      error={passwordErrors.newPassword?.message}
                      {...registerPassword('newPassword', {
                        required: 'New password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters'
                        }
                      })}
                    />

                    <Input
                      label="Confirm New Password"
                      type="password"
                      placeholder="Confirm your new password"
                      showPasswordToggle
                      error={passwordErrors.confirmPassword?.message}
                      {...registerPassword('confirmPassword', {
                        required: 'Please confirm your new password',
                        validate: (value) =>
                          value === password || 'Passwords do not match'
                      })}
                    />

                    <LoadingButton loading={isChangingPassword} type="submit">
                      Update Password
                    </LoadingButton>
                  </form>
                </div>
              )}

              {/* Show login prompt for profile/security tabs when not authenticated */}
              {(activeTab === 'profile' || activeTab === 'security') && !isAuthenticated && (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 rounded-full w-fit mx-auto mb-6">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
                  <p className="text-gray-600 mb-6">
                    Please log in to access {activeTab === 'profile' ? 'profile' : 'security'} settings.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create Account
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;