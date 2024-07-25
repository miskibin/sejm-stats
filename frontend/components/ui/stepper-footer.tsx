import { Button } from "@/components/ui/button";
import { useStepper } from "@/components/ui/stepper";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCcw,
  CheckCircle,
  SkipForward,
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
  } = useStepper();

  return (
    <div className="mt-8">
      {hasCompletedAllSteps ? (
        <div className="mb-6 p-6 bg-green-100 border border-green-300 text-green-700 rounded-lg flex items-center justify-center">
          <CheckCircle className="w-6 h-6 mr-2" />
          <h2 className="text-xl font-semibold">
            Hurra! Wszystkie kroki ukończone! 🎉
          </h2>
        </div>
      ) : null}
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
                  Pokaż wszystkie
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
