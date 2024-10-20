import React, { useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const FinancialChart = ({
  dividend,
  cfps,
  netmargin,
  interestcoverage,
  roic,
  eps,
}) => {
  // Data Arrays
  // Labels for years
  const labels = Array.from(
    { length: netmargin.length },
    (_, i) => 2024 - netmargin.length + 1 + i
  );

  // Chart state for visibility toggles
  const [visibleDatasets, setVisibleDatasets] = useState({
    dividend: true,
    cfps: true,
    netmargin: true,
    interestcoverage: true,
    roic: true,
    eps: true,
  });

  // Function to toggle visibility
  const toggleDatasetVisibility = (dataset) => {
    setVisibleDatasets((prev) => ({
      ...prev,
      [dataset]: !prev[dataset],
    }));
  };

  // Dynamic datasets
  const datasets = [
    {
      label: "Dividend",
      data: dividend,
      borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      hidden: !visibleDatasets.dividend,
    },
    {
      label: "CFPS",
      data: cfps,
      borderColor: "rgba(54, 162, 235, 1)",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      hidden: !visibleDatasets.cfps,
    },
    {
      label: "Net Margin",
      data: netmargin,
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      hidden: !visibleDatasets.netmargin,
    },
    {
      label: "Interest Coverage",
      data: interestcoverage,
      borderColor: "rgba(255, 206, 86, 1)",
      backgroundColor: "rgba(255, 206, 86, 0.2)",
      hidden: !visibleDatasets.interestcoverage,
    },
    {
      label: "ROIC",
      data: roic,
      borderColor: "rgba(153, 102, 255, 1)",
      backgroundColor: "rgba(153, 102, 255, 0.2)",
      hidden: !visibleDatasets.roic,
    },
    {
      label: "EPS",
      data: eps,
      borderColor: "rgba(255, 159, 64, 1)",
      backgroundColor: "rgba(255, 159, 64, 0.2)",
      hidden: !visibleDatasets.eps,
    },
  ];

  return (
    <div>
      <div className="my-4 mx-6">
        <h2 className="text-lg font-medium text-white">Key Ratio Trends</h2>
        <div className="flex justify-between mt-2 text-white">
          <label>
            <input
              type="checkbox"
              checked={visibleDatasets.dividend}
              onChange={() => toggleDatasetVisibility("dividend")}
            />{" "}
            Dividend
          </label>
          <label>
            <input
              type="checkbox"
              checked={visibleDatasets.cfps}
              onChange={() => toggleDatasetVisibility("cfps")}
            />{" "}
            CFPS
          </label>
          <label>
            <input
              type="checkbox"
              checked={visibleDatasets.netmargin}
              onChange={() => toggleDatasetVisibility("netmargin")}
            />{" "}
            Net Margin
          </label>
          <label>
            <input
              type="checkbox"
              checked={visibleDatasets.interestcoverage}
              onChange={() => toggleDatasetVisibility("interestcoverage")}
            />{" "}
            Interest Coverage
          </label>
          <label>
            <input
              type="checkbox"
              checked={visibleDatasets.roic}
              onChange={() => toggleDatasetVisibility("roic")}
            />{" "}
            ROIC
          </label>
          <label>
            <input
              type="checkbox"
              checked={visibleDatasets.eps}
              onChange={() => toggleDatasetVisibility("eps")}
            />{" "}
            EPS
          </label>
        </div>
      </div>

      <Line
        className="bg-[#141823] text-white mx-6 rounded-[4px] border-white border"
        data={{
          labels: labels,
          datasets: datasets,
        }}
        options={{
          // Disable fixed aspect ratio
          scales: {
            x: {
              grid: {
                color: "rgba(255, 255, 255, 0.2)", // White grid lines with some transparency for x-axis
              },
              ticks: {
                color: "#ffffff", // White text for x-axis labels
              },
            },
            y: {
              beginAtZero: false,
              grid: {
                color: "rgba(255, 255, 255, 0.2)", // White grid lines with some transparency for y-axis
              },
              ticks: {
                color: "#ffffff", // White text for y-axis labels
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                color: "#ffffff", // White legend text
              },
            },
          },
        }}
      />
    </div>
  );
};

export default FinancialChart;
