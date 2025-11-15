import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { QuizCard } from './components/QuizCard';
import { ResultsPanel } from './components/ResultsPanel';
import { mockQuizData } from './data/mockQuizData';
import { Card } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';
import { useAppSelector } from './store/hooks';

interface Option {
  text: string;
  isCorrect: boolean;
}

interface Question {
  question: string;
  options: Option[];
}

interface QuizData {
  subject: string[];
  quiqe: Question[];
}

interface UserAnswer {
  questionIndex: number;
  selectedOptionIndex: number;
  isCorrect: boolean;
  subject: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<'upload' | 'loading' | 'quiz' | 'results'>('upload');
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const quiz = useAppSelector((state) => state.quiz.quizData);


  const handleUseDummyData = () => {
    if(quiz){
      setQuizData(quiz);
      setCurrentView('quiz');
      setUserAnswers([]);
      setCurrentQuestionIndex(0);
    }
  };

  const handleFileUpload = async (file: File) => {
    setCurrentView('loading');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze file');
      }

      const data: QuizData = await response.json();
      setQuizData(data);
      setCurrentView('quiz');
      setUserAnswers([]);
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error('Error analyzing file:', error);
      alert('Failed to analyze file. Please try again.');
      setCurrentView('upload');
    }
  };

  const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
    if (!quizData) return;

    const question = quizData.quiqe[questionIndex];
    const isCorrect = question.options[optionIndex].isCorrect;
    
    // Determine which subject this question belongs to
    // For simplicity, we'll distribute questions across subjects evenly
    const subjectIndex = Math.floor((questionIndex / quizData.quiqe.length) * quizData.subject.length);
    const subject = quizData.subject[subjectIndex] || quizData.subject[0];

    const answer: UserAnswer = {
      questionIndex,
      selectedOptionIndex: optionIndex,
      isCorrect,
      subject,
    };

    setUserAnswers((prev) => {
      // Remove any existing answer for this question
      const filtered = prev.filter((a) => a.questionIndex !== questionIndex);
      return [...filtered, answer];
    });
  };

  const handleNextQuestion = () => {
    if (!quizData) return;

    if (currentQuestionIndex < quizData.quiqe.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleFinishQuiz = () => {
    setCurrentView('results');
  };

  const handleRetakeQuiz = () => {
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setCurrentView('quiz');
  };

  const handleNewQuiz = () => {
    setQuizData(null);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setCurrentView('upload');
  };

  const getUserAnswerForQuestion = (questionIndex: number) => {
    return userAnswers.find((a) => a.questionIndex === questionIndex);
  };

  const calculateStats = () => {
    const totalQuestions = quizData?.quiqe.length || 0;
    const answeredQuestions = userAnswers.length;
    const correctCount = userAnswers.filter((a) => a.isCorrect).length;
    const wrongCount = userAnswers.filter((a) => !a.isCorrect).length;

    // Calculate strong and weak topics
    const topicPerformance: { [key: string]: { correct: number; wrong: number } } = {};

    userAnswers.forEach((answer) => {
      if (!topicPerformance[answer.subject]) {
        topicPerformance[answer.subject] = { correct: 0, wrong: 0 };
      }
      if (answer.isCorrect) {
        topicPerformance[answer.subject].correct++;
      } else {
        topicPerformance[answer.subject].wrong++;
      }
    });

    const strongTopics: string[] = [];
    const weakTopics: string[] = [];

    Object.entries(topicPerformance).forEach(([topic, stats]) => {
      if (stats.wrong > 0) {
        weakTopics.push(topic);
      }
      if (stats.correct > stats.wrong) {
        strongTopics.push(topic);
      }
    });

    return {
      totalQuestions,
      answeredQuestions,
      correctCount,
      wrongCount,
      strongTopics,
      weakTopics,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-blue-600 mb-2">Quiz Evaluation System</h1>
          {quizData && currentView !== 'upload' && (
            <div className="flex gap-2 justify-center flex-wrap">
              {quizData.subject.map((subject, idx) => (
                <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                  {subject}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Upload View */}
        {currentView === 'upload' && (
          <div className="space-y-4">
            <FileUpload onFileUpload={handleFileUpload} />
            
            {/* Dummy Data Button */}
            <div className="text-center">
              <div className="relative py-4">
                <Separator />
                <div className="absolute inset-0 flex items-center">
                  <span className="mx-auto px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-500 text-sm">
                    Or try with sample data
                  </span>
                </div>
              </div>
              <Button
                onClick={handleUseDummyData}
                variant="secondary"
                size="lg"
                className="bg-purple-600 text-white hover:bg-purple-700 shadow-lg"
              >
                Load Sample Quiz
              </Button>
            </div>
          </div>
        )}

        {/* Loading View */}
        {currentView === 'loading' && (
          <Card className="p-12 text-center">
            <div className="inline-block w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <h2 className="text-gray-700 mb-2">Analyzing Your Document</h2>
            <p className="text-gray-500">Please wait while we generate your quiz...</p>
          </Card>
        )}

        {/* Quiz View */}
        {currentView === 'quiz' && quizData && (
          <div className="space-y-6">
            <QuizCard
              question={quizData.quiqe[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={quizData.quiqe.length}
              userAnswer={getUserAnswerForQuestion(currentQuestionIndex)}
              onOptionSelect={(optionIndex) =>
                handleOptionSelect(currentQuestionIndex, optionIndex)
              }
            />

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center gap-4">
              <Button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                size="lg"
              >
                Previous
              </Button>

              <div className="text-gray-600 text-center">
                Question {currentQuestionIndex + 1} of {quizData.quiqe.length}
                <div className="text-sm text-gray-500">
                  {userAnswers.length} answered
                </div>
              </div>

              {currentQuestionIndex < quizData.quiqe.length - 1 ? (
                <Button
                  onClick={handleNextQuestion}
                  size="lg"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleFinishQuiz}
                  disabled={userAnswers.length === 0}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Finish Quiz
                </Button>
              )}
            </div>

            {/* Question Overview */}
            <Card className="p-6">
              <h3 className="text-gray-700 mb-4">Question Overview</h3>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {quizData.quiqe.map((_, idx) => {
                  const answer = getUserAnswerForQuestion(idx);
                  const isCurrent = idx === currentQuestionIndex;
                  
                  return (
                    <Button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      variant="outline"
                      size="sm"
                      className={`w-10 h-10 p-0 transition-all ${
                        isCurrent
                          ? 'border-blue-600 bg-blue-100 scale-110'
                          : answer
                          ? answer.isCorrect
                            ? 'border-green-500 bg-green-100 hover:bg-green-200'
                            : 'border-red-500 bg-red-100 hover:bg-red-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {idx + 1}
                    </Button>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* Results View */}
        {currentView === 'results' && quizData && (
          <ResultsPanel
            stats={calculateStats()}
            onRetakeQuiz={handleRetakeQuiz}
            onNewQuiz={handleNewQuiz}
          />
        )}
      </div>
    </div>
  );
}