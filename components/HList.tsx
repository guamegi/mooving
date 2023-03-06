import React from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import { Movie, TV } from "../api";
import { fetchMore, FetchNext } from "../utils";
import VMedia from "./VMedia";

const ListContainer = styled.View`
  margin-bottom: 40px;
`;

const ListTitle = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 18px;
  font-weight: 600;
  margin-left: 30px;
  margin-bottom: 20px;
`;

export const HListSeparator = styled.View`
  width: 20px;
`;

interface HListProps {
  title: string;
  // data: Movie[] | TV[];
  data: any;
  hasNextPage?: boolean;
  fetchNextPage?: FetchNext;
}

const HList: React.FC<HListProps> = ({
  title,
  data,
  hasNextPage,
  fetchNextPage,
}) => {
  return (
    <ListContainer>
      <ListTitle>{title}</ListTitle>
      <FlatList
        data={data}
        onEndReached={() => {
          if (fetchNextPage) {
            fetchMore(hasNextPage, fetchNextPage);
          }
        }}
        onEndReachedThreshold={0.5}
        horizontal
        ItemSeparatorComponent={HListSeparator}
        contentContainerStyle={{ paddingHorizontal: 30 }}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id + ""}
        renderItem={({ item }) => (
          <VMedia
            posterPath={item.poster_path || ""}
            originalTitle={"title" in item ? item.title : item.name}
            voteAverage={item.vote_average}
            fullData={item}
          />
        )}
      />
    </ListContainer>
  );
};
export default HList;
