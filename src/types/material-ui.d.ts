import { Theme } from '@material-ui/core/styles/createTheme'

declare module '@material-ui/core/styles/createTheme' {
  interface Theme {
    custom: {
      appHeaderHeight: number
      desktopNavbarWidth: number
      tabletNavbarWidth: number
      maxContentWidth: number
      smd: number
      ml: number
      xss: number
      xsss: number
    }
    colors: {
      yellow: string
      transparent: string
      default: string
      reverse: string
      white: string
      black: string
      primary: string
      primary100: string
      primary200: string
      primary300: string
      primary400: string
      primary500: string
      primary600: string
      primary700: string
      secondary: string
      secondary1: string
      third: string
      purple0: string
      fifth: string
      sixth: string
      seventh: string
      eighth: string
      white1: string
      white2: string
      white3: string
      black1: string
      black2: string
      black3: string
      gray1: string
      gray2: string
      positive: string
      positive1: string
      negative: string
      negative1: string
      elevation1: string
      elevation3: string
      warn: string
      warn1: string
      warn2: string
      gradient1: string
    }
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    custom: {
      appHeaderHeight: number
      desktopNavbarWidth: number
      tabletNavbarWidth: number
      maxContentWidth: number
      smd: number
      ml: number
      xss: number
      xsss: number
    }
    colors: {
      transparent: string
      default: string
      reverse: string
      white: string
      black: string
      primary: string
      primary100: string
      primary200: string
      primary300: string
      primary400: string
      primary500: string
      primary600: string
      primary700: string
      secondary: string
      secondary1: string
      third: string
      purple0: string
      fifth: string
      sixth: string
      seventh: string
      eighth: string
      white1: string
      white2: string
      white3: string
      black1: string
      black2: string
      black3: string
      gray1: string
      gray2: string
      positive: string
      positive1: string
      negative: string
      negative1: string
      elevation1: string
      elevation3: string
      warn: string
      warn1: string
      warn2: string
      gradient1: string
    }
  }
}
