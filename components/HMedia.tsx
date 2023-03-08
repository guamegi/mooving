import React from "react";
import Poster from "./Poster";
import styled from "styled-components/native";
import Votes from "./Votes";
import { useNavigation } from "@react-navigation/core";
import { Dimensions, TouchableOpacity } from "react-native";
import { Movie } from "../api";
import { fontSizer } from "../utils";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const HMovie = styled.View`
  flex-direction: row;
  padding: 0px 30px;
`;

const HColumn = styled.View`
  margin-left: 15px;
  width: 80%;
`;

const Title = styled.Text`
  color: ${(props) => props.theme.titleColor};
  font-weight: 600;
  margin-top: 7px;
  margin-bottom: 5px;
`;

const Release = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 12px;
  font-weight: 500;
  margin: 10px 0px;
`;

const Overview = styled.Text`
  color: ${(props) => props.theme.textColor};
  opacity: 0.8;
  width: 80%;
  line-height: 16px;
  font-size: ${`${fontSizer(SCREEN_WIDTH)}px`};
`;

interface HMediaProps {
  posterPath: string;
  originalTitle: string;
  overview: string;
  releaseDate?: string;
  voteAverage?: number;
  fullData: Movie;
}

const HMedia: React.FC<HMediaProps> = ({
  posterPath,
  originalTitle,
  overview,
  releaseDate,
  voteAverage,
  fullData,
}) => {
  const navigation = useNavigation();
  const goToDetail = () => {
    // @ts-ignore
    navigation.navigate("Stack", {
      screen: "Detail",
      params: { ...fullData },
    });
  };
  return (
    <TouchableOpacity onPress={goToDetail}>
      <HMovie>
        <Poster path={posterPath} />
        <HColumn>
          <Title>
            {originalTitle.length > 30
              ? `${originalTitle.slice(0, 30)}...`
              : originalTitle}
          </Title>
          {releaseDate ? (
            <Release>
              {new Date(releaseDate).toLocaleDateString("ko", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Release>
          ) : null}
          {voteAverage ? <Votes votes={voteAverage} /> : null}
          <Overview>
            {overview !== "" && overview.length > 122
              ? overview.slice(0, 122) + "..."
              : overview}
          </Overview>
        </HColumn>
      </HMovie>
    </TouchableOpacity>
  );
};

export default HMedia;
