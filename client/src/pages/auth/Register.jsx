import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { api, getErrorMessage } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const schema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
});

export default function Register() {
  const [role, setRole] = useState('candidate');
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post('/auth/register', { ...values, role });
      if (data.token) {
        login(data.token, data.user);
        toast.success(`Welcome to Hirely, ${data.user.name.split(' ')[0]}`);
        navigate(data.user.role === 'recruiter' ? '/recruiter' : '/jobs', { replace: true });
      } else {
        toast.success(data.message);
        navigate('/login');
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Free, and takes less than a minute.">
      <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-ink-900/60 p-1 border border-mist/8">
        {[
          { value: 'candidate', label: "I'm hiring myself", icon: UserRound },
          { value: 'recruiter', label: "I'm hiring others", icon: Briefcase },
        ].map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setRole(value)}
            className={clsx(
              'flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium transition-colors',
              role === value ? 'bg-brand-500 text-white' : 'text-ink-400 hover:text-ink-200'
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full name"
          icon={User}
          placeholder="Jordan Lee"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email"
          icon={Mail}
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          icon={Lock}
          type="password"
          placeholder="At least 6 characters"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" loading={isSubmitting} className="w-full">
          Create {role === 'recruiter' ? 'recruiter' : 'candidate'} account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-400">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-300 hover:text-brand-200">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
