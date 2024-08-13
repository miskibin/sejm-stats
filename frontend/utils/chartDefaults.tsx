// chartDefaults.ts
import { useTheme } from 'next-themes';

type ColorScheme = {
  background: string[];
  border: string[];
  text: string;
  grid: string;
};

type ColorModes = {
  light: ColorScheme;
  dark: ColorScheme;
};

interface ChartDefaults {
  [key: string]: any;
  colors: ColorScheme;
}

const useChartDefaults = (): ChartDefaults => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const colors: ColorModes = {
    light: {
      background: [
        '#48bb78', // green-500
        '#f56565', // red-500
        '#ecc94b', // yellow-500
        '#38b2ac', // teal-500
        '#ed8936', // orange-500
        '#4299e1', // blue-500
        '#667eea', // indigo-500
        '#9f7aea', // purple-500
        '#ed64a6', // pink-500
      ],
      border: [
        '#38a169', // green-600
        '#e53e3e', // red-600
        '#319795', // teal-600
        '#dd6b20', // orange-600
        '#d69e2e', // yellow-600
        '#3182ce', // blue-600
        '#5a67d8', // indigo-600
        '#805ad5', // purple-600
        '#d53f8c', // pink-600
      ],
      text: '#4a5568', // gray-700
      grid: '#e2e8f0', // gray-300
    },
    dark: {
      background: [
        '#68d391', // green-400
        '#fc8181', // red-400
        '#f6e05e', // yellow-400
        '#4fd1c5', // teal-400
        '#f6ad55', // orange-400
        '#63b3ed', // blue-400
        '#7f9cf5', // indigo-400
        '#b794f4', // purple-400
        '#f687b3', // pink-400
      ],
      border: [
        '#f56565', // red-500
        '#ed8936', // orange-500
        '#ecc94b', // yellow-500
        '#48bb78', // green-500
        '#38b2ac', // teal-500
        '#4299e1', // blue-500
        '#667eea', // indigo-500
        '#9f7aea', // purple-500
        '#ed64a6', // pink-500
      ],
      text: '#e2e8f0', // gray-300
      grid: '#4a5568', // gray-700
    },
  };

  const currentColors = isDarkMode ? colors.dark : colors.light;

  return {
    aspectRatio: 0.9,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: currentColors.text,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    elements: {
      line: {
        tension: 0.3,
      },
    },
    colors: currentColors,
  };
};

export default useChartDefaults;