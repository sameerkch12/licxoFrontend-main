import React from "react";
import { Input, Button } from "@heroui/react";

interface Props {
  phone: string;
}

const OtpScreen: React.FC<Props> = ({ phone }) => {
  return (
    <div className="bg-white p-6 shadow rounded-xl w-80">
      <h2 className="text-xl font-semibold">Enter verification code</h2>

      <p className="text-sm text-gray-500 mb-4">
        A 4-digit code was sent to your mobile <br /> +91 {phone}
      </p>

      <div className="flex gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Input key={i} maxLength={1} className="w-12 h-12 text-center" />
        ))}
      </div>

      <Button className="w-full mt-6 bg-red-500 text-white">
        Login
      </Button>
    </div>
  );
};

export default OtpScreen;
