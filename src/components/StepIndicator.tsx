type Props = {
  currentStep: number;
};

const StepIndicator = ({ currentStep }: Props) => {
  const steps = [
    { id: 1, label: 'Základní informace' },
    { id: 2, label: 'Vinařství' },
    { id: 3, label: 'Vzorky vín' },
  ];

  return (
    <div className="relative flex items-center justify-between w-full max-w-lg mx-auto">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center w-full">
          
          {/* Circle */}
          <div className="relative flex flex-col items-center justify-center z-20">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep > index ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <span className="text-white">{index + 1}</span>
            </div>
            <span className="mt-2 text-sm text-center">{step.label}</span>
          </div>
  
          {/* Line */}
          {index < steps.length - 1 && (
            <div className="flex-grow flex items-center">
              <div className="w-full h-1 bg-gray-300 relative mx-2">
                <div
                  className={`absolute top-0 left-0 h-full ${
                    currentStep > index + 1 ? 'bg-primary' : 'bg-secondary'
                  } transition-all duration-300 ease-in-out`}
                  style={{ width: currentStep > index + 1 ? '100%' : '0%' }}
                ></div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};


export default StepIndicator;
