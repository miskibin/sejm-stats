"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Club } from "@/lib/api";

const HighchartsReact = dynamic(() => import("highcharts-react-official"), {
  ssr: false,
});

interface ClubsChartProps {
  clubs: Club[];
}

// Predefined colors for clubs
const clubColors: { [key: string]: string } = {
  PiS: "#0C5DA5",
  KO: "#FF6720",
  Lewica: "#D10000",
  PSL: "#17A42B",
  Konfederacja: "#1A1A1A",
  "Polska 2050": "#FCD300",
  "Kukiz'15": "#000000",
  "PSL-TD": "#17A42B",
  "Polska2050-TD": "#FCD300",
  // Add more clubs and their colors as needed
};

const ClubsChart: React.FC<ClubsChartProps> = ({ clubs }) => {
  const [chartOptions, setChartOptions] = useState<Highcharts.Options | null>(
    null
  );

  useEffect(() => {
    const loadHighcharts = async () => {
      const Highcharts = await import("highcharts");
      const { default: itemSeriesModule } = await import(
        "highcharts/modules/item-series"
      );
      itemSeriesModule(Highcharts);

      const options: Highcharts.Options = {
        chart: {
          type: "item",
          backgroundColor: "transparent",
        },
        title: {
          text: undefined,
        },
        credits: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
        series: [
          {
            type: "item",
            name: "Mandaty",
            keys: ["name", "y", "color", "label"],
            data: clubs.sort((a,b) => b.membersCount - a.membersCount).map((club) => [
              club.id,
              club.membersCount,
              clubColors[club.id] || "#CCCCCC", // Use predefined color or default to gray
              club.id,
            ]),
            dataLabels: {
              enabled: true,
              format: "{point.label}",
              style: {
                textOutline: "none",
                fontWeight: "normal",
              },
            },
            // Circular options
            startAngle: -110,
            endAngle: 110,
            size: "100%",
            innerSize: "20%",
          },
        ],
        plotOptions: {
        },
        tooltip: {
          headerFormat: "",
          pointFormat:
            '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
            "Mandaty: <b>{point.y}</b>",
        },
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500,
              },
              chartOptions: {
                series: [
                ],
              },
            },
          ],
        },
      };

      setChartOptions(options);
    };

    loadHighcharts();
  }, [clubs]);

  if (!chartOptions) {
    return <div>Loading chart...</div>;
  }

  return (
    <HighchartsReact
      highcharts={require("highcharts")}
      options={chartOptions}
    />
  );
};

export default ClubsChart;
