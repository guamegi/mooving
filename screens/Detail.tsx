import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Share,
  useColorScheme,
} from "react-native";
import React, { useEffect } from "react";
import styled from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQuery } from "react-query";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { Movie, MovieDetails, moviesApi, TV, tvApi, TVDetails } from "../api";
import Poster from "../components/Poster";
import { InterstitialAdAppId, makeImgPath } from "../utils";
import { BLACK_COLOR } from "../colors";
import Loader from "../components/Loader";
import { InterstitialAd, TestIds } from "react-native-google-mobile-ads";

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.OS === "android"
  ? InterstitialAdAppId.android
  : InterstitialAdAppId.ios;

const interstitial = InterstitialAd.createForAdRequest(adUnitId);

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Container = styled.ScrollView`
  background-color: ${(props) => props.theme.mainBgColor};
`;

const Header = styled.View`
  height: ${SCREEN_HEIGHT / 4}px;
  justify-content: flex-end;
  padding: 0px 20px;
`;
const Background = styled.Image``;

const Column = styled.View`
  flex-direction: row;
  width: 80%;
`;

const Title = styled.Text`
  color: white;
  /* font-size: 36px; */
  font-size: 32px;
  align-self: flex-end;
  margin-left: 15px;
  font-weight: 500;
`;

const Data = styled.View`
  padding: 0px 20px;
`;

const Release = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 13px;
  font-weight: 500;
  margin-top: 10px;
`;

const Overview = styled.Text`
  color: ${(props) => props.theme.detailOverviewColor};
  margin: 40px 0px;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
`;

const VideoBtn = styled.TouchableOpacity`
  flex-direction: row;
  width: 80%;
`;
const BtnText = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-weight: 500;
  margin-bottom: 10px;
  line-height: 24px;
  margin-left: 10px;
`;

type RootStackParamList = {
  Detail: Movie | TV;
};

type DetailScreenProps = NativeStackScreenProps<RootStackParamList, "Detail">;

const Detail: React.FC<DetailScreenProps> = ({
  navigation: { setOptions },
  route: { params },
}) => {
  const isDark = useColorScheme() === "dark";
  const isMovie = "title" in params;
  const { isLoading, data } = useQuery<MovieDetails | TVDetails>(
    [isMovie ? "movies" : "tv", params.id],
    isMovie ? moviesApi.detail : tvApi.detail
  );

  useEffect(() => {
    setOptions({
      title: isMovie ? "Movie" : "TV Show",
    });
    interstitial.load();
    return () => {
      try {
        interstitial.show();
      } catch (e) {
        console.log(e);
      }
    };
  }, []);

  useEffect(() => {
    setOptions({
      headerRight: () => <ShareButton />,
    });
  }, [data]);

  const openYTLink = async (videoID: string) => {
    const baseUrl = `https://m.youtube.com/watch?v=${videoID}`;
    await WebBrowser.openBrowserAsync(baseUrl);
  };

  const shareMedia = async () => {
    if (data) {
      const isAndroid = Platform.OS === "android";
      const homepage =
        isMovie && "imdb_id" in data
          ? `https://www.imdb.com/title/${data.imdb_id}/`
          : data.homepage;

      const shareOptions = isAndroid
        ? {
            message: `${params.overview}\nCheck it out: ${homepage}`,
            title: isMovie ? params.title : params.name,
          }
        : {
            url: homepage,
            title: isMovie ? params.title : params.name,
          };

      await Share.share(shareOptions);
    }
  };

  const ShareButton = () => (
    <TouchableOpacity onPress={shareMedia}>
      <Ionicons
        name="share-outline"
        color={isDark ? "white" : BLACK_COLOR}
        size={24}
      />
    </TouchableOpacity>
  );

  return (
    <Container>
      <Header>
        <Background
          style={StyleSheet.absoluteFill}
          source={{ uri: makeImgPath(params.backdrop_path || "") }}
        />
        <LinearGradient
          style={StyleSheet.absoluteFill}
          colors={["transparent", BLACK_COLOR]}
        />
        <Column>
          <Poster path={params.poster_path || ""} />
          <Title>{isMovie ? params.title : params.name}</Title>
        </Column>
      </Header>
      <Data>
        {isMovie && <Release>개봉일: {params.release_date}</Release>}
        <Overview>{params.overview}</Overview>
        {isLoading && <Loader />}
        {data?.videos?.results?.map((video: any) =>
          video.site === "YouTube" ? (
            <VideoBtn key={video.key} onPress={() => openYTLink(video.key)}>
              <Ionicons
                name="logo-youtube"
                color={isDark ? "white" : BLACK_COLOR}
                size={24}
              />
              <BtnText>{video.name}</BtnText>
            </VideoBtn>
          ) : null
        )}
      </Data>
    </Container>
  );
};

export default Detail;
