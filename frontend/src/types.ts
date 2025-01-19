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

export type latestMeasurementApiResponse = {
  timestamp: string,
  temperature: number,
  humidity: number,
  co2: number
}

export type EnvValueStreamMessage = {
  timestamp: string,
  temperature: number,
  humidity: number,
  co2: number,
  co2_corrected: number
}