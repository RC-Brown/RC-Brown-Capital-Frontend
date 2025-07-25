"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/src/components/ui/input";
import { useCurrencySafe } from "@/src/lib/context/currency-context";

interface CurrencyInputProps {
  value?: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  required?: boolean;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  placeholder,
  error,
  className,
  required,
}) => {
  const { currencySymbol } = useCurrencySafe();
  const [displayValue, setDisplayValue] = useState("");

  const formatCurrencyValue = (input: string): string => {
    // Remove all non-numeric characters except decimal points
    const numericValue = input.replace(/[^0-9.]/g, "");

    // Prevent multiple decimal points
    const parts = numericValue.split(".");
    if (parts.length > 2) {
      return displayValue; // Don't update if invalid
    }

    // Format the whole number part with commas
    if (parts.length > 0) {
      const wholeNumber = parts[0];
      const formattedWholeNumber = wholeNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      // Reconstruct the number with decimal part if it exists
      const formattedValue = parts.length > 1 ? `${formattedWholeNumber}.${parts[1]}` : formattedWholeNumber;

      return `${currencySymbol}${formattedValue}`;
    }

    return currencySymbol;
  };

  // Parse initial value and format it
  useEffect(() => {
    if (value) {
      const stringValue = typeof value === "number" ? value.toString() : value;
      // Remove any existing currency symbols and format
      const cleanValue = stringValue.replace(/[\$₦€£]/g, "").trim();
      if (cleanValue) {
        const formattedValue = formatCurrencyValue(cleanValue);
        setDisplayValue(formattedValue);
      } else {
        setDisplayValue("");
      }
    } else {
      setDisplayValue("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, currencySymbol]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cursorPosition = e.target.selectionStart;

    // If user tries to delete the currency symbol, prevent it
    if (inputValue.length < currencySymbol.length) {
      return;
    }

    // Extract the numeric part (everything after the currency symbol)
    const numericPart = inputValue.substring(currencySymbol.length);

    // Format the value
    const formattedValue = formatCurrencyValue(numericPart);
    setDisplayValue(formattedValue);

    // Extract clean numeric value for the onChange callback (without currency symbol and commas)
    const cleanNumericValue = numericPart.replace(/[^0-9.]/g, "");
    onChange(cleanNumericValue);

    // Restore cursor position after formatting
    setTimeout(() => {
      const input = e.target;
      const newPosition = Math.min(cursorPosition || 0, formattedValue.length);
      input.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, and navigation keys
    if ([8, 9, 27, 13, 46, 37, 38, 39, 40].includes(e.keyCode)) {
      return;
    }

    // Allow decimal point
    if (e.key === ".") {
      return;
    }

    // Allow only numbers
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Don't auto-select text, let user control cursor position
    const input = e.target;
    const symbolLength = currencySymbol.length;
    const valueLength = input.value.length;
    // Only set cursor at the end if there's no existing selection
    if (valueLength > symbolLength && input.selectionStart === input.selectionEnd) {
      input.setSelectionRange(valueLength, valueLength);
    }
  };

  return (
    <div className='relative'>
      <Input
        type='text'
        value={displayValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        placeholder={placeholder || currencySymbol}
        className={className}
        required={required}
      />
      {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
    </div>
  );
};
