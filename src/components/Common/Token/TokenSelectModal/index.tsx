import clsx from "clsx";
import {
  makeStyles,
  CircularProgress,
  Modal,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

import { DEFAULT_NETWORK_ID } from "config/constants";
import {
  commonBaseTokenSymbols,
  getEtherscanUri,
  getToken,
  tokenSymbols,
} from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { transparentize } from "polished";
import React from "react";
import { IToken } from "types";
import { CommonTokens } from "./CommonTokens";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    width: "100vw",
    height: "100vh",
  },
  content: {
    position: "relative",
    outline: "none",
    width: 700,
    maxWidth: "90vw",
    maxHeight: "80vh",
    backgroundColor: theme.colors.primary500,
  },
  topSection: {
    padding: theme.spacing(3),
  },
  tokenList: {
    backgroundColor: theme.colors.seventh,
    padding: theme.spacing(3),
    width: "100%",
  },
  title: {
    fontSize: 20,
    color: theme.colors.white,
    marginBottom: theme.spacing(2),
  },
  close: {
    position: "absolute",
    padding: 12,
    top: 4,
    right: 4,
  },
  searchIcon: {
    color: theme.colors.eighth
  },
  search: {
    border: `1px solid ${theme.colors.purple0}`,
    borderRadius: 4,
    padding: theme.spacing(1),
  },
  commonLabel: {
    color: theme.colors.primary100,
    fontWeight: 700,
    fontSize: 10,
    margin: theme.spacing(3, 0, 1, 0),
  },
  token: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    transition: "all 0.4s",
    "&:hover": { opacity: 0.7 },
    "&+&": {
      marginTop: 20,
    },
    "& img": { width: 32, height: 32, borderRadius: "50%", marginRight: 16 },
    "& div": {
      "& p": {
        color: theme.colors.white,
        fontSize: 18,
        fontWeight: 700,
        margin: 0,
        lineHeight: "14px",
      },
      "& span": {
        color: theme.colors.primary100,
        fontSize: 12,
        fontWeight: 700,
      },
    },
  },
}));

interface IProps {
  className?: string;
  onClose: () => void;
  onSelect: (_: IToken) => void;
  open: boolean;
}

export const TokenSelectModal: React.FC<IProps> = ({
  onSelect,
  onClose,
  open,
  className,
}) => {
  const classes = useStyles();
  const { networkId } = useConnectedWeb3Context();

  return (
    <Modal open={open} onClose={onClose}>
      <div className={clsx(classes.root, className)}>
        <div className={classes.content}>
          <div className={classes.topSection}>
            <Typography className={classes.title}>Select Token</Typography>
            <IconButton className={classes.close} onClick={onClose}>
              <img alt="close" src="/assets/icons/close.svg" />
            </IconButton>
            <div>
              <TextField
                className={classes.search}
                fullWidth
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className={classes.searchIcon} />
                    </InputAdornment>
                  ),
                }}
                variant="standard"
                color="primary"
                placeholder="Search by token name or paste address"
              />
              <Typography className={classes.commonLabel}>
                COMMON BASES
              </Typography>
              <CommonTokens onSelectToken={onSelect} />
            </div>
          </div>
          <div className={classes.tokenList}>
            {tokenSymbols.map((tokenId) => {
              const token = getToken(tokenId as any, networkId);
              return (
                <div
                  className={classes.token}
                  key={token.address}
                  onClick={() => onSelect(token)}
                >
                  <img alt="img" src={token.image || ""} />
                  <div>
                    <p>{token.symbol}</p>
                    <span>{token.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};
