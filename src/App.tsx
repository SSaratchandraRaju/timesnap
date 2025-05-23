import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Play, Pause, RotateCcw, Timer, Sun, Moon } from 'lucide-react';

function App() {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);

  // Clock Update
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Stopwatch
  useEffect(() => {
    let interval: number;
    if (isRunning) {
      interval = setInterval(() => {
        setStopwatchTime(prev => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = useCallback((date: Date) => {
    const hours = is24Hour ? date.getHours() : date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${hours}:${minutes}:${seconds}${!is24Hour ? ' ' + ampm : ''}`;
  }, [is24Hour]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatStopwatch = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps(prev => [...prev, stopwatchTime]);
    }
  };

  const handleReset = () => {
    setStopwatchTime(0);
    setLaps([]);
    setIsRunning(false);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-500`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Clock className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <div className="flex gap-4">
              <button
                onClick={() => setIs24Hour(!is24Hour)}
                className={`px-3 py-1 rounded-full ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} 
                hover:bg-blue-500 hover:text-white transition-colors duration-300`}
              >
                {is24Hour ? '24H' : '12H'}
              </button>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-800'} 
                hover:bg-blue-500 hover:text-white transition-colors duration-300`}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>

          {/* Digital Clock */}
          <div className={`text-center p-8 rounded-2xl backdrop-blur-lg ${
            isDarkMode ? 'bg-gray-800/50 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 
            'bg-white/90 shadow-lg'
          } transition-all duration-500`}>
            <h1 className={`font-mono text-6xl md:text-7xl font-bold mb-4 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            } transition-colors duration-300`}>
              {formatTime(time)}
            </h1>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {formatDate(time)}
            </p>
          </div>

          {/* Stopwatch */}
          <div className={`mt-8 p-6 rounded-2xl ${
            isDarkMode ? 'bg-gray-800/50' : 'bg-white/90'
          } transition-all duration-500`}>
            <div className="text-center">
              <h2 className={`font-mono text-4xl font-bold mb-6 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {formatStopwatch(stopwatchTime)}
              </h2>
              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`p-3 rounded-full ${
                    isDarkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'
                  } text-white transition-colors duration-300`}
                >
                  {isRunning ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button
                  onClick={handleLap}
                  className={`p-3 rounded-full ${
                    isDarkMode ? 'bg-green-500 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'
                  } text-white transition-colors duration-300`}
                >
                  <Timer size={24} />
                </button>
                <button
                  onClick={handleReset}
                  className={`p-3 rounded-full ${
                    isDarkMode ? 'bg-red-500 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'
                  } text-white transition-colors duration-300`}
                >
                  <RotateCcw size={24} />
                </button>
              </div>
              
              {/* Laps */}
              {laps.length > 0 && (
                <div className={`mt-4 p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                } max-h-48 overflow-auto`}>
                  {laps.map((lap, index) => (
                    <div key={index} className={`flex justify-between py-2 ${
                      index !== laps.length - 1 ? 'border-b' : ''
                    } ${isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-600'}`}>
                      <span>Lap {laps.length - index}</span>
                      <span className="font-mono">{formatStopwatch(lap)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;