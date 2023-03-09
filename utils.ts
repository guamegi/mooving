import { InfiniteQueryObserverResult } from "react-query";
import { MovieResponse, TVResponse } from "./api";

export const makeImgPath = (img: string, width: string = "w500") =>
  `https://image.tmdb.org/t/p/${width}${img}`;

export const getNextPage = (currentPage: any) => {
  const nextPage = currentPage.page + 1;
  return nextPage > currentPage.total_pages ? null : nextPage;
};

type MovieFetch = Promise<InfiniteQueryObserverResult<MovieResponse>>;
type TVFetch = Promise<InfiniteQueryObserverResult<TVResponse>>;

export type FetchNext = () => MovieFetch | TVFetch;

export const fetchMore = (
  hasNextPage: boolean | undefined,
  fetchNextPage: FetchNext
) => {
  if (hasNextPage) fetchNextPage();
};

export const fontSizer = (SCREEN_WIDTH: number) => {
  if (SCREEN_WIDTH > 400) {
    return 13;
  } else if (SCREEN_WIDTH > 250) {
    return 12;
  } else {
    return 11;
  }
};

export const appId = {
  android: "ca-app-pub-7307128452071420~3785096483",
  ios: "ca-app-pub-7307128452071420~8785022162",
};
