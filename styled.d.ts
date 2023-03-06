import "styled-components";

declare module "styled-components/native" {
  export interface DefaultTheme {
    mainBgColor: string;
    textColor: string;
    detailOverviewColor: string;
    titleColor: string;
  }
}
