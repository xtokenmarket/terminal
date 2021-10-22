import { Theme } from "@material-ui/core/styles/createTheme";

declare module "@material-ui/core/styles/createTheme" {
  interface Theme {
    custom: {
      appHeaderHeight: number;
      desktopNavbarWidth: number;
      tabletNavbarWidth: number;
      maxContentWidth: number;
      smd: number;
      ml: number;
    };
    colors: {
      transparent: string;
      default: string;
      reverse: string;
      white: string;
      black: string;
      primary: string;
      secondary: string;
      third: string;
      fourth: string;
      fifth: string;
      sixth: string;
      seventh: string;
      eighth: string;
      white1: string;
      white2: string;
      white3: string;
      black1: string;
      black2: string;
      black3: string;
      gray1: string;
      gray2: string;
      elevation1: string;
      elevation3: string;
      warn: string;
      gradient1: string;
    };
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    custom: {
      appHeaderHeight: number;
      desktopNavbarWidth: number;
      tabletNavbarWidth: number;
      maxContentWidth: number;
      smd: number;
      ml: number;
    };
    colors: {
      transparent: string;
      default: string;
      reverse: string;
      white: string;
      black: string;
      primary: string;
      secondary: string;
      third: string;
      fourth: string;
      fifth: string;
      sixth: string;
      seventh: string;
      eighth: string;
      white1: string;
      white2: string;
      white3: string;
      black1: string;
      black2: string;
      black3: string;
      gray1: string;
      gray2: string;
      elevation1: string;
      elevation3: string;
      warn: string;
      gradient1: string;
    };
  }
}
