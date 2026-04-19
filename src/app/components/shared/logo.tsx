export function Logo({ className = "h-10" }: { className?: string }) {
  return (
    <div className={`font-bold text-2xl ${className}`} style={{ color: 'var(--musikkii-blue)' }}>
      Musikkii
    </div>
  );
}
