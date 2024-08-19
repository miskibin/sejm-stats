"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Club } from "@/lib/types";

const HighchartsReact = dynamic(() => import("highcharts-react-official"), {
  ssr: false,
});

interface ClubsChartProps {
  clubs: Club[];
}

const clubColors: { [key: string]: string } = {
  PiS: "#0C5DA5",
  KO: "#FF6720",
  "Polska2050-TD": "#FCD300",
  "PSL-TD": "#17A42B",
  Lewica: "#D10000",
  Konfederacja: "#1A1A1A",
  "Kukiz'15": "#000000",
  niez: "#CCCCCC",
};

const ClubsChart: React.FC<ClubsChartProps> = ({ clubs }) => {
  const [chartOptions, setChartOptions] = useState<Highcharts.Options | null>(null);

  useEffect(() => {
    const loadHighcharts = async () => {
      const Highcharts = await import("highcharts");
      const { default: itemSeriesModule } = await import("highcharts/modules/item-series");
      itemSeriesModule(Highcharts);

      const options: Highcharts.Options = {
        chart: {
          type: "item",
          backgroundColor: "transparent",
          height: 600,
        },
        title: {
          text: undefined
        },
        credits: {
          enabled: false,
        },
        legend: {
          enabled: false
        },
        series: [{
          type: "item",
          name: "Mandaty",
          keys: ["name", "y", "color", "label"],
          data: clubs
            .sort((a, b) => b.membersCount - a.membersCount)
            .map((club) => [
              club.id,
              club.membersCount,
              clubColors[club.id] || "#CCCCCC",
              club.id,
            ]),
          dataLabels: {
            enabled: false,
          },
          center: ['50%', '50%'],
          size: '100%',
          startAngle: -100,
          endAngle: 100,
        }],
        plotOptions: {
          item: {
            innerSize: '20%',
            marker: {
              symbol: 'circle',
              radius: 6
            }
          }
        },
        tooltip: {
          headerFormat: "",
          pointFormat: '<span style="color:{point.color}">\u25CF</span> <b>{point.name}</b><br/>Mandaty: <b>{point.y}</b>'
        },
      };

      setChartOptions(options);
    };

    loadHighcharts();
  }, [clubs]);

  const renderLegend = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
        {clubs.map((club) => (
          <div key={club.id} style={{ display: 'flex', alignItems: 'center', margin: '0 10px 10px 0' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              backgroundColor: clubColors[club.id] || "#CCCCCC", 
              marginRight: '5px' 
            }}></div>
            <span>{club.id}</span>
          </div>
        ))}
      </div>
    );
  };

  if (!chartOptions) {
    return <div>ładowanie</div>;
  }

  if (clubs.length === 0) {
    return <div>No data available for the chart</div>;
  }

  return (
    <div>
      <div style={{ width: '100%', height: '400px' }}>
        <HighchartsReact
          highcharts={require("highcharts")}
          options={chartOptions}
          containerProps={{ style: { width: '100%', height: '100%' } }}
        />
      </div>
      {renderLegend()}
    </div>
  );
};

export default ClubsChart;