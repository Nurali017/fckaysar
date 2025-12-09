import { cn } from '@/lib/utils';

interface TexturedBackgroundProps {
  className?: string;
  overlay?: 'dark' | 'darker' | 'light' | 'none';
  children?: React.ReactNode;
}

export const TexturedBackground = ({
  className,
  overlay = 'dark',
  children,
}: TexturedBackgroundProps) => {
  const overlayStyles = {
    dark: 'bg-gradient-to-b from-black/70 via-black/50 to-black/90',
    darker: 'bg-gradient-to-b from-black/80 via-black/70 to-black',
    light: 'bg-gradient-to-b from-black/40 via-black/30 to-black/60',
    none: '',
  };

  return (
    <div className={cn('relative', className)}>
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=80')`,
        }}
      />
      <div className={cn('absolute inset-0', overlayStyles[overlay])} />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export const texturedBgStyle = {
  backgroundImage: `url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=80')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
};
