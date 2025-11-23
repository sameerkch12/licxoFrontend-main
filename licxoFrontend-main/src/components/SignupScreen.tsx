import React from "react";
import { Input, Button } from "@heroui/react";

// 1. Define the props interface explicitly
interface Props {
  phone: string;
}

// 2. Type the functional component using React.FC and the Props interface
const SignupScreen: React.FC<Props> = ({ phone }) => {
  // State for the 4-digit code (optional, but good practice for input fields)
  const [code, setCode] = React.useState<string[]>(["", "", "", ""]);

  // Handle individual OTP input change
  const handleCodeChange = (index: number, value: string) => {
    // Only allow a single digit
    const digit = value.slice(-1); 
    
    setCode(prevCode => {
      const newCode = [...prevCode];
      newCode[index] = digit;
      return newCode;
    });

    // Auto-focus the next input
    if (digit && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  // The 'phone' prop is available but not used in the original JSX.
  // It would typically be displayed or used for API calls.

  return (
    <div className="bg-white p-6 shadow rounded-xl w-80">
      <h2 className="text-xl font-semibold">Tell us more about yourself</h2>
      
      {/* Displaying the phone number passed in props for context */}
      <p className="mt-2 text-sm text-gray-500">
        You are signing up with: **{phone}**
      </p>

      <Input label="Full name" variant="bordered" className="mt-4" />
      <Input label="Email address" variant="bordered" className="mt-4" type="email" />

      <p className="mt-4 text-sm">Enter the 4-digit code below</p>

      <div className="flex gap-3 mt-2">
        {code.map((value, index) => (
          <Input 
            key={index} 
            id={`otp-input-${index}`}
            maxLength={1} 
            className="w-12 h-12 text-center" 
            value={value}
            // TypeScript handles the event type correctly here
            onChange={(e) => handleCodeChange(index, e.target.value)}
            type="tel" // Use tel for mobile keyboard on touch devices
          />
        ))}
      </div>

      <Button className="w-full mt-6 bg-red-500 text-white">
        Create an account
      </Button>
    </div>
  );
};

export default SignupScreen;