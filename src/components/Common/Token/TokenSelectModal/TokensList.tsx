import React from "react";
import { makeStyles } from "@material-ui/core";
import { getToken, tokenSymbols } from "config/networks";
import { useConnectedWeb3Context } from "contexts";
import { IToken } from "types";

const useStyles = makeStyles((theme) => ({
  tokensList: {
    backgroundColor: theme.colors.seventh,
    padding: theme.spacing(3),
    width: "100%",
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
  onSelectToken: (_: IToken) => void;
}

export const TokensList: React.FC<IProps> = ({ onSelectToken }) => {
  const cl = useStyles();
  const { networkId } = useConnectedWeb3Context();
  return (
    <div className={cl.tokensList}>
      {tokenSymbols.map((tokenId) => {
        const token = getToken(tokenId as any, networkId);
        return (
          <div
            className={cl.token}
            key={token.address}
            onClick={() => onSelectToken(token)}
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
  );
}