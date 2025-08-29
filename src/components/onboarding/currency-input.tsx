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
  disabled?: boolean;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  placeholder,
  error,
  className,
  required,
  disabled,
}) => {
  const { currencySymbol } = useCurrencySafe();
  const [displayValue, setDisplayValue] = useState("");
  const [validationError, setValidationError] = useState<string>("");

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

  const validateInput = (inputValue: string): string => {
    // Check if only currency symbol remains
    if (inputValue === currencySymbol) {
      return "Please enter a valid amount";
    }

    // Check if input is empty
    if (!inputValue || inputValue.length === 0) {
      return "Amount is required";
    }

    return "";
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
        setValidationError("");
      } else {
        setDisplayValue("");
        setValidationError("");
      }
    } else {
      setDisplayValue("");
      setValidationError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, currencySymbol]);

  const handleBeforeInput = (e: React.FormEvent<HTMLInputElement> & { nativeEvent: InputEvent }) => {
    const target = e.target as HTMLInputElement;
    const currentValue = target.value;
    const selectionStart = target.selectionStart || 0;
    const selectionEnd = target.selectionEnd || 0;

    // If this is a deletion operation
    if (e.nativeEvent.inputType === "deleteContentBackward" || e.nativeEvent.inputType === "deleteContentForward") {
      // Calculate what the value would be after deletion
      const beforeSelection = currentValue.substring(0, selectionStart);
      const afterSelection = currentValue.substring(selectionEnd);
      const wouldBeValue = beforeSelection + afterSelection;

      // If deletion would remove the currency symbol, prevent it
      if (wouldBeValue.length < currencySymbol.length || !wouldBeValue.startsWith(currencySymbol)) {
        e.preventDefault();
        return;
      }

      // If deletion would leave only the currency symbol, prevent it
      if (wouldBeValue === currencySymbol) {
        e.preventDefault();
        return;
      }
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cursorPosition = e.target.selectionStart;

    // If user tries to delete the currency symbol, prevent it
    if (inputValue.length < currencySymbol.length) {
      return;
    }

    // Check if the input still starts with the currency symbol
    if (!inputValue.startsWith(currencySymbol)) {
      // If the symbol was deleted, restore it and add any remaining numeric content
      const numericPart = inputValue.replace(/[^0-9.]/g, "");
      const formattedValue = formatCurrencyValue(numericPart);
      setDisplayValue(formattedValue);

      // Validate the input
      const error = validateInput(formattedValue);
      setValidationError(error);

      // Extract clean numeric value for the onChange callback
      onChange(numericPart);

      // Set cursor position after the restored symbol
      setTimeout(() => {
        const input = e.target;
        const newPosition = Math.min(currencySymbol.length + (cursorPosition || 0), formattedValue.length);
        input.setSelectionRange(newPosition, newPosition);
      }, 0);
      return;
    }

    // Extract the numeric part (everything after the currency symbol)
    const numericPart = inputValue.substring(currencySymbol.length);

    // Format the value
    const formattedValue = formatCurrencyValue(numericPart);
    setDisplayValue(formattedValue);

    // Validate the input
    const error = validateInput(formattedValue);
    setValidationError(error);

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
    const input = e.target;
    const symbolLength = currencySymbol.length;
    const valueLength = input.value.length;

    // If the input is empty or doesn't start with the currency symbol, add it
    if (valueLength === 0 || !input.value.startsWith(currencySymbol)) {
      setDisplayValue(currencySymbol);
      // Set cursor position after the symbol
      setTimeout(() => {
        input.setSelectionRange(symbolLength, symbolLength);
      }, 0);
      return;
    }

    // Only set cursor at the end if there's no existing selection
    if (valueLength > symbolLength && input.selectionStart === input.selectionEnd) {
      input.setSelectionRange(valueLength, valueLength);
    }
  };

  const handleBlur = () => {
    // Validate on blur to catch edge cases
    const error = validateInput(displayValue);
    setValidationError(error);
  };

  // Determine which error to show (prop error takes precedence)
  const finalError = error || validationError;

  return (
    <div className='relative'>
      <Input
        type='text'
        value={displayValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onBeforeInput={handleBeforeInput}
        placeholder={placeholder || currencySymbol}
        className={`h-[51px] ${className} ${finalError ? "border-red-500 focus:border-red-500" : ""}`}
        required={required}
        disabled={disabled}
      />
      {finalError && <p className='mt-1 text-sm text-red-500'>{finalError}</p>}
    </div>
  );
};
