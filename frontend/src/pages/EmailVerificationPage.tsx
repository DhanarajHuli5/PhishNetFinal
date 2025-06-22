import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/AuthLayout';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';

const EmailVerificationPage: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const { token } = useParams<{ token: string }>();
  const { verifyEmail, resendEmailVerification } = useAuth();

  useEffect(() => {
    if (token) {
      handleVerification();
    } else {
      setStatus('error');
    }
  }, [token]);

  const handleVerification = async () => {
    if (!token) return;
    
    try {
      const success = await verifyEmail(token);
      setStatus(success ? 'success' : 'error');
    } catch (error) {
      setStatus('error');
    }
  };

  const handleResendEmail = async () => {
    try {
      await resendEmailVerification();
    } catch (error) {
      // Error handling is done in the auth context
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <h3 className="text-lg font-medium text-gray-900">Verifying your email...</h3>
            <p className="text-gray-600">Please wait while we verify your email address.</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Email verified successfully!</h3>
              <p className="text-gray-600">Your account has been activated. You can now sign in.</p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-[1.02]"
            >
              Continue to Login
            </Link>
          </div>
        );

      case 'error':
        return (
          <div className="text-center space-y-6">
            <XCircle className="h-16 w-16 text-red-600 mx-auto" />
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Verification failed</h3>
              <p className="text-gray-600">
                This verification link is invalid or has expired. Please request a new one.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleResendEmail}
                className="inline-flex items-center justify-center w-full py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02]"
              >
                <Mail className="h-4 w-4 mr-2" />
                Resend verification email
              </button>
              <Link
                to="/login"
                className="block text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Back to login
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AuthLayout title="Email Verification">
      {renderContent()}
    </AuthLayout>
  );
};

export default EmailVerificationPage;