"use client";

import { useState, useEffect } from "react";
import { Terminal } from "lucide-react";

const phrases = [
  "Connecting to target network...",
  "Bypassing firewalls...",
  "Authenticating user credentials...",
  "Accessing database...",
  "Fetching account data...",
  "Decrypting files...",
  "Connection successful.",
];

export default function TypingEffect() {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (index >= phrases.length) {
      // Don't reset, just stay on the last message or an empty one
      setCurrentText("Ready for command.");
      return;
    }
    
    if (subIndex === phrases[index].length + 1 && !isDeleting) {
      setIsDeleting(true);
      setTimeout(() => {}, 2000); // Pause before deleting
      return;
    }

    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1));
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
      setCurrentText(phrases[index].substring(0, subIndex));
    }, isDeleting ? 30 : 50);

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting]);

  return (
    <div className="font-mono text-sm text-primary flex items-center gap-2">
      <Terminal className="h-4 w-4" />
      <span>{currentText}</span>
      <span className="animate-ping">_</span>
    </div>
  );
}
