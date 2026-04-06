import { useState } from 'react';

export default function Input({ label, icon, error, className = '', type = 'text', ...props }) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary">{label}</label>
      )}
      <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${
        error 
          ? 'border-danger bg-danger-light' 
          : focused 
            ? 'border-accent bg-accent-light ring-2 ring-accent/20' 
            : 'border-border bg-bg-card hover:border-border-light'
      }`}>
        {icon && (
          <span className="pl-3.5 text-text-muted">{icon}</span>
        )}
        <input
          type={isPassword && showPassword ? 'text' : type}
          className={`w-full bg-transparent px-3.5 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none ${
            icon ? 'pl-2' : ''
          }`}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pr-3.5 text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
          >
            {showPassword ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            )}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  );
}
