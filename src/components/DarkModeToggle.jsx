import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setEnabled(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [enabled]);

  const toggleTheme = () => {
    setEnabled(!enabled);
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-12 h-12 rounded-full border border-gray-400 dark:border-gray-200 bg-white dark:bg-gray-900 text-yellow-500 dark:text-blue-400 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
    >
      <span
        className={`text-2xl transform transition-transform duration-500 ${
          enabled ? 'rotate-0' : 'rotate-180'
        }`}
      >
        {enabled ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
