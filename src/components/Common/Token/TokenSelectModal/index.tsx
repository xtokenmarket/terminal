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

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    width: 600,
    backgroundColor: theme.colors.primary500,

    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    outline: "none",
    maxHeight: "80vh",
    userSelect: "none",
    overflowY: "auto",
    borderRadius: 4,
  },
  content: { position: "relative", padding: 24 },
  tokenList: { padding: 24, backgroundColor: theme.colors.seventh },
  title: {
    fontSize: 20,
    color: theme.colors.white,
    marginBottom: 16,
  },
  close: { position: "absolute", padding: 12, top: 0, right: 0 },
  searchIcon: { color: theme.colors.eighth },
  search: {
    border: `1px solid ${theme.colors.purple0} `,
    borderRadius: 4,
    padding: "8px 12px ",
  },
  commonLabel: {
    color: theme.colors.primary100,
    fontWeight: 700,
    fontSize: 10,
    marginTop: 24,
    marginBottom: 8,
  },
  commonTokens: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    margin: "0 -4px",
  },
  commonToken: {
    border: `1px solid ${theme.colors.primary200}`,
    padding: 4,
    paddingRight: 12,
    display: "flex",
    alignItems: "center",
    borderRadius: 17,
    margin: 4,
    cursor: "pointer",
    transition: "all 0.4s",
    "&:hover": { opacity: 0.7 },
    "& img": {
      width: 24,
      height: 24,
      borderRadius: "50%",
      marginRight: 8,
    },
    "& span": {
      color: theme.colors.white,
      fontSize: 14,
      fontWeight: 700,
    },
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
}

export const TokenSelectModal = (props: IProps) => {
  const classes = useStyles();
  const { networkId } = useConnectedWeb3Context();
  const { onSelect } = props;

  return (
    <Modal open onClose={props.onClose} disableBackdropClick>
      <div className={clsx(classes.root, props.className)}>
        <div className={classes.content}>
          <Typography className={classes.title}>Select Token</Typography>
          <IconButton className={classes.close} onClick={props.onClose}>
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
            <div className={classes.commonTokens}>
              {commonBaseTokenSymbols.map((tokenId) => {
                const token = getToken(tokenId as any, networkId);
                return (
                  <span
                    className={classes.commonToken}
                    key={token.address}
                    onClick={() => onSelect(token)}
                  >
                    <img alt="img" src={token.image || ""} />
                    <span>{token.symbol}</span>
                  </span>
                );
              })}
            </div>
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
    </Modal>
  );
};
