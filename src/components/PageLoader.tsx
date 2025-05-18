
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useTheme } from '@/hooks/use-theme';

const quotes = [
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Dream big, work hard, stay focused.",
  "Success is no accident. It's hard work, perseverance, learning, studying, sacrifice.",
  "Great things come to those who hustle.",
  "The only place where success comes before work is in the dictionary.",
  "Don't wish it were easier. Wish you were better.",
  "The dream is free. The hustle is sold separately.",
  "Hustle until your haters ask if you're hiring.",
  "Good things happen to those who hustle.",
  "Don't stop when you're tired. Stop when you're done."
];

const PageLoader = () => {
  const { theme } = useTheme();
  const [progress, setProgress] = React.useState(0);
  const [quote, setQuote] = React.useState('');

  React.useEffect(() => {
    // Pick a random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);

    // Animate progress
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 4;
      });
    }, 40);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-all">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12">
          <img src="/lovable-uploads/20798b3f-8f2f-4eee-acc7-fa3d47c76467.png" alt="SynergySphere Logo" className="h-12 w-auto" />
        </div>
        <h1 className="text-2xl font-bold ml-2 bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500 bg-clip-text text-transparent">
          SynergySphere
        </h1>
      </div>
      
      <div className="w-64 mb-8">
        <Progress value={progress} className="h-2" />
      </div>
      
      <p className="text-sm text-center max-w-xs text-gray-600 dark:text-gray-300 italic">
        "{quote}"
      </p>
    </div>
  );
};

export default PageLoader;
