import { Button } from './ui/button';
import { Check, X } from 'lucide-react';

interface Option {
  text: string;
  isCorrect: boolean;
}

interface OptionButtonProps {
  option: Option;
  optionIndex: number;
  isSelected: boolean;
  showCorrect: boolean;
  showIncorrect: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function OptionButton({
  option,
  optionIndex,
  isSelected,
  showCorrect,
  showIncorrect,
  disabled,
  onClick,
}: OptionButtonProps) {
  const optionLabels = ['A', 'B', 'C', 'D'];

  const getButtonClasses = () => {
    const baseClasses = 'h-auto py-4 px-4 justify-start text-left';

    if (showCorrect) {
      return `${baseClasses} bg-green-100 border-green-500 text-green-900 hover:bg-green-100 border-2`;
    }

    if (showIncorrect) {
      return `${baseClasses} bg-red-100 border-red-500 text-red-900 hover:bg-red-100 border-2`;
    }

    if (isSelected && !disabled) {
      return `${baseClasses} bg-blue-100 border-blue-500 text-blue-900 hover:bg-blue-100 border-2`;
    }

    if (disabled) {
      return `${baseClasses} bg-gray-50 border-gray-300 text-gray-600 cursor-not-allowed`;
    }

    return `${baseClasses} hover:bg-blue-50 hover:border-blue-400`;
  };

  const getLabelClasses = () => {
    const baseClasses =
      'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all';

    if (showCorrect) {
      return `${baseClasses} bg-green-500 text-white`;
    }

    if (showIncorrect) {
      return `${baseClasses} bg-red-500 text-white`;
    }

    if (isSelected && !disabled) {
      return `${baseClasses} bg-blue-500 text-white`;
    }

    if (disabled) {
      return `${baseClasses} bg-gray-300 text-gray-600`;
    }

    return `${baseClasses} bg-gray-200 text-gray-700 group-hover:bg-blue-500 group-hover:text-white`;
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant="outline"
      className={`w-full group ${getButtonClasses()}`}
    >
      <div className="flex items-center gap-4 w-full">
        <div className={getLabelClasses()}>
          {optionLabels[optionIndex]}
        </div>
        <span className="flex-1">{option.text}</span>
        {showCorrect && (
          <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
        )}
        {showIncorrect && (
          <X className="w-6 h-6 text-red-600 flex-shrink-0" />
        )}
      </div>
    </Button>
  );
}