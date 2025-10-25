import { useState } from "react";

export function useForms(steps: any[]) {
    const [currentStep, setCurrentStep] = useState<number>(0)

    function changeStep(i: number) {
        //if (e) e.preventDefault();


        //console.log("Entrou Aqui", i, " Last", steps.length)

        if (i < 0 || i >= steps.length + 1) return

        if (i == steps.length) {
            //console.log("É Igual ")
            setCurrentStep(0)
            //console.log(currentStep)
        } else {
            setCurrentStep(i)

        }
    }


    return {
        currentStep,
        currentComponent: steps[currentStep],
        changeStep,
        isLastStep: currentStep + 1 === steps.length ? true : false,
        isFirstStep: currentStep === 0 ? true : false

    }
}