import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import Constants from "expo-constants";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";

import { AppRoot } from "@components/AppRoot";
import { store } from "@store";
import { trpc } from "@utils";

SplashScreen.preventAutoHideAsync();

export const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({ url: `${Constants.expoConfig?.extra?.apiUrl}/trpc` }),
      ],
    })
  );

  return (
    <ReduxProvider store={store}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <SafeAreaProvider>
              <RootSiblingParent>
                <StatusBar style="auto" />
                <AppRoot />
              </RootSiblingParent>
            </SafeAreaProvider>
          </NavigationContainer>
        </QueryClientProvider>
      </trpc.Provider>
    </ReduxProvider>
  );
};
