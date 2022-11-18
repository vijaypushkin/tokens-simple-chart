import { Card, Chip, Text } from "@mantine/core";
import { useMemo } from "react";
import { IResponseDatum, usePriceQueries } from "../hooks/query/price.query";
import LineChart from "../components/charts/line-chart";
import { format } from "date-fns/fp";
import useChartsStore from "../stores/charts.store";

type TToken = {
  id: string;
  name: string;
  symbol: string;
};
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

const DAYS = [1, 7, 30, 90] as const;

const Control = () => {
  const days = useChartsStore((state) => state.days);
  const tokens = useChartsStore((state) => state.tokens);

  const setDays = useChartsStore((state) => state.setDays);
  const setTokens = useChartsStore((state) => state.setTokens);

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder sx={{ marginBottom: 24 }}>
      <Card.Section p="lg">
        <Text size="sm" sx={{ marginBottom: 8 }}>
          Token
        </Text>
        <Chip.Group
          value={tokens.map((x) => x.id)}
          multiple={true}
          onChange={(value) => {
            setTokens(TOKENS.filter((x) => value.includes(x.id)));
          }}
        >
          {TOKENS.map((token) => (
            <Chip key={token.id} value={token.id}>
              {token.name}
            </Chip>
          ))}
        </Chip.Group>
      </Card.Section>

      <Card.Section p="lg">
        <Text size="sm" sx={{ marginBottom: 8 }}>
          Days
        </Text>
        <Chip.Group
          value={`${days}`}
          onChange={(day) => {
            setDays(Number(day));
          }}
        >
          {DAYS.map((day) => (
            <Chip key={day} value={`${day}`}>
              {day}
            </Chip>
          ))}
        </Chip.Group>
      </Card.Section>
    </Card>
  );
};

const Charts = () => {
  const days = useChartsStore((state) => state.days);
  const tokens = useChartsStore((state) => state.tokens);

  const results = usePriceQueries(
    tokens.map((x) => x.id),
    days
  );

  const resultsUpdatedAt = results.map((x) =>
    // @ts-ignore
    x.status === "success" ? x.updatedAt : null
  );

  const resultsStatus = results.map((x) => x.fetchStatus);

  const allData = useMemo(() => {
    const successResults = results
      .map((x, idx) => ({ ...x, queryFor: tokens[idx].name }))
      .filter((x) => x.status === "success");

    if (successResults == null || successResults.length === 0) {
      return [];
    }

    const tokenData = tokens
      .map<IResponseDatum[]>(
        (item) =>
          ((successResults.find((y) => y.queryFor === item.name) as any)
            ?.data as IResponseDatum[]) ?? null
      )
      .filter((x) => x != null) as IResponseDatum[][];

    return (
      successResults[0].data?.map((x) => {
        const filteredData = tokenData.reduce(
          (acc, cur, dataIdx) => ({
            ...acc,
            [tokens[dataIdx].name]:
              cur.find((y) => y.time === x.time)?.open ?? null,
          }),
          {}
        );

        return {
          time: format("dd/MM HH:mm")(x.time),
          ...filteredData,
        };
      }) ?? []
    );
  }, [resultsUpdatedAt.join(","), resultsStatus.join(","), tokens.length]);

  return (
    <Card>
      <Card.Section p="lg" sx={{ width: 600 }}>
        <LineChart
          data={allData}
          requiredLines={tokens.map((x) => x.name)}
          xAxisDataKey={"time"}
        />
      </Card.Section>
    </Card>
  );
};

const MainComponent = () => {
  return (
    <div>
      <Control />
      <Charts />
    </div>
  );
};

export default MainComponent;
