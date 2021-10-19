import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";

import clsx from "clsx";
import React from "react";
import { ESort } from "utils/enums";

const useStyles = makeStyles((theme: any) => ({
  root: {
    height: 13,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    border: "none",
    outline: "none",
    backgroundColor: theme.colors.sixth,
  },
  icon: {},
}));

interface IProps {
  className?: string;
  onChange?: (_?: ESort) => void;
  type?: ESort;
}

export const SortButton = (props: IProps) => {
  const classes = useStyles();
  const { onChange, type } = props;
  return (
    <button
      className={clsx(classes.root, props.className)}
      onClick={() => {
        if (!onChange) return;
        if (!type) {
          return onChange(ESort.ASC);
        }
        if (type === ESort.ASC) {
          return onChange(ESort.DESC);
        }
        if (type === ESort.DESC) {
          return onChange();
        }
      }}
    >
      {type !== ESort.DESC && (
        <img alt="up" className={classes.icon} src="/assets/icons/up.svg" />
      )}
      {type !== ESort.ASC && (
        <img alt="down" className={classes.icon} src="/assets/icons/down.svg" />
      )}
    </button>
  );
};
