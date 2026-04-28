import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const dimensions = {
    sm: 28,
    md: 34,
    lg: 40,
  };
  
  const fontSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
      <svg 
        width={dimensions[size]} 
        height={dimensions[size]} 
        viewBox="0 0 36 36" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="36" height="36" rx="9" fill="#047857"/>
        <rect x="7" y="20" width="4" height="8" rx="1" fill="#F59E0B" opacity="0.6"/>
        <rect x="14" y="15" width="4" height="13" rx="1" fill="#F59E0B" opacity="0.8"/>
        <rect x="21" y="10" width="4" height="18" rx="1" fill="#F59E0B"/>
        <circle cx="27" cy="9" r="2.5" fill="#F59E0B"/>
      </svg>
      {showText && (
        <span className={`font-medium ${fontSize[size]} tracking-wider text-text-primary`}>
          1MINSTOCK
        </span>
      )}
    </Link>
  );
}
