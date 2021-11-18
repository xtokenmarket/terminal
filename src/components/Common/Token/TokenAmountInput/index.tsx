import { BigNumber } from "@ethersproject/bignumber";
import { makeStyles, TextField, Typography } from "@material-ui/core";
import clsx from "clsx";
import { TokenIcon } from "components";
import { ethers } from "ethers";
import { useTokenBalance } from "helpers";
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
  token: {
    position: "absolute",
    right: 16,
    top: -6,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  tokenIcon: { width: 32, height: 32, borderRadius: "50%" },
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
  token: IToken;
  value: BigNumber;
  onChange: (_: BigNumber) => void;
}

interface IState {
  amount: string;
}

export const TokenAmountInput = (props: IProps) => {
  const { token, value, onChange } = props;
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { balance } = useTokenBalance(token.address);

  const [state, setState] = useState<IState>({ amount: "" });
  useEffect(() => {
    if (
      !ethers.utils
        .parseUnits(state.amount || "0", token.decimals)
        .eq(props.value)
    ) {
      if (props.value.isZero()) {
        setState((prev) => ({ ...prev, amount: "" }));
      } else {
        setState((prev) => ({
          ...prev,
          amount: ethers.utils.formatUnits(props.value || "0", token.decimals),
        }));
      }
    }
  }, [props.value, state.amount, token.decimals]);

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
            ethers.utils.parseUnits(e.target.value || "0", token.decimals)
          );
        }}
        variant="outlined"
        fullWidth
        type="number"
        label={`${token.symbol.toUpperCase()} amount`}
      />
      <div className={classes.token}>
        <TokenIcon token={token} className={classes.tokenIcon} />
        <span className={classes.tokenLabel}>{token.symbol}</span>
      </div>
      <Typography className={classes.balance}>
        Available -{" "}
        <span>
          {formatBigNumber(balance, token.decimals, 4)} {token.symbol}
        </span>
      </Typography>
    </div>
  );
};
