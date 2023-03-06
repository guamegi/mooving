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
