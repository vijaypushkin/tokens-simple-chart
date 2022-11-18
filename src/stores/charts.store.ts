import create from "zustand";

type TToken = {
  id: string;
  name: string;
  symbol: string;
};

interface IChartsStore {
  days: number;
  tokens: TToken[];
  setDays: (days: number) => void;
  setTokens: (tokens: TToken[]) => void;
}

const TOKENS: TToken[] = [
  {
    id: "tezos",
    name: "Tezos",
    symbol: "xtz",
  },
  {
    id: "matic-network",
    name: "Polygon",
    symbol: "matic",
  },
  {
    id: "tether",
    name: "Tether",
    symbol: "usdt",
  },
];

const useChartsStore = create<IChartsStore>((set) => ({
  days: 1,
  tokens: [TOKENS[0]],
  setDays: (days) => set({ days }),
  setTokens: (tokens: TToken[]) => set({ tokens }),
}));

export default useChartsStore;
