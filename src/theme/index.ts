import { colors, createTheme } from "@material-ui/core";

import _ from "lodash";
import { ETHEME } from "utils/enums";

import CustomColors from "./colors";
import custom from "./custom";
import { softShadows, strongShadows } from "./shadows";
import typography from "./typography";

const baseOptions = {
  typography,
  overrides: {
    MuiLinearProgress: {
      root: {
        borderRadius: 3,
        overflow: "hidden",
      },
    },
    MuiListItemIcon: {
      root: {
        minWidth: 32,
      },
    },
    MuiChip: {
      root: {
        backgroundColor: "rgba(0,0,0,0.075)",
      },
    },
  },
};

const themesOptions = [
  {
    name: ETHEME.Black,
    overrides: {
      MuiInputBase: {
        input: {
          color: "#fff",
          "&::placeholder": {
            opacity: 1,
            color: colors.blueGrey[600],
          },
        },
      },
      MuiButton: {
        root: {
          padding: "12px 16px",
          borderRadius: "4px",
          textTransform: "none",
        },
        containedPrimary: {
          backgroundColor: "#6E27E4",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#6E27E499",
          },
          "&:disabled": {
            color: "#fff3",
          },
        },
        containedSecondary: {
          backgroundColor: "#0000",
          border: `1px solid #543BB8`,
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#0003",
          },
          "&:disabled": {
            color: "#fff3",
          },
        },
        label: {
          fontWeight: 400,
        },
      },
    },
    palette: {
      type: "dark",
      action: {
        active: "#21212188",
        hover: "rgba(255, 255, 255, 0.04)",
        selected: "rgba(255, 255, 255, 0.08)",

        focus: "rgba(255, 255, 255, 0.12)",
      },
      background: {
        default: "#030616",
        dark: "#000",
        paper: "#282C34",
      },
      primary: {
        main: "#FFF",
      },
      secondary: {
        main: "#7B8A95",
      },
      text: {
        primary: "#fff",
        secondary: "#fff",
      },
    },
    shadows: strongShadows,
  },
  {
    name: ETHEME.White,
    overrides: {
      MuiInputBase: {
        input: {
          color: "#fff",
          "&::placeholder": {
            opacity: 1,
            color: colors.blueGrey[600],
          },
        },
      },
      MuiButton: {
        root: {
          padding: "12px 16px",
          borderRadius: "4px",
          textTransform: "none",
        },
        containedPrimary: {
          backgroundColor: "#6E27E4",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#6E27E499",
          },
          "&:disabled": {
            color: "#fff3",
          },
        },
        containedSecondary: {
          backgroundColor: "#0000",
          border: `1px solid #543BB8`,
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#0003",
          },
          "&:disabled": {
            color: "#fff3",
          },
        },
        label: {
          fontWeight: 400,
        },
      },
    },
    palette: {
      type: "light",
      action: {
        active: "#21212188",
        hover: "rgba(255, 255, 255, 0.04)",
        selected: "rgba(255, 255, 255, 0.08)",
        focus: "rgba(255, 255, 255, 0.12)",
      },
      background: {
        default: colors.common.white,
        dark: "#212121",
        paper: colors.common.white,
      },
      primary: {
        main: "#212121",
      },
      secondary: {
        main: "#7B8A95",
      },
      text: {
        primary: colors.blueGrey[900],
        secondary: colors.blueGrey[600],
      },
    },
    shadows: softShadows,
  },
];

export const createGlobalTheme = (themeId: ETHEME) => {
  let themeOptions = themesOptions.find((theme) => theme.name === themeId);
  let customColor = CustomColors.find((element) => element.name === themeId);

  if (!themeOptions) {
    console.warn(new Error(`The theme ${themeId} is not valid`));
    [themeOptions] = themesOptions;
  }
  if (!customColor) {
    console.warn(new Error(`The theme ${themeId} is not valid`));
    [customColor] = CustomColors;
  }

  let theme = createTheme(
    _.merge({}, baseOptions, themeOptions, { custom }, customColor) as any
  );

  return theme;
};
