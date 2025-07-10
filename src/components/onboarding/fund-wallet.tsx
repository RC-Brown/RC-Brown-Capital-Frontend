import React from "react";
import { Button } from "@/src/components/ui/button";
import { ArrowRight } from "lucide-react";

interface WalletFundingData {
  funded?: boolean;
  amount?: number;
  transactionId?: string;
  status?: "pending" | "completed" | "failed";
  timestamp?: Date;
}

interface FundWalletProps {
  value?: WalletFundingData;
  onChange?: (value: WalletFundingData) => void;
}

const FundWallet: React.FC<FundWalletProps> = () =>
  // { value, onChange }
  {
    const handleFundWallet = () => {
      // Fund wallet logic
    };

    return (
      <div className='mb-6 w-full'>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <h3 className='mb-4 text-lg font-semibold text-gray-900'>Fund Wallet</h3>

          <p className='mb-6 text-sm leading-relaxed text-gray-600'>
            To proceed with submission, please note that a ₦1,000,000 non-refundable fee is required. This covers your
            profile due diligence and onboarding checks.
          </p>

          <Button
            type='button'
            onClick={handleFundWallet}
            className='flex items-center space-x-2 rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700'
          >
            <span>FUND WALLET</span>
            <ArrowRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    );
  };

export default FundWallet;
