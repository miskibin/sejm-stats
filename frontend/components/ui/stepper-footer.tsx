import { Button } from "@/components/ui/button";
import { useStepper } from "@/components/ui/stepper";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCcw,
  CheckCircle,
  SkipForward,
  ListChecks,
} from "lucide-react";

const Footer = () => {
  const {
    nextStep,
    prevStep,
    resetSteps,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
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
              variant="outline"
              size="sm"
              onClick={prevStep}
              disabled={isDisabledStep}
              className="mr-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Wstecz
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          {!isLastStep && !hasCompletedAllSteps && (
            <Button variant="secondary" size="sm" onClick={goToSummary}>
              <ListChecks className="w-4 h-4 mr-2" />
              Przejdź do podsumowania
            </Button>
          )}
          {hasCompletedAllSteps ? (
            <Button variant="outline" size="sm" onClick={resetSteps}>
              <RefreshCcw className="w-4 h-4 mr-2" />
              Resetuj
            </Button>
          ) : (
            <>
              {isOptionalStep && (
                <Button variant="secondary" size="sm" onClick={nextStep}>
                  <SkipForward className="w-4 h-4 mr-2" />
                  Pomiń
                </Button>
              )}
              <Button size="sm" onClick={nextStep}>
                {isLastStep ? (
                  <>
                    Zakończ
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Dalej
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Footer;