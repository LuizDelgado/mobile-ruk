import { Stack } from "expo-router";
import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "../src/lib/apollo";

export default function RootLayout() {
  return (
    <ApolloProvider client={apolloClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </ApolloProvider>
  );
}
