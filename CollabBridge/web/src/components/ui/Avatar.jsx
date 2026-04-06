export default function Avatar({ src, name, size = 'md', online, className = '' }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
    '2xl': 'w-28 h-28 text-3xl',
  };

  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
  };

  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const colors = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-indigo-500 to-blue-600',
  ];

  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizes[size]} rounded-full object-cover ring-2 ring-border`}
        />
      ) : (
        <div
          className={`${sizes[size]} rounded-full bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center font-semibold text-white ring-2 ring-border`}
        >
          {initials}
        </div>
      )}
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 ${dotSizes[size]} rounded-full border-2 border-bg-primary ${
            online ? 'bg-success' : 'bg-text-muted'
          }`}
        />
      )}
    </div>
  );
}
