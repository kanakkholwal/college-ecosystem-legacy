import { useEffect, useState, useRef } from "react";

export const useExternalBarcodeScanner = () => {
  const [scanHistory, setScanHistory] = useState<string[]>([]);
  const [currentCode, setCurrentCode] = useState<string>("");
  const buffer = useRef<string>(""); // Buffer to store the scanned code

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Most barcode scanners simulate keyboard input
      if (event.key === "Enter") {
        const trimmedCode = buffer.current.trim();
        if (trimmedCode) {
          setScanHistory((prev) => [...prev, trimmedCode]);
          setCurrentCode(trimmedCode);
          buffer.current = ""; // Clear the buffer after processing
        }
      } else {
        buffer.current += event.key; // Accumulate keys in the buffer
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keypress", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keypress", handleKeyDown);
    };
  }, []);

  const clearHistory = () => {
    setScanHistory([]);
    setCurrentCode("");
  };

  return {
    currentCode,
    scanHistory,
    clearHistory,
  };
};
