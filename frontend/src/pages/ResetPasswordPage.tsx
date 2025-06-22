import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import LoadingButton from '../components/LoadingButton';
import { ResetPasswordData } from '../types/auth';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ResetPasswordFormData>();

  const password = watch('password');

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      await resetPassword(token, { password: data.password, confirmPassword: data.confirmPassword });
      navigate('/login', { 
        state: { message: 'Password reset successful! You can now login with your new password.' }
      });
    } catch (error) {
      // Error handling is done in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout title="Invalid reset link">
        <div className="text-center space-y-4">
          <p className="text-red-600">This password reset link is invalid or has expired.</p>
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:text-blue-500 transition-colors duration-200"
          >
            Request a new reset link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Reset your password" 
      subtitle="Enter your new password below"
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="New Password"
          type="password"
          autoComplete="new-password"
          placeholder="Enter your new password"
          showPasswordToggle
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters'
            }
          })}
        />

        <Input
          label="Confirm New Password"
          type="password"
          autoComplete="new-password"
          placeholder="Confirm your new password"
          showPasswordToggle
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) =>
              value === password || 'Passwords do not match'
          })}
        />

        <LoadingButton loading={isLoading} type="submit">
          Reset password
        </LoadingButton>

        <div className="text-center">
          <Link
            to="/login"
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            Back to login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;