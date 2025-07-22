import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,} from 'chart.js';
import {apiRequestUrl} from "./apiRequestUrl.ts";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function App() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiRequestUrl);

        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const prepareChartData = () => {
    if (!data || !data.sol_keys) return null;

    const solKeys = data.sol_keys;

    return {
      labels: solKeys.map((sol: string) => `Sol ${sol}`),
      datasets: [

        {
          label: 'Max Температура (°C)',
          data: solKeys.map((sol: string) => data[sol].AT.mx),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
      ]
    };
  };

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        title: {
          display: true,
          text: 'Температура (°C)'
        },
      }
    }
  };

  if (loading) return <p>Загрузка данных...</p>;
  if (error) return <p>Ошибка: {error}</p>;
  if (!data) return <p>Нет данных</p>;

  const chartData = prepareChartData();

  return (
      <div className="container">
        <h1>Маx температура Марса по марсианским дням (Sol)</h1>
        {chartData ? (
            <div className="graph-container">
              <Line data={chartData} options={chartOptions} />
            </div>
        ) : (
            <p>Нет доступных данных</p>
        )}
      </div>
  );
}