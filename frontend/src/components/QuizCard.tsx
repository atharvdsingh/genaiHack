import { OptionButton } from './OptionButton';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Option {
  text: string;
  isCorrect: boolean;
}

interface Question {
  question: string;
  options: Option[];
}

interface UserAnswer {
  questionIndex: number;
  selectedOptionIndex: number;
  isCorrect: boolean;
  subject: string;
}

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  userAnswer?: UserAnswer;
  onOptionSelect: (optionIndex: number) => void;
}

export function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  userAnswer,
  onOptionSelect,
}: QuizCardProps) {
  const hasAnswered = userAnswer !== undefined;

  return (
    <Card>
      <CardHeader>
        {/* Question Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary" className="px-4 py-2 bg-blue-100 text-blue-700">
              Question {questionNumber} of {totalQuestions}
            </Badge>
            {hasAnswered && (
              <Badge
                variant={userAnswer.isCorrect ? "default" : "destructive"}
                className={`px-4 py-2 ${
                  userAnswer.isCorrect
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                {userAnswer.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Correct
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-1" />
                    Incorrect
                  </>
                )}
              </Badge>
            )}
          </div>
          <h2 className="text-gray-800">{question.question}</h2>
        </div>
      </CardHeader>

      <CardContent>
        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => {
            const isSelected = userAnswer?.selectedOptionIndex === index;
            const showCorrect = hasAnswered && option.isCorrect;
            const showIncorrect = hasAnswered && isSelected && !option.isCorrect;

            return (
              <OptionButton
                key={index}
                option={option}
                optionIndex={index}
                isSelected={isSelected}
                showCorrect={showCorrect}
                showIncorrect={showIncorrect}
                disabled={hasAnswered}
                onClick={() => onOptionSelect(index)}
              />
            );
          })}
        </div>

        {/* Feedback */}
        {hasAnswered && (
          <Alert
            className={
              userAnswer.isCorrect
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }
          >
            <AlertDescription
              className={
                userAnswer.isCorrect ? 'text-green-800' : 'text-red-800'
              }
            >
              {userAnswer.isCorrect
                ? 'Great job! You selected the correct answer.'
                : 'Not quite right. The correct answer is highlighted in green.'}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}