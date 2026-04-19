import musikkiiLogo from '@/assets/musikkii-logo.svg';

export function Logo({ className = 'h-10' }: { className?: string }) {
  return (
    <img
      src={musikkiiLogo}
      alt="Musikkii"
      className={`block w-auto max-w-full object-contain object-left ${className}`}
      draggable={false}
    />
  );
}
