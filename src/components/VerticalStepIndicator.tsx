type Props = {
  currentStep: number;
};

const VerticalStepIndicator = ({ currentStep }: Props) => {
  const steps = [
    { id: 1, label: 'Základní informace' },
    { id: 2, label: 'Vinařství' },
    { id: 3, label: 'Vzorky vín' },
  ];

  return (
    <div className="relative flex h-screen px-8 py-4 pb-8">
      {/* Background Lines Layer */}
      <div className="absolute left-[45px] top-[48px] bottom-[48px] flex flex-col z-0">
        <div className="flex-1 w-[6px] bg-gray-200" />
      </div>

      {/* Steps Layer */}
      <div className="relative flex flex-col justify-between h-full z-10 gap-16">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-4">
            {/* Circle */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep > index
                  ? 'bg-primary border-primary'
                  : currentStep === index + 1
                  ? 'bg-white border-primary'
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
            <span className="text-sm text-gray-600">
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Progress Line Layer */}
      <div className="absolute left-[45px] top-[48px] bottom-[48px] flex flex-col z-0">
        <div 
          className="w-[6px] bg-primary transition-all duration-300"
          style={{
            height: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

export default VerticalStepIndicator;