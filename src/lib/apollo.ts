import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function getGraphqlUrl() {
  // Web pode usar localhost
  if (Platform.OS === "web") return "http://localhost:3000/graphql";

  // Mobile precisa do IP do PC na rede
  // Troque pelo IP do seu PC (o mesmo que aparece no exp://192.168.0.135:8081)
  return "https://api-ruk-deploy-production.up.railway.app/graphql";
}

const httpLink = createHttpLink({
  uri: getGraphqlUrl(),
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem("token");
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
