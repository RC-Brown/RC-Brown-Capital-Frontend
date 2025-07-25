import React from "react";
import { Button } from "@/src/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useCurrencySafe } from "@/src/lib/context/currency-context";

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
    const { formatCurrency } = useCurrencySafe();

    const handleFundWallet = () => {
      // Fund wallet logic
    };

    return (
      <div className='mb-6 w-full'>
        <div className='rounded-lg border border-b-4 border-text-muted/20 bg-white p-6'>
          <h3 className='mb-4 text-base font-medium text-text-muted'>Fund Wallet</h3>

          <p className='mb-10 text-base leading-normal text-text-muted'>
            To proceed with submission, please note that a {formatCurrency("1,000,000")} non-refundable fee is required.
            This covers your profile due diligence and onboarding checks.
          </p>

          <Button
            type='button'
            onClick={handleFundWallet}
            className='flex items-center space-x-2 rounded-[10px] border border-[#55A2F0] bg-[#407BFF]/5 px-3 py-2 text-base font-semibold text-[#407BFF] hover:bg-[#407BFF]/5'
          >
            <span>FUND WALLET</span>
            <ArrowRight className='h-4 w-4 -rotate-[20deg] stroke-[2.6px] text-[#407BFF]' />
          </Button>
        </div>
      </div>
    );
  };

export default FundWallet;
