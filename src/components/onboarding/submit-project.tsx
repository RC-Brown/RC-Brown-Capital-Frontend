import React from "react";
import { Button } from "@/src/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FormFieldValue } from "@/src/types/onboarding";

interface SubmitProjectProps {
  value?: FormFieldValue;
  onChange?: (value: FormFieldValue) => void;
}

const SubmitProject: React.FC<SubmitProjectProps> = () =>
  // { value, onChange }
  {
    const handleSubmitProject = () => {
      // Submit project logic
    };

    return (
      <div className='mb-6 w-full'>
        <div className='flex justify-end'>
          <Button
            type='button'
            onClick={handleSubmitProject}
            className='flex items-center space-x-2 rounded-md bg-blue-900 px-8 py-3 text-lg font-medium text-white hover:bg-blue-800'
          >
            <span>Submit project</span>
            <ArrowRight className='h-5 w-5' />
          </Button>
        </div>
      </div>
    );
  };

export default SubmitProject;
