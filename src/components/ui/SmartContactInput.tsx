import { useState, useCallback, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SmartContactInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

type ContactType = 'unknown' | 'phone' | 'email';

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
 * Detect contact type based on input
 */
const detectContactType = (value: string): ContactType => {
  if (!value) return 'unknown';

  // Check for email pattern
  if (value.includes('@')) return 'email';

  // Check for phone pattern (starts with digit, +, or has enough digits)
  const firstChar = value[0];
  const digits = value.replace(/\D/g, '');

  if (firstChar === '+' || firstChar === '7' || firstChar === '8' || /^\d/.test(firstChar)) {
    if (digits.length >= 1) return 'phone';
  }

  return 'unknown';
};

/**
 * Validate contact value
 */
export const validateContact = (value: string, t: (key: string) => string): string | true => {
  if (!value || value.trim() === '') {
    return t('validation.required');
  }

  const contactType = detectContactType(value);

  if (contactType === 'phone') {
    const digits = value.replace(/\D/g, '');
    if (digits.length < 11) {
      return t('validation.invalidContact');
    }
    return true;
  }

  if (contactType === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return t('validation.invalidEmail');
    }
    return true;
  }

  return t('validation.invalidContact');
};

const SmartContactInput = forwardRef<HTMLInputElement, SmartContactInputProps>(
  ({ value = '', onChange, onBlur, placeholder, className, error }, ref) => {
    const { t } = useTranslation();
    const [contactType, setContactType] = useState<ContactType>(() => detectContactType(value));

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value;
        const detectedType = detectContactType(newValue);

        setContactType(detectedType);

        // Auto-format phone numbers
        if (detectedType === 'phone') {
          newValue = formatPhoneNumber(newValue);
        }

        onChange?.(newValue);
      },
      [onChange]
    );

    const defaultPlaceholder = placeholder || t('playerRecommendation.contactPlaceholder');

    const Icon = contactType === 'email' ? Mail : Phone;
    const iconColor =
      contactType === 'unknown'
        ? 'text-gray-400'
        : contactType === 'email'
          ? 'text-blue-400'
          : 'text-green-400';

    return (
      <div className="relative">
        <div
          className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200',
            iconColor
          )}
        >
          <Icon className="w-4 h-4" />
        </div>
        <Input
          ref={ref}
          type={contactType === 'email' ? 'email' : 'tel'}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={defaultPlaceholder}
          className={cn('pl-10', error && 'border-red-500 focus:ring-red-500', className)}
        />
      </div>
    );
  }
);

SmartContactInput.displayName = 'SmartContactInput';

export default SmartContactInput;
