import { Trophy, Target, TrendingUp, TrendingDown, RotateCcw, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';

interface Stats {
  totalQuestions: number;
  answeredQuestions: number;
  correctCount: number;
  wrongCount: number;
  strongTopics: string[];
  weakTopics: string[];
}

interface ResultsPanelProps {
  stats: Stats;
  onRetakeQuiz: () => void;
  onNewQuiz: () => void;
}

export function ResultsPanel({ stats, onRetakeQuiz, onNewQuiz }: ResultsPanelProps) {
  const percentage = stats.totalQuestions > 0
    ? Math.round((stats.correctCount / stats.totalQuestions) * 100)
    : 0;

  const getPerformanceLevel = () => {
    if (percentage >= 90) return { text: 'Excellent!', color: 'text-green-600' };
    if (percentage >= 75) return { text: 'Great Job!', color: 'text-blue-600' };
    if (percentage >= 60) return { text: 'Good Effort!', color: 'text-yellow-600' };
    return { text: 'Keep Practicing!', color: 'text-orange-600' };
  };

  const performance = getPerformanceLevel();

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="text-center">
        <CardHeader>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4 mx-auto">
            <Trophy className="w-10 h-10 text-blue-600" />
          </div>
          <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
          <CardDescription className={`text-2xl ${performance.color} mt-2`}>
            {performance.text}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-6xl text-gray-800 mb-4">{percentage}%</div>
          <p className="text-gray-600 mb-4">Overall Score</p>
          <Progress value={percentage} className="h-3" />
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-3xl text-gray-800 mb-1">{stats.totalQuestions}</div>
            <p className="text-gray-600">Total Questions</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="text-3xl text-gray-800 mb-1">{stats.correctCount}</div>
            <p className="text-gray-600">Correct Answers</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-3">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="text-3xl text-gray-800 mb-1">{stats.wrongCount}</div>
            <p className="text-gray-600">Wrong Answers</p>
          </CardContent>
        </Card>
      </div>

      {/* Topic Performance */}
      {(stats.strongTopics.length > 0 || stats.weakTopics.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Topic Performance</CardTitle>
            <CardDescription>Your strengths and areas for improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Strong Topics */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-gray-700">Strong Topics</h3>
                </div>
                {stats.strongTopics.length > 0 ? (
                  <div className="space-y-2">
                    {stats.strongTopics.map((topic, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="w-full justify-start px-4 py-3 bg-green-50 border border-green-200 text-green-800 hover:bg-green-100"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No strong topics identified</p>
                )}
              </div>

              {/* Weak Topics */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-gray-700">Topics to Improve</h3>
                </div>
                {stats.weakTopics.length > 0 ? (
                  <div className="space-y-2">
                    {stats.weakTopics.map((topic, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="w-full justify-start px-4 py-3 bg-red-50 border border-red-200 text-red-800 hover:bg-red-100"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No weak topics - great job!</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={onRetakeQuiz}
          size="lg"
          className="flex-1 shadow-lg"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Retake Quiz
        </Button>
        <Button
          onClick={onNewQuiz}
          size="lg"
          variant="secondary"
          className="flex-1 bg-purple-600 text-white hover:bg-purple-700 shadow-lg"
        >
          <Upload className="w-5 h-5 mr-2" />
          Upload New Document
        </Button>
      </div>
    </div>
  );
}