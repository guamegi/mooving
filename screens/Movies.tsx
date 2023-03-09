import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import styled from "styled-components/native";
import Swiper from "react-native-swiper";
import { Dimensions, FlatList, Platform } from "react-native";
import Slide from "../components/Slide";
import HList from "../components/HList";
import Loader from "../components/Loader";
import HMedia from "../components/HMedia";
import { useInfiniteQuery, useQuery, useQueryClient } from "react-query";
import { MovieResponse, moviesApi } from "../api";
import { appId, fetchMore, getNextPage } from "../utils";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = __DEV__
  ? TestIds.BANNER
  : Platform.OS === "android"
  ? appId.android
  : appId.ios;

const ComingSoonTitle = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 16px;
  font-weight: 600;
  margin-left: 30px;
  margin-bottom: 20px;
`;

const HSeparator = styled.View`
  height: 20px;
`;

const BannerContainer = styled.View`
  padding: 10px 0px;
`;

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Movies: React.FC<NativeStackScreenProps<any, "Movies">> = () => {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const { isLoading: nowPlayingLoading, data: nowPlayingData } =
    useQuery<MovieResponse>(["movies", "nowPlaying"], moviesApi.nowPlaying);

  const {
    isLoading: popularLoading,
    data: popularData,
    hasNextPage: popularHasNextPage,
    fetchNextPage: popularFetchNextPage,
  } = useInfiniteQuery<MovieResponse>(
    ["movies", "popular"],
    moviesApi.popular,
    {
      getNextPageParam: getNextPage,
    }
  );

  const {
    isLoading: trendingLoading,
    data: trendingData,
    hasNextPage: trendingHasNextPage,
    fetchNextPage: trendingFetchNextPage,
  } = useInfiniteQuery<MovieResponse>(
    ["movies", "trending"],
    moviesApi.trending,
    {
      getNextPageParam: getNextPage,
    }
  );

  const {
    isLoading: upcomingLoading,
    data: upcomingData,
    hasNextPage: upcomingHasNextPage,
    fetchNextPage: upcomingFetchNextPage,
  } = useInfiniteQuery<MovieResponse>(
    ["movies", "upcoming"],
    moviesApi.upcoming,
    {
      getNextPageParam: getNextPage,
    }
  );

  const onRefresh = () => {
    setRefreshing(true);
    queryClient.refetchQueries(["movies"]);
    setRefreshing(false);
  };

  const loading =
    popularLoading || nowPlayingLoading || upcomingLoading || trendingLoading;

  return loading ? (
    <Loader />
  ) : upcomingData ? (
    <FlatList
      onEndReached={() => fetchMore(upcomingHasNextPage, upcomingFetchNextPage)}
      onEndReachedThreshold={0.5}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListHeaderComponent={
        <>
          <Swiper
            loop
            autoplay={true}
            autoplayTimeout={3}
            showsPagination={false}
            containerStyle={{
              width: "100%",
              // height: SCREEN_HEIGHT / 4,
              height: 220,
              // marginBottom: 40,
            }}
          >
            {nowPlayingData?.results.map((movie) => (
              <Slide
                key={movie.id}
                backdropPath={movie.backdrop_path || ""}
                posterPath={movie.poster_path || ""}
                originalTitle={movie.title}
                voteAverage={movie.vote_average}
                overview={movie.overview}
                fullData={movie}
              />
            ))}
          </Swiper>
          <BannerContainer>
            <BannerAd sizes={[BannerAdSize.FULL_BANNER]} unitId={adUnitId} />
          </BannerContainer>
          {popularData ? (
            <HList
              title="Popular Movies"
              data={popularData?.pages.map((page) => page.results).flat()}
              hasNextPage={popularHasNextPage}
              fetchNextPage={popularFetchNextPage}
            />
          ) : null}
          {trendingData ? (
            <HList
              title="Trending Movies"
              data={trendingData?.pages.map((page) => page.results).flat()}
              hasNextPage={trendingHasNextPage}
              fetchNextPage={trendingFetchNextPage}
            />
          ) : null}
          <ComingSoonTitle>Coming soon</ComingSoonTitle>
        </>
      }
      data={upcomingData?.pages.map((page) => page.results).flat()}
      keyExtractor={(item) => item.id + ""}
      ItemSeparatorComponent={HSeparator}
      renderItem={({ item }) => (
        <HMedia
          posterPath={item.poster_path || ""}
          originalTitle={item.title}
          overview={item.overview}
          releaseDate={item.release_date}
          fullData={item}
        />
      )}
    />
  ) : null;
};

export default Movies;
