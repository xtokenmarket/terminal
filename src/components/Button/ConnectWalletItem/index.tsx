import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";

import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme: any) => ({
  root: {
    height: 50,
    background: theme.colors.transparent,
    borderRadius: 2,
    border: `1px solid ${theme.colors.primary}`,
    "& span": { flex: 1, textAlign: "left" },
    "& img": {
      height: theme.spacing(3.5),
      width: theme.spacing(3.5),
    },
  },
  label: {
    color: theme.colors.primary,
    textTransform: "none",
    fontWeight: 700,
    fontSize: 16,
    lineHeight: "24px",
  },
}));

interface IProps {
  className?: string;
  onClick: () => void;
  disabled?: boolean;
  text: string;
  icon: string;
}

export const ConnectWalletItem = (props: IProps) => {
  const classes = useStyles();
  const { disabled = false, icon, onClick, text } = props;
  return (
    <Button
      className={clsx(classes.root, props.className)}
      disabled={disabled}
      fullWidth
      onClick={onClick}
    >
      <span>{text}</span>

      <img alt="icon" src={icon} />
    </Button>
  );
};
