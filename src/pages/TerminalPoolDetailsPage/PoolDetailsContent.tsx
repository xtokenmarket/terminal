import { BigNumber } from "@ethersproject/bignumber";
import { Button, Grid, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { SimpleLoader } from "components";
import { useConnectedWeb3Context } from "contexts";
import { useIsMountedRef, useServices, useTerminalPool } from "helpers";
import { useEffect, useState } from "react";
import { ERC20Service } from "services";
import { ITerminalPool } from "types";
import { formatToShortNumber } from "utils";
import { ZERO } from "utils/number";
import {
  BalanceSection,
  DepositModal,
  HistorySection,
  InfoSection,
} from "./components";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: { paddingBottom: 32 },
  balance: {
    position: "relative",
    "&+&": {
      "&::before": {
        content: `""`,
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        borderLeft: `1px solid ${theme.colors.primary200}`,
      },
    },
    [theme.breakpoints.down("sm")]: {
      "&+&": {
        "&::before": {
          borderLeft: "none !important",
        },
      },
    },
  },
  info: {
    position: "relative",

    "&::before": {
      content: `""`,
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      border: `1px solid ${theme.colors.primary200}`,
      borderRight: "none",
    },
    "&:first-child": {
      "&::before": { borderLeft: "none" },
    },

    [theme.breakpoints.down("sm")]: {
      "&:nth-child(4)": {
        "&::before": {
          borderLeft: "none",
          borderTop: "none",
        },
      },
      "&:nth-child(5)": {
        "&::before": {
          borderTop: "none",
        },
      },
      "&:nth-child(6)": {
        "&::before": {
          borderTop: "none",
        },
      },
    },
    [theme.breakpoints.down("xs")]: {
      "&:nth-child(3)": {
        "&::before": {
          borderLeft: "none",
          borderTop: "none",
        },
      },
      "&:nth-child(4)": {
        "&::before": {
          borderLeft: `1px solid ${theme.colors.primary200}`,
        },
      },
      "&:nth-child(5)": {
        "&::before": {
          borderLeft: "none",
        },
      },
    },
  },
  tag: {
    padding: "2px 4px 3px",
    height: 19,
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    lineHeight: "14.4px",
    "&.positive": {
      backgroundColor: theme.colors.positive1,
      color: theme.colors.positive,
    },
    "&.negative": {
      backgroundColor: theme.colors.negative1,
      color: theme.colors.negative,
    },
  },
  buttons: {
    marginTop: 24,
    display: "flex",
    flexWrap: "wrap",
    marginLeft: -9,
    marginRight: -9,
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  button: {
    minWidth: 130,
    flex: 1,
    height: 40,
    margin: 9,
    [theme.breakpoints.down("sm")]: {
      maxWidth: 130,
    },
    [theme.breakpoints.down("xs")]: {
      maxWidth: "unset",
    },
  },
}));

interface IProps {
  poolData: ITerminalPool;
  reloadTerminalPool: () => Promise<void>;
}

interface IState {
  stakedTokenBalance: BigNumber;
  depositVisible: boolean;
}

const initialState: IState = {
  stakedTokenBalance: ZERO,
  depositVisible: false,
};

export const PoolDetailsContent = (props: IProps) => {
  const { poolData } = props;
  const [state, setState] = useState<IState>(initialState);
  const classes = useStyles();
  const {
    account,
    library: provider,
    networkId,
    setWalletConnectModalOpened,
  } = useConnectedWeb3Context();
  const { multicall } = useServices();
  const isMountedRef = useIsMountedRef();

  const isPoolOwner = poolData.owner === (account || "").toLowerCase();
  const isDeposited = !state.stakedTokenBalance.isZero();

  const setDepositModalVisible = (depositVisible: boolean) => {
    setState((prev) => ({ ...prev, depositVisible }));
  };

  const loadPersonalInfo = async () => {
    if (!account || !provider) {
      setState((prev) => ({ ...prev, stakedTokenBalance: ZERO }));
      return;
    }
    try {
      const stakedToken = new ERC20Service(
        provider,
        account,
        poolData.stakedToken.address
      );
      const balance = await stakedToken.getBalanceOf(account);
      if (isMountedRef.current === true) {
        setState((prev) => ({ ...prev, stakedTokenBalance: balance }));
      }
    } catch (error) {
      if (isMountedRef.current === true) {
        setState((prev) => ({ ...prev, stakedTokenBalance: ZERO }));
      }
    }
  };

  useEffect(() => {
    loadPersonalInfo();
  }, [account, networkId]);

  return (
    <div className={classes.root}>
      {state.depositVisible && (
        <DepositModal
          onClose={() => setDepositModalVisible(false)}
          poolData={poolData}
        />
      )}
      <div className={classes.content}>
        <div>
          <Grid container spacing={0}>
            <Grid item xs={12} md={6} className={classes.balance}>
              <BalanceSection pool={poolData} token={poolData.token0} />
            </Grid>
            <Grid item xs={12} md={6} className={classes.balance}>
              <BalanceSection pool={poolData} token={poolData.token1} />
            </Grid>
          </Grid>
        </div>
        <div>
          <Grid container spacing={0}>
            <Grid item xs={6} sm={4} md={2} className={classes.info}>
              <InfoSection
                label="TVL"
                value={`$${formatToShortNumber("791,451")}`}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2} className={classes.info}>
              <InfoSection label="VESTING PERIOD" value="6 weeks" />
            </Grid>
            <Grid item xs={6} sm={4} md={2} className={classes.info}>
              <InfoSection label="ENDING" value="Dec 12, 2021" />
            </Grid>
            <Grid item xs={6} sm={4} md={2} className={classes.info}>
              <InfoSection label="APR" value="68%" />
            </Grid>
            <Grid item xs={6} sm={4} md={2} className={classes.info}>
              <InfoSection
                label="VOLUME(24H)"
                value={`$${formatToShortNumber("791")}`}
                right={
                  <span className={clsx(classes.tag, "positive")}>+17.38%</span>
                }
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2} className={classes.info}>
              <InfoSection
                label="VOLUME(7D)"
                value={`$${formatToShortNumber("91451")}`}
                right={
                  <span className={clsx(classes.tag, "negative")}>-13.38%</span>
                }
              />
            </Grid>
          </Grid>
        </div>
        <div className={classes.buttons}>
          <Button
            className={classes.button}
            color="primary"
            onClick={() =>
              account
                ? setDepositModalVisible(true)
                : setWalletConnectModalOpened(true)
            }
            variant="contained"
          >
            DEPOSIT
          </Button>
          <Button
            className={classes.button}
            color="secondary"
            disabled={!isDeposited}
            variant="contained"
          >
            WITHDRAW
          </Button>
          {isDeposited && (
            <Button
              className={classes.button}
              color="secondary"
              variant="contained"
            >
              VEST
            </Button>
          )}
          {isPoolOwner && (
            <Button
              className={classes.button}
              color="secondary"
              variant="contained"
            >
              REWARDS
            </Button>
          )}
          {isPoolOwner && (
            <Button
              className={classes.button}
              color="secondary"
              variant="contained"
            >
              REBALANCE
            </Button>
          )}
        </div>
        <HistorySection pool={poolData} />
      </div>
    </div>
  );
};
