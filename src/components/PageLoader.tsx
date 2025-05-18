
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
          <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="url(#gradient)" />
            <path d="M22 12L16 7L10 12L10 22L22 22L22 12Z" fill="white" fillOpacity="0.5" />
            <path d="M16 7L10 12L16 17L22 12L16 7Z" fill="white" />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4776E6" />
                <stop offset="1" stopColor="#8E54E9" />
              </linearGradient>
            </defs>
          </svg>
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
