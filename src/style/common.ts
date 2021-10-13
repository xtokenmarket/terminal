import { makeStyles } from "@mui/styles";
import { transparentize } from "polished";

const useCommonStyles = makeStyles((theme: any) => ({
  scroll: {
    "&::-webkit-scrollbar": {
      width: theme.spacing(0.5),
      boxShadow: `inset 0 0 6px ${transparentize(0.3, theme.colors.default)}`,
    },
    "&::-webkit-scrollbar-track": {},
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.colors.default,
    },
  },
  scrollHorizontal: {
    "&::-webkit-scrollbar": {
      height: theme.spacing(0.25),
      boxShadow: `inset 0 0 6px ${transparentize(0.3, theme.colors.default)}`,
    },
    "&::-webkit-scrollbar-track": {},
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.colors.default,
    },
  },
  transparentButton: {
    backgroundColor: transparentize(0.9, theme.colors.default),
    borderRadius: theme.spacing(0.75),
    color: theme.colors.default,
    "&:hover": {
      backgroundColor: transparentize(0.5, theme.colors.default),
    },
  },
  textAlignRight: {
    textAlign: "right",
  },
  row: {
    display: "flex",
    alignItems: "center",
  },
  fadeAnimation: {
    transition: "all 1s",
    opacity: 0,
    "&.visible": {
      opacity: 1,
    },
  },
  hideBelowWide: {
    [theme.breakpoints.down("sm")]: {
      display: "none !important",
    },
  },
  showBelowWide: {
    [theme.breakpoints.up("md")]: {
      display: "none !important",
    },
  },
  maxHeightTransition: {
    overflow: "hidden",
    maxHeight: 0,
    transition: "max-height 0.5s cubic-bezier(0, 1, 0, 1)",
    "&.visible": {
      maxHeight: 2000,
      transition: "max-height 1s ease-in-out",
    },
  },
  content: {
    width: "90%",
    margin: "auto",
    maxWidth: theme.custom.maxContentWidth,
    padding: "24px 0",
  },
  heading: {
    color: theme.colors.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  flex: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&.space-between": {
      justifyContent: "space-between",
    },
  },
  textCenter: {
    textAlign: "center",
  },
  fontXL: {
    fontSize: 32,
    [theme.breakpoints.up(theme.custom.ml)]: {
      fontSize: 40,
    },
  },
  hideInputArrow: {
    "&::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "&::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "&:[type=number]": {
      "-moz-appearance": "textfield",
    },
  },
  showUpSmd: {
    [theme.breakpoints.down(theme.custom.smd)]: {
      display: "none",
    },
  },
  showDownSmd: {
    [theme.breakpoints.up(theme.custom.smd)]: {
      display: "none",
    },
  },
  sectionWrapper: {
    boxShadow: theme.colors.elevation3,
    padding: 12,
    borderRadius: 12,
  },
}));

export default useCommonStyles;
