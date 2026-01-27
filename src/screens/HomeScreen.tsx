import { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, Pressable, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { useQuery } from "@apollo/client/react";
import { UsersDocument, type UsersQuery, type UsersQueryVariables } from "../generated/graphql";

export default function HomeScreen() {
  const [search, setSearch] = useState("");

  const { data, refetch } = useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, {
    variables: { search },
  });

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) router.replace("/(auth)/login");
    })();
  }, []);

  async function handleLogout() {
    await AsyncStorage.removeItem("token");
    router.replace("/(auth)/login");
  }

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <View className="px-6 py-6 flex-1">
          <View className="flex-row items-center justify-between mb-4">
            <Image source={require("../../assets/ruk-logo.png")} className="w-24 h-10" resizeMode="contain" />
            <Pressable onPress={handleLogout} className="bg-gray-100 px-4 py-2 rounded-xl">
              <Text className="text-gray-700 font-semibold">Logout</Text>
            </Pressable>
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-2">Users</Text>
          <Text className="text-gray-500 mb-4">Search and browse users</Text>

          <View className="flex-row gap-2 mb-4">
            <TextInput
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
              placeholder="Search..."
              value={search}
              onChangeText={setSearch}
            />
            <Pressable onPress={() => refetch()} className="bg-blue-600 px-4 rounded-xl justify-center">
              <Text className="text-white font-bold">Go</Text>
            </Pressable>
          </View>

          <FlatList
            data={data?.users ?? []}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item }) => (
              <View className="border border-gray-200 rounded-2xl p-4 mb-3">
                <Text className="text-gray-900 font-bold text-lg">{item.name}</Text>
                <Text className="text-gray-500">{item.email}</Text>
                {!!item.telephones?.length && (
                  <Text className="text-gray-500 mt-1">
                    {item.telephones.map((t) => `(${t.area_code}) ${t.number}`).join(", ")}
                  </Text>
                )}
              </View>
            )}
            ListEmptyComponent={
              <View className="items-center justify-center mt-10">
                <Text className="text-gray-400">No users found.</Text>
              </View>
            }
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
