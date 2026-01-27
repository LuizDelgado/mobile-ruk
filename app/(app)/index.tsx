import { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, FlatList, Pressable, Image, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@apollo/client/react";

import {
  MeDocument,
  UsersDocument,
  type MeQuery,
  type UsersQuery,
  type UsersQueryVariables,
} from "../../src/generated/graphql";

export default function HomeRoute() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data: meData, loading: meLoading, refetch: refetchMe } = useQuery<MeQuery>(MeDocument);

  const {
    data: usersData,
    loading: usersLoading,
    refetch: refetchUsers,
  } = useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, {
    variables: { search },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    refetchUsers({ search });
  }, [search, refetchUsers]);

  const me = meData?.me ?? null;

  const getInitials = (name?: string | null) => {
    const n = (name ?? "").trim();
    if (!n) return "?";
    const parts = n.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0]?.toUpperCase() ?? "?";
    const last = parts.length > 1 ? parts[parts.length - 1][0]?.toUpperCase() : "";
    return `${first}${last}`.trim();
  };

  const memberSince = useMemo(() => {
    if (!me?.created_at) return null;
    try {
      return new Date(me.created_at).toLocaleDateString();
    } catch {
      return null;
    }
  }, [me?.created_at]);

  async function handleLogout() {
    await AsyncStorage.removeItem("token");
    router.replace("/(auth)/login");
  }

  const loading = meLoading || usersLoading;

  return (
    <View className="flex-1 bg-gray-50">
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        {/* Header */}
        <View className="px-6 py-4 bg-white border-b border-gray-100 flex-row justify-between items-center shadow-sm">
          <View className="flex-row items-center gap-3">
            <Image source={require("../../assets/ruk-logo.png")} className="w-8 h-8" resizeMode="contain" />
            <Text className="text-lg font-bold text-gray-800">RUK Portal</Text>
          </View>

          <Pressable onPress={handleLogout} className="bg-red-50 px-3 py-1.5 rounded-lg">
            <Text className="text-red-600 font-semibold text-xs">Logout</Text>
          </Pressable>
        </View>

        <View className="flex-1 px-5 pt-6">
          {/* Me card */}
          <View className="bg-white rounded-2xl p-4 mb-5 shadow-sm shadow-gray-200 border border-gray-100">
            <View className="flex-row items-center gap-4">
              <View className="w-14 h-14 rounded-full bg-indigo-100 items-center justify-center">
                <Text className="text-indigo-600 font-bold text-lg">{getInitials(me?.name)}</Text>
              </View>

              <View className="flex-1">
                <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Signed in as
                </Text>

                <Text className="text-base font-bold text-gray-900 mt-1">
                  {me?.name ?? (meLoading ? "Loading..." : "Unknown user")}
                </Text>

                <Text className="text-sm text-gray-500 mt-0.5">{me?.email ?? ""}</Text>

                {memberSince ? (
                  <Text className="text-xs text-gray-400 mt-2">Member since {memberSince}</Text>
                ) : null}
              </View>

              <Pressable
                onPress={() => refetchMe()}
                className="bg-gray-50 px-3 py-2 rounded-xl border border-gray-200"
              >
                <Text className="text-gray-700 text-xs font-semibold">Refresh</Text>
              </Pressable>
            </View>
          </View>

          {/* Users */}
          <Text className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Users</Text>

          <View className="mb-6">
            <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm shadow-gray-100">
              <TextInput
                placeholder="Search users..."
                placeholderTextColor="#9CA3AF"
                value={search}
                onChangeText={setSearch}
                className="flex-1 text-base text-gray-900"
                autoCorrect={false}
              />
            </View>
            <Text className="text-xs text-gray-400 mt-2">
              API: api-ruk-deploy-production.up.railway.app/graphql
            </Text>
          </View>

          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator />
              <Text className="text-gray-500 mt-3">Loading...</Text>
            </View>
          ) : (
            <FlatList
              data={usersData?.users ?? []}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View className="bg-white rounded-2xl p-4 mb-3 flex-row items-center gap-4 shadow-sm shadow-gray-200 border border-gray-100">
                  <View className="w-12 h-12 rounded-full bg-indigo-100 items-center justify-center">
                    <Text className="text-indigo-600 font-bold text-lg">{getInitials(item.name)}</Text>
                  </View>

                  <View className="flex-1">
                    <Text className="font-bold text-gray-900 text-base">{item.name}</Text>
                    <Text className="text-gray-500 text-sm mt-0.5">{item.email}</Text>
                    <Text className="text-gray-400 text-xs mt-2">
                      Member since {new Date(item.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              )}
              ListEmptyComponent={
                <View className="items-center justify-center mt-10">
                  <Text className="text-gray-400">No users found.</Text>
                </View>
              }
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
