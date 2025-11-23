import React from "react";
import { Input, Button } from "@heroui/react";

interface Props {
  phone: string;
}

const SignupScreen: React.FC<Props> = ({ phone }) => {
  return (
    <div className="bg-white p-6 shadow rounded-xl w-80">
      <h2 className="text-xl font-semibold">Tell us more about yourself</h2>

      <Input label="Full name" variant="bordered" className="mt-4" />
      <Input label="Email address" variant="bordered" className="mt-4" />

      <p className="mt-4 text-sm">Enter the 4-digit code below</p>

      <div className="flex gap-3 mt-2">
        {[1, 2, 3, 4].map((i) => (
          <Input key={i} maxLength={1} className="w-12 h-12 text-center" />
        ))}
      </div>

      <Button className="w-full mt-6 bg-red-500 text-white">
        Create an account
      </Button>
    </div>
  );
};

export default SignupScreen;
