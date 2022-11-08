import { useQueries } from "@tanstack/react-query";

const urlCreator = (token: string, days: number) =>
  `https://api.coingecko.com/api/v3/coins/${token}/ohlc?vs_currency=usd&days=${days}`;

export interface IResponseDatum {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

const fetchOHLC = async (
  tokenID: string,
  days: number
): Promise<IResponseDatum[]> => {
  const response = await fetch(urlCreator(tokenID, days));

  /**
   * [time, open, high, low, close]
   */
  const data = await response.json();

  if (!data) {
    throw new Error("No data");
  }

  return data.map((item: number[]) => ({
    time: item[0],
    open: item[1],
    high: item[2],
    low: item[3],
    close: item[4],
  }));
};

export const usePriceQueries = (tokenIDs: string[], days: number) => {
  return useQueries({
    queries: tokenIDs.map((tokenID) => ({
      queryKey: ["price", tokenID, days],
      queryFn: () => fetchOHLC(tokenID, days),
    })),
  });
};
