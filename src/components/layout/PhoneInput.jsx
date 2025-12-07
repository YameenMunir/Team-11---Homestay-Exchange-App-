import { useState } from 'react';
import { Phone } from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+64', country: 'NZ', flag: '🇳🇿' },
  { code: '+353', country: 'IE', flag: '🇮🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+31', country: 'NL', flag: '🇳🇱' },
  { code: '+32', country: 'BE', flag: '🇧🇪' },
  { code: '+41', country: 'CH', flag: '🇨🇭' },
  { code: '+46', country: 'SE', flag: '🇸🇪' },
  { code: '+47', country: 'NO', flag: '🇳🇴' },
  { code: '+45', country: 'DK', flag: '🇩🇰' },
  { code: '+351', country: 'PT', flag: '🇵🇹' },
  { code: '+30', country: 'GR', flag: '🇬🇷' },
  { code: '+48', country: 'PL', flag: '🇵🇱' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+82', country: 'KR', flag: '🇰🇷' },
];

export default function PhoneInput({
  value = '',
  onChange,
  required = false,
  className = '',
  id = 'phone',
  name = 'phone',
  placeholder = 'Enter phone number',
  accessible = false
}) {
  // Parse existing value to extract country code if present
  const getInitialCountryCode = () => {
    if (value.startsWith('+')) {
      // Find matching country code
      const match = COUNTRY_CODES.find(c => value.startsWith(c.code));
      return match ? match.code : '+44';
    }
    return '+44'; // Default to UK
  };

  const getInitialPhoneNumber = () => {
    if (value.startsWith('+')) {
      const countryCode = getInitialCountryCode();
      return value.substring(countryCode.length);
    }
    return value;
  };

  const [countryCode, setCountryCode] = useState(getInitialCountryCode());
  const [phoneNumber, setPhoneNumber] = useState(getInitialPhoneNumber());

  const handleCountryCodeChange = (e) => {
    const newCode = e.target.value;
    setCountryCode(newCode);
    // Update parent component with both separate and combined values
    onChange({
      target: {
        name,
        value: newCode + phoneNumber,
        // Include metadata for separate storage
        countryCode: newCode,
        phoneNumber: phoneNumber,
        fullPhone: newCode + phoneNumber
      }
    });
  };

  const handlePhoneNumberChange = (e) => {
    const newNumber = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
    setPhoneNumber(newNumber);
    // Update parent component with both separate and combined values
    onChange({
      target: {
        name,
        value: countryCode + newNumber,
        // Include metadata for separate storage
        countryCode: countryCode,
        phoneNumber: newNumber,
        fullPhone: countryCode + newNumber
      }
    });
  };

  const inputClass = accessible ? 'input-accessible' : 'input-field';

  return (
    <div className="flex gap-2">
      {/* Country Code Selector */}
      <div className="w-32">
        <select
          value={countryCode}
          onChange={handleCountryCodeChange}
          className={inputClass}
          aria-label="Country code"
        >
          {COUNTRY_CODES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.flag} {country.code}
            </option>
          ))}
        </select>
      </div>

      {/* Phone Number Input */}
      <div className="flex-1 relative">
        <div className={`absolute inset-y-0 left-0 ${accessible ? 'pl-4' : 'pl-3'} flex items-center pointer-events-none`}>
          <Phone className={`${accessible ? 'w-6 h-6' : 'w-5 h-5'} text-gray-400`} />
        </div>
        <input
          type="tel"
          id={id}
          name={name}
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          required={required}
          className={`${inputClass} ${accessible ? 'pl-14' : 'pl-11'}`}
          placeholder={placeholder}
          pattern="[0-9]*"
          inputMode="numeric"
        />
      </div>
    </div>
  );
}
