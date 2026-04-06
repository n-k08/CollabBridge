import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function RegisterForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const { register, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email is required';
    if (form.password.length < 6) errs.password = 'At least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords don\'t match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate('/profile');
    } catch {}
  };

  const update = (field, value) => {
    clearError();
    setErrors({ ...errors, [field]: undefined });
    setForm({ ...form, [field]: value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg-primary relative overflow-hidden">
      <div className="absolute top-1/3 -right-32 w-64 h-64 bg-violet/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 -left-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-violet shadow-xl shadow-accent/30 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Create your account</h1>
          <p className="text-text-secondary mt-1">Start finding your perfect collab partner</p>
        </div>

        <div className="glass rounded-2xl p-6 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-danger-light border border-danger/30 text-danger text-sm animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              error={errors.name}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              error={errors.email}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              error={errors.password}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={(e) => update('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
              required
            />

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-secondary text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-accent hover:text-accent-hover font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
