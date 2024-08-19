import React from 'react';
import { Button } from "@/components/ui/button";
import { useStepper } from "@/components/ui/stepper";
import {
  ArrowLeft,
  ArrowRight,
  ListChecks,
} from "lucide-react";

const Footer = () => {
  const {
    nextStep,
    prevStep,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    setStep,
    steps,
  } = useStepper();

  const goToSummary = () => {
    setStep(steps.length - 1); // Assuming the last step is the summary
  };

  return (
    <div className="mt-8">
      <div className="w-full flex justify-between items-center">
        <div>
          {!hasCompletedAllSteps && (
            <Button
              variant="ghost"
              size="sm"
              onClick={prevStep}
              disabled={isDisabledStep}
              className="mr-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Wstecz</span>
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          {!isLastStep && !hasCompletedAllSteps && (
            <Button variant="ghost" size="sm" onClick={goToSummary}>
              <ListChecks className="w-4 h-4" />
              <span className=" ml-2">Pomiń wszystkie</span>
            </Button>
          )}
          {!hasCompletedAllSteps && (
            <Button size="sm" onClick={nextStep}>
              <span className="hidden sm:inline mr-2">Dalej</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
export default Footer;