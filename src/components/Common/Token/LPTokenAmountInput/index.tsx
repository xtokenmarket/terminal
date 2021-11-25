import { BigNumber } from "@ethersproject/bignumber";
import { makeStyles, TextField, Typography } from "@material-ui/core";
import clsx from "clsx";
import { TokenIcon } from "components";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import useCommonStyles from "style/common";
import { IToken } from "types";
import { formatBigNumber } from "utils";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: 16,
    position: "relative",
    paddingTop: 10,
  },
  input: {
    "& .Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.colors.white,
        borderWidth: 1,
      },
    },
  },
  inputBox: { paddingRight: 60, fontWeight: 700 },
  inputLabel: { color: `${theme.colors.white} !important` },
  notchedOutline: {
    borderColor: theme.colors.primary200,
  },
  tokens: {
    position: "absolute",
    right: 16,
    top: -6,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  tokenIcons: {
    display: "flex",
    alignItems: "center",
  },
  token: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    "&+&": {
      marginLeft: -12,
      "& img": {
        borderColor: theme.colors.primary500,
      },
    },
  },
  tokenIcon: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: `4px solid ${theme.colors.transparent}`,
  },
  tokenLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: theme.colors.primary100,
    marginTop: 4,
  },
  balance: {
    fontSize: 12,
    color: theme.colors.primary100,
    marginTop: 8,
    textDecoration: "underline",
    "& span": { fontWeight: 700 },
  },
}));

interface IProps {
  className?: string;
  tokens: IToken[];
  lpToken: IToken;
  value: BigNumber;
  onChange: (_: BigNumber) => void;
  max: BigNumber;
}

interface IState {
  amount: string;
}

export const LPTokenAmountInput = (props: IProps) => {
  const { tokens, onChange, lpToken, max } = props;
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const [state, setState] = useState<IState>({ amount: "" });
  useEffect(() => {
    if (
      !ethers.utils
        .parseUnits(state.amount || "0", lpToken.decimals)
        .eq(props.value)
    ) {
      if (props.value.isZero()) {
        setState((prev) => ({ ...prev, amount: "" }));
      } else {
        setState((prev) => ({
          ...prev,
          amount: ethers.utils.formatUnits(
            props.value || "0",
            lpToken.decimals
          ),
        }));
      }
    }
  }, [props.value, state.amount, lpToken.decimals]);

  const lpSymbol = tokens.map((token) => token.symbol.toUpperCase()).join("-");

  return (
    <div className={clsx(classes.root, props.className)}>
      <TextField
        InputLabelProps={{
          className: classes.inputLabel,
        }}
        InputProps={{
          classes: {
            notchedOutline: classes.notchedOutline,
            input: clsx(commonClasses.hideInputArrow, classes.inputBox),
          },
        }}
        className={classes.input}
        value={state.amount}
        onChange={(e) => {
          if (Number(e.target.value) < 0) return;
          setState((prev) => ({ ...prev, amount: e.target.value }));
          onChange(
            ethers.utils.parseUnits(e.target.value || "0", lpToken.decimals)
          );
        }}
        variant="outlined"
        fullWidth
        type="number"
        label={`LP amount`}
      />
      <div className={classes.tokens}>
        <div className={classes.tokenIcons}>
          {tokens.map((token) => (
            <div className={classes.token} key={token.address}>
              <TokenIcon token={token} className={classes.tokenIcon} />
            </div>
          ))}
        </div>

        <span className={classes.tokenLabel}>
          {tokens.map((token) => token.symbol).join("/")}
        </span>
      </div>
      <Typography className={classes.balance}>
        Available -{" "}
        <span>
          {formatBigNumber(max, lpToken.decimals, 4)} {lpSymbol}
        </span>
      </Typography>
    </div>
  );
};
