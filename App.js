import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Root from "./navigations/Root";
import { ThemeProvider } from "styled-components/native";
import { useColorScheme } from "react-native";
import { darkTheme, lightTheme } from "./styled";
import { QueryClient, QueryClientProvider } from "react-query";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function App() {
  const isDark = useColorScheme() === "dark";

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Root />
        </NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
