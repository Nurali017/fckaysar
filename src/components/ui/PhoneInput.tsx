import { forwardRef, useCallback } from 'react';
import { Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

/**
 * Format phone number with mask: +7 (XXX) XXX-XX-XX
 */
const formatPhoneNumber = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');

  // Ensure it starts with 7
  let normalizedDigits = digits;
  if (digits.startsWith('8')) {
    normalizedDigits = '7' + digits.slice(1);
  } else if (!digits.startsWith('7') && digits.length > 0) {
    normalizedDigits = '7' + digits;
  }

  // Limit to 11 digits (7 + 10)
  normalizedDigits = normalizedDigits.slice(0, 11);

  // Format with mask
  let formatted = '';
  if (normalizedDigits.length > 0) {
    formatted = '+' + normalizedDigits[0];
  }
  if (normalizedDigits.length > 1) {
    formatted += ' (' + normalizedDigits.slice(1, 4);
  }
  if (normalizedDigits.length > 4) {
    formatted += ') ' + normalizedDigits.slice(4, 7);
  }
  if (normalizedDigits.length > 7) {
    formatted += '-' + normalizedDigits.slice(7, 9);
  }
  if (normalizedDigits.length > 9) {
    formatted += '-' + normalizedDigits.slice(9, 11);
  }

  return formatted;
};

/**
 * Validate phone number (Kazakhstan format)
 */
export const validatePhone = (value: string): boolean => {
  const digits = value.replace(/\D/g, '');
  return digits.length === 11 && digits.startsWith('7');
};

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value = '', onChange, onBlur, placeholder = '+7 (XXX) XXX-XX-XX', className, error }, ref) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        onChange?.(formatted);
      },
      [onChange]
    );

    const digits = value.replace(/\D/g, '');
    const isComplete = digits.length === 11;

    return (
      <div className="relative">
        <div
          className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200',
            isComplete ? 'text-green-400' : 'text-gray-400'
          )}
        >
          <Phone className="w-4 h-4" />
        </div>
        <Input
          ref={ref}
          type="tel"
          inputMode="tel"
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={cn('pl-10', error && 'border-red-500 focus:ring-red-500', className)}
        />
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
