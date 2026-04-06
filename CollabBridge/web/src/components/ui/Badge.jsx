export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-bg-card text-text-secondary border-border',
    accent: 'bg-accent-light text-accent border-accent/30',
    success: 'bg-success-light text-success border-success/30',
    danger: 'bg-danger-light text-danger border-danger/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
