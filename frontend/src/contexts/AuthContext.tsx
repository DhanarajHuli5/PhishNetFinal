import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  AuthContextType, 
  LoginCredentials, 
  RegisterData, 
  ChangePasswordData,
  ForgotPasswordData,
  ResetPasswordData
} from '../types/auth';
import { apiService } from '../services/api';
import { storage } from '../utils/storage';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const storedUser = storage.getUser();
      const hasTokens = storage.hasTokens();

      if (storedUser && hasTokens) {
        // Verify current user with backend
        try {
          const response = await apiService.getCurrentUser();
          setUser(response.data.user);
        } catch (error) {
          // If token is invalid, clear storage
          storage.clearTokens();
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await apiService.login(credentials);
      const { user, accessToken, refreshToken } = response.data;

      storage.setAccessToken(accessToken);
      storage.setRefreshToken(refreshToken);
      storage.setUser(user);
      setUser(user);

      toast.success('Welcome back!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await apiService.register(data);
      toast.success('Registration successful! Please check your email to verify your account.');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      storage.clearTokens();
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await apiService.refreshAccessToken();
      const { accessToken } = response.data;
      storage.setAccessToken(accessToken);
      return true;
    } catch (error) {
      storage.clearTokens();
      setUser(null);
      return false;
    }
  };

  const changePassword = async (data: ChangePasswordData) => {
    try {
      await apiService.changePassword(data);
      toast.success('Password changed successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
      throw error;
    }
  };

  const forgotPassword = async (data: ForgotPasswordData) => {
    try {
      await apiService.forgotPassword(data);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
      throw error;
    }
  };

  const resetPassword = async (token: string, data: ResetPasswordData) => {
    try {
      await apiService.resetPassword(token, { password: data.password });
      toast.success('Password reset successful! You can now login.');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to reset password';
      toast.error(message);
      throw error;
    }
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      await apiService.verifyEmail(token);
      toast.success('Email verified successfully!');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Email verification failed';
      toast.error(message);
      return false;
    }
  };

  const resendEmailVerification = async () => {
    try {
      await apiService.resendEmailVerification();
      toast.success('Verification email sent! Check your inbox.');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send verification email';
      toast.error(message);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendEmailVerification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};