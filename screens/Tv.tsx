import { ScrollView, RefreshControl } from "react-native";
import React, { useState } from "react";
import { useInfiniteQuery, useQuery, useQueryClient } from "react-query";
import { tvApi, TVResponse } from "../api";
import Loader from "../components/Loader";
import HList from "../components/HList";
import { getNextPage } from "../utils";

const Tv = () => {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const {
    isLoading: popularLoading,
    data: popularData,
    hasNextPage: popularHasNextPage,
    fetchNextPage: popularFetchNextPage,
  } = useInfiniteQuery<TVResponse>(["tv", "popular"], tvApi.popular, {
    getNextPageParam: getNextPage,
  });
  const {
    isLoading: todayLoading,
    data: todayData,
    hasNextPage: todayHasNextPage,
    fetchNextPage: todayFetchNextPage,
  } = useInfiniteQuery<TVResponse>(["tv", "today"], tvApi.airingToday, {
    getNextPageParam: getNextPage,
  });
  const {
    isLoading: topLoading,
    data: topData,
    hasNextPage: topHasNextPage,
    fetchNextPage: topFetchNextPage,
  } = useInfiniteQuery<TVResponse>(["tv", "top"], tvApi.topRated, {
    getNextPageParam: getNextPage,
  });
  const {
    isLoading: trendingLoading,
    data: trendingData,
    hasNextPage: trendingHasNextPage,
    fetchNextPage: trendingFetchNextPage,
  } = useInfiniteQuery<TVResponse>(["tv", "trending"], tvApi.trending, {
    getNextPageParam: getNextPage,
  });

  const onRefresh = () => {
    setRefreshing(true);
    queryClient.refetchQueries(["tv"]);
    setRefreshing(false);
  };
  const loading = todayLoading || topLoading || trendingLoading;

  if (loading) {
    return <Loader />;
  }
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ paddingVertical: 30 }}
    >
      <HList
        title="Popular TV"
        data={popularData?.pages.map((page) => page.results).flat()}
        hasNextPage={popularHasNextPage}
        fetchNextPage={popularFetchNextPage}
      />
      <HList
        title="Trending TV"
        data={trendingData?.pages.map((page) => page.results).flat()}
        hasNextPage={trendingHasNextPage}
        fetchNextPage={trendingFetchNextPage}
      />
      <HList
        title="Airing Today"
        data={todayData?.pages.map((page) => page.results).flat()}
        hasNextPage={todayHasNextPage}
        fetchNextPage={todayFetchNextPage}
      />
      <HList
        title="Top Rated TV"
        data={topData?.pages.map((page) => page.results).flat()}
        hasNextPage={topHasNextPage}
        fetchNextPage={topFetchNextPage}
      />
    </ScrollView>
  );
};

export default Tv;
