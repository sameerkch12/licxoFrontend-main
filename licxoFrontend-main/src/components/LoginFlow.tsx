// LoginFlow.tsx — relevant parts
import React, { useState } from "react";
import PhoneScreen from "./PhoneScreen";
import OtpScreen from "./OtpScreen";
import SignupScreen from "./SignupScreen";
import DefaultLayout from "@/layouts/default";

const LoginFlow: React.FC = () => {
  const [screen, setScreen] = useState<"phone" | "otp" | "signup">("phone");
  const [phone, setPhone] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // <- add this

  const handleContinue = async () => {
    const onlyDigits = phone.replace(/\D/g, "");
    if (onlyDigits.length !== 10) return;

    setLoading(true);
    try {
      // example API call (or mock)
      const res = await fetch("/api/check-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+91${onlyDigits}` }),
      });
      const data = await res.json(); // { exists: boolean }

      if (data.exists) setScreen("otp");
      else setScreen("signup");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div>
        {screen === "phone" && (
          <PhoneScreen
            phone={phone}
            setPhone={setPhone}
            onContinue={handleContinue}
            loading={loading}   // <- pass loading here
          />
        )}

        {screen === "otp" && <OtpScreen phone={phone} />}

        {screen === "signup" && <SignupScreen phone={phone} />}
      </div>
    </DefaultLayout>
  );
};

export default LoginFlow;
