import { makeStyles, Typography } from "@material-ui/core";
import clsx from "clsx";
import { TokenIcon, TokenSelectModal } from "components";
import { useState } from "react";
import { IToken } from "types";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    backgroundColor: theme.colors.primary400,
    height: 80,
    alignItems: "center",
    padding: 16,
    borderRadius: 4,
    marginBottom: 16,
    cursor: "pointer",
    transition: "all 0.4s",
    "&:hover": {
      opacity: 0.7,
    },
  },
  icon: {},
  text: {
    flex: 1,
    marginLeft: 16,
    color: theme.colors.white,
    fontWeight: 700,
  },
  downArrow: {},
}));

interface IProps {
  className?: string;
  token?: IToken;
  onChange: (_?: IToken) => void;
}

interface IState {
  tokenSelectModalVisible: boolean;
}

export const TokenSelect = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({
    tokenSelectModalVisible: false,
  });
  const { token, onChange } = props;

  const setModalVisible = (tokenSelectModalVisible: boolean) =>
    setState((prev) => ({ ...prev, tokenSelectModalVisible }));

  return (
    <>
      <div
        className={clsx(classes.root, props.className)}
        onClick={() => {
          setModalVisible(true);
        }}
      >
        <TokenIcon token={token} />
        <Typography className={classes.text}>
          {token ? token.symbol : "Select token"}
        </Typography>
        <img
          alt="down"
          className={classes.downArrow}
          src="/assets/icons/down-arrow.svg"
        />
      </div>{" "}
      {state.tokenSelectModalVisible && (
        <TokenSelectModal
          onClose={() => setModalVisible(false)}
          onSelect={(token) => {
            onChange(token);
            setModalVisible(false);
          }}
        />
      )}
    </>
  );
};
