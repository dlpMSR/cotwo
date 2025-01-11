export type EnvValue = {
  co2: number;
  temperature: number;
  humidity: number;
};

export type trendDatum = {
  timestamp: string,
  value: number
};

export type trendDatumUnixtime = {
  timestamp: number,
  value: number
};
