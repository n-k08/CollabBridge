import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      navigate('/discover');
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-violet/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-violet shadow-xl shadow-accent/30 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Welcome back</h1>
          <p className="text-text-secondary mt-1">Sign in to find your next collaborator</p>
        </div>

        {/* Form Card */}
        <div className="glass rounded-2xl p-6 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-danger-light border border-danger/30 text-danger text-sm animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => { clearError(); setForm({ ...form, email: e.target.value }); }}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => { clearError(); setForm({ ...form, password: e.target.value }); }}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
              required
            />

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-secondary text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-accent hover:text-accent-hover font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo info */}
          <div className="mt-4 p-3 rounded-xl bg-accent-light border border-accent/20 text-xs text-text-secondary">
            <p className="font-medium text-accent mb-1">Demo Account:</p>
            <p>Email: alex@demo.com · Password: demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
