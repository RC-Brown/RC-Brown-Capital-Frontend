import { useState, useEffect } from "react";

export const useTimeBasedGreeting = () => {
  const [greeting, setGreeting] = useState<string>("");

  const updateGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      setGreeting("Good Morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good Afternoon");
    } else if (hour >= 17 && hour < 21) {
      setGreeting("Good Evening");
    } else {
      setGreeting("Good Night");
    }
  };

  useEffect(() => {
    updateGreeting();
    // Update greeting every minute
    const interval = setInterval(updateGreeting, 60000);

    return () => clearInterval(interval);
  }, []);

  return greeting;
};
