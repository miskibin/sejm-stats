"use client";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import { mapData } from "./map.json";
export interface DistrictData {
  districtName: string;
  count: number;
}

export const districtToRegionMapping: Record<string, string> = {
  Katowice: "pl-sl",
  Legnica: "pl-ds",
  Siedlce: "pl-mz",
  Kielce: "pl-sk",
  Chełm: "pl-lu",
  Radom: "pl-mz",
  Warszawa: "pl-mz",
  Kalisz: "pl-wp",
  Białystok: "pl-pd",
  Lublin: "pl-lu",
  Toruń: "pl-kp",
  Bydgoszcz: "pl-kp",
  Krosno: "pl-pk",
  Poznań: "pl-wp",
  Tarnów: "pl-ma",
  Wrocław: "pl-ds",
  Koszalin: "pl-zp",
  Olsztyn: "pl-wn",
  "Nowy Sącz": "pl-ma",
  Łódź: "pl-ld",
  Piła: "pl-wp",
  Słupsk: "pl-pm",
  Szczecin: "pl-zp",
  Płock: "pl-mz",
  Sieradz: "pl-ld",
  Kraków: "pl-ma",
  Wałbrzych: "pl-ds",
  Częstochowa: "pl-sl",
  Elbląg: "pl-wn",
  "Zielona Góra": "pl-lb",
  Gdańsk: "pl-pm",
  Konin: "pl-wp",
  "Piotrków Trybunalski": "pl-ld",
  "Bielsko-Biała": "pl-sl",
  Opole: "pl-op",
  Rzeszów: "pl-pk",
};



function mapDistrictDataToHighcharts(
  districtData: DistrictData[]
): [string, number][] {
  const mappedData: Record<string, number> = {};

  districtData.forEach((district) => {
    const regionCode = districtToRegionMapping[district.districtName];
    if (regionCode) {
      mappedData[regionCode] = (mappedData[regionCode] || 0) + district.count;
    }
  });

  return Object.entries(mappedData);
}

export const DistrictMap: React.FC<{ districtData: DistrictData[] }> = ({
  districtData,
}) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  useEffect(() => {
    const fetchTopology = async () => {
      try {
        const response = await fetch(
          "https://code.highcharts.com/mapdata/countries/pl/pl-all.topo.json"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const topology = await response.json();

        if (chartRef.current && chartRef.current.chart) {
          chartRef.current.chart.update({
            chart: {
              backgroundColor: undefined,
              map: topology,
            },
            series: [
              {
                type: "map",
                data: mapDistrictDataToHighcharts(districtData),
                mapData: topology,
                name: "Ilość posłów z okręgu",
                states: {
                  hover: {
                    color: "#BADA55",
                  },
                },
                dataLabels: {
                  enabled: false,
                  format: "{point.properties.alt-name}",
                },
              },
            ],
          });
        }
      } catch (error) {
        console.error("Failed to fetch topology:", error);
      }
    };

    fetchTopology();
  }, [districtData]);

  const options: Highcharts.Options = {
    chart: {
      map: undefined,
    },
    title: {
      text: undefined,
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: "bottom",
      },
    },
    colorAxis: {
      min: 0,
    },
       series: [
      {
        type: "map",
        name: "Ilość posłów z okręgu",
        states: {
          hover: {
            color: "#BADA55",
          },
        },
        dataLabels: {
          enabled: true,
          format: "{point.properties.alt-name}",
        },
        allAreas: true,
        data: [],
        tooltip: {
          pointFormatter: function () {
            return this.properties["alt-name"];
          },
        },
      },
    ],
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      constructorType={"mapChart"}
      ref={chartRef}
    />
  );
};
