
import { ReactNode } from 'react';
import PrimaryButton from './PrimaryButton';

type ThemeType = 'info' | 'warning' | 'error' | 'success';

interface ThemeConfig {
  bgColor: string;
  iconColor: string;
  iconBg: string;
  buttonColor: string;
}

interface ActionConfig {
  label: string;
  onClick: () => void;
}

const themes: Record<ThemeType, ThemeConfig> = {
  info: {
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
  },
  warning: {
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
    iconBg: 'bg-yellow-100',
    buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
  },
  error: {
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600',
    iconBg: 'bg-red-100',
    buttonColor: 'bg-red-600 hover:bg-red-700',
  },
  success: {
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    iconBg: 'bg-green-100',
    buttonColor: 'bg-green-600 hover:bg-green-700',
  },
};

interface InfoLandingProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  primaryAction?: ActionConfig;
  secondaryAction?: ActionConfig;
  theme?: ThemeType;
  className?: string;
  fullScreen?: boolean;
  useSmaller?: boolean;
}

export const InfoLanding: React.FC<InfoLandingProps> = ({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  theme = 'info',
  className = '',
  fullScreen = false,
  useSmaller = false,
}) => {
  const currentTheme = themes[theme];

  return (
    <div 
      className={`
        ${fullScreen ? 'min-h-screen' : useSmaller ? 'min-h-[200px]' : 'min-h-[400px]'}
        ${currentTheme.bgColor}
        flex items-center justify-center p-6
        ${className}
        rounded-lg
      `}
    >
      <div className="text-center max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className={`rounded-full ${currentTheme.iconBg} p-3`}>
            {icon && <div className={`w-20 h-20 ${currentTheme.iconColor}`}>
              {icon}
            </div>}
          </div>
        </div>
        
        <h2 className={`${useSmaller ? "text-xl" : "text-3xl"} font-bold text-gray-900 mb-4`}>
          {title}
        </h2>
        
        {description &&
          <p className="text-lg text-gray-600 mb-8">
            {description}
          </p>
        }

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryAction && (
            <PrimaryButton
              onClick={primaryAction.onClick}
              className={`
                ${currentTheme.buttonColor}
                text-white px-6 py-2 rounded-lg
                font-medium transition-colors
              `}
            >
              {primaryAction.label}
            </PrimaryButton>
          )}
          
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg
                font-medium hover:bg-gray-200 transition-colors"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};