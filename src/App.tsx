import { useState } from "react";
import {
  AppShell,
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import Header from "./components/layouts/header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) => {
    console.log("toggleColorScheme", colorScheme === "dark" ? "light" : "dark");
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={{ colorScheme }}
          withGlobalStyles
          withNormalizeCSS
        >
          <AppShell
            padding="md"
            header={<Header />}
            styles={(theme) => ({
              main: {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0],
              },
            })}
          >
            <Home />
          </AppShell>
        </MantineProvider>
        <ReactQueryDevtools />
      </ColorSchemeProvider>
    </QueryClientProvider>
  );
}

export default App;
