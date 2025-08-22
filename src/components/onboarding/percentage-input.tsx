"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/src/components/ui/input";

interface PercentageInputProps {
  value?: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  required?: boolean;
}

export const PercentageInput: React.FC<PercentageInputProps> = ({
  value,
  onChange,
  placeholder,
  // error,
  className,
  required,
}) => {
  const [displayValue, setDisplayValue] = useState("");
  const [showMaxError, setShowMaxError] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Parse initial value and format it
  useEffect(() => {
    if (value) {
      const stringValue = typeof value === "number" ? value.toString() : value;
      // Remove any existing % symbols and format
      const cleanValue = stringValue.replace(/[%]/g, "").trim();
      if (cleanValue) {
        const formattedValue = formatPercentageValue(cleanValue);
        setDisplayValue(formattedValue);

        // Check if we should show warning for the new value
        const numericValue = parseFloat(cleanValue);
        if (!isNaN(numericValue) && numericValue >= 90 && numericValue <= 100) {
          setShowWarning(true);
        } else {
          setShowWarning(false);
        }
      } else {
        setDisplayValue("");
        setShowWarning(false);
      }
    } else {
      setDisplayValue("");
      setShowWarning(false);
    }

    // Clear error state when value changes
    setShowMaxError(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const formatPercentageValue = (input: string): string => {
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

      return `${formattedValue}%`;
    }

    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cursorPosition = e.target.selectionStart;

    // Allow complete deletion - if input is empty or just "%", clear everything
    if (inputValue === "" || inputValue === "%") {
      setDisplayValue("");
      onChange("");
      return;
    }

    // Extract the numeric part (everything before the % symbol)
    const numericPart = inputValue.endsWith("%") ? inputValue.slice(0, -1) : inputValue;

    // Check if the numeric value exceeds 100%
    const cleanNumericValue = numericPart.replace(/[^0-9.]/g, "");
    const numericValue = parseFloat(cleanNumericValue);

    if (!isNaN(numericValue) && numericValue > 100) {
      // Don't allow values over 100%
      setShowMaxError(true);
      setShowWarning(false);
      setTimeout(() => setShowMaxError(false), 3000);
      return;
    }

    // Show warning when approaching 100%
    if (!isNaN(numericValue) && numericValue >= 90 && numericValue <= 100) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }

    // Clear error message when input is valid
    setShowMaxError(false);

    // Format the value
    const formattedValue = formatPercentageValue(numericPart);
    setDisplayValue(formattedValue);

    // Extract clean numeric value for the onChange callback (without % symbol and commas)
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
    const input = e.target;
    const valueLength = input.value.length;

    // Clear any existing error or warning states
    setShowMaxError(false);
    setShowWarning(false);

    // If the input is empty or doesn't end with the percentage symbol, add it
    if (valueLength === 0 || !input.value.endsWith("%")) {
      setDisplayValue("%");
      // Set cursor position before the symbol
      setTimeout(() => {
        input.setSelectionRange(0, 0);
      }, 0);
      return;
    }

    // Only set cursor at the end if there's no existing selection
    if (valueLength > 1 && input.selectionStart === input.selectionEnd) {
      input.setSelectionRange(valueLength - 1, valueLength - 1);
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
        placeholder={placeholder || "%"}
        className={className}
        required={required}
      />
      {showMaxError && <div className='mt-1 text-xs text-red-500'>Percentage cannot exceed 100%</div>}
      {showWarning && !showMaxError && <div className='mt-1 text-xs text-amber-600'>Approaching maximum (100%)</div>}
    </div>
  );
};
