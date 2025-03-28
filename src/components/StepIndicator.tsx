type Props = {
  currentStep: number;
  showMapCreation: boolean;
};

const StepIndicator = ({ currentStep, showMapCreation }: Props) => {
  const steps = [
    { id: 1, label: 'Základní informace' },
    { id: 2, label: 'Vinařství' },
    { id: 3, label: 'Vzorky vín' }
  ];

  if (showMapCreation) {
    steps.push({ id: 4, label: 'Mapa' });
  }

  return (
    <div className="relative flex flex-col w-full max-w-xl mx-auto px-8">
      {/* Background Lines Layer */}
      <div className="absolute top-3.5 left-[90px] right-[52px] flex items-center z-0">
        <div className="flex-1 h-[6px] bg-gray-200" />
      </div>

      {/* Steps Layer */}
      <div className="relative flex items-center justify-between w-full z-10">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            {/* Circle */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-3 ${
                currentStep > index + 1
                  ? 'bg-primary border-primary'
                  : currentStep === index + 1
                  ? 'bg-primary border-secondary'
                  : 'bg-white border-gray-300'
              }`}
            >
              <span 
                className={`text-sm font-semibold ${
                  currentStep > index
                    ? 'text-white'
                    : currentStep === index + 1
                    ? 'text-primary'
                    : 'text-gray-300'
                }`}
              >
                {step.id}
              </span>
            </div>
            {/* Label */}
            <span className="mt-2 text-sm text-center text-gray-600">
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Progress Line Layer */}
      <div className="absolute top-3.5 left-[90px] right-[52px] flex items-center z-0">
        <div 
          className="h-[6px] bg-primary transition-all duration-300"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

export default StepIndicator;