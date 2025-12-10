import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { Footer } from '@/components/website/Footer';
import { WolfButton } from '@/components/website/WolfButton';
import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

export const PageWrapper = ({
  children,
  className,
  showHeader = true,
  showFooter = true,
}: PageWrapperProps) => {
  return (
    <div
      className={cn(
        'min-h-screen text-white font-sans selection:bg-red-600 selection:text-white relative bg-black',
        className
      )}
    >
      {/* Base dark gradient - мягкий переход */}
      <div className="fixed inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900" />

      {/* Content */}
      <div className="relative z-10">
        {showHeader && <WebsiteHeader />}
        {children}
        {showFooter && <Footer />}
      </div>

      {/* Wolf Sound Button - floating */}
      <WolfButton />
    </div>
  );
};
