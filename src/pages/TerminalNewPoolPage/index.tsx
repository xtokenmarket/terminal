import { BigNumber } from "@ethersproject/bignumber";
import { Button, Grid, makeStyles, Typography } from "@material-ui/core";
import {
  PageContent,
  PageHeader,
  PageWrapper,
  TokenBalanceInput,
  TokenSelect,
} from "components";
import { NULL_ADDRESS } from "config/constants";
import { useConnectedWeb3Context } from "contexts";
import { useIsMountedRef, useServices } from "helpers";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { IToken } from "types";
import { ZERO } from "utils/number";
import { FeeTierSection } from "./components";

const useStyles = makeStyles((theme) => ({
  label: {
    color: theme.colors.white,
    marginBottom: 16,
  },
  content: { padding: "26px 0" },
}));

interface IState {
  token0?: IToken;
  token1?: IToken;
  tier: BigNumber;
  token0Amount: BigNumber;
  token1Amount: BigNumber;
  uniPoolExist: boolean;
  uniPool: string;
}

const initialState: IState = {
  tier: BigNumber.from(500),
  token0Amount: ZERO,
  token1Amount: ZERO,
  uniPoolExist: false,
  uniPool: "",
};

const TerminalNewPoolPage = () => {
  const history = useHistory();
  const classes = useStyles();

  const [state, setState] = useState<IState>(initialState);
  const { account, networkId, setWalletConnectModalOpened, setTxModalInfo } =
    useConnectedWeb3Context();
  const { lmService } = useServices();

  const mountedRef = useIsMountedRef();

  const onBack = () => {
    history.push("/terminal/discover");
  };

  const loadIfUniPoolExists = async () => {
    if (state.token0 && state.token1) {
      try {
        const uniPoolAddress = await lmService.getPool(
          state.token0.address,
          state.token1.address,
          state.tier
        );
        const isExists = uniPoolAddress !== NULL_ADDRESS;

        if (mountedRef.current === true) {
          setState((prev) => ({
            ...prev,
            uniPoolExist: isExists,
            uniPool: uniPoolAddress,
          }));
        }
      } catch (error) {}
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadIfUniPoolExists, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, [
    state.tier._hex,
    state.token0?.address,
    state.token1?.address,
    networkId,
  ]);

  const onCreateUniPool = async () => {
    if (!account) {
      setWalletConnectModalOpened(true);
      return;
    }
    if (state.token0 && state.token1 && !state.uniPoolExist) {
      try {
        setTxModalInfo(true, "Creating Pool on Uniswap");
        const txId = await lmService.createPool(
          state.token0.address,
          state.token1.address,
          state.tier
        );
        setTxModalInfo(
          true,
          "Creating Pool on Uniswap",
          "Please wait until tx is confirmed",
          txId
        );
        await lmService.waitUntilPoolCreated(
          state.token0.address,
          state.token1.address,
          state.tier
        );

        setTxModalInfo(false);
      } catch (error) {
        console.error(error);
        setTxModalInfo(false);
      }
    }
  };

  return (
    <PageWrapper>
      <PageHeader
        headerTitle="Create new LM pool"
        backVisible
        onBack={onBack}
      />
      <PageContent>
        <div className={classes.content}>
          <div>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography className={classes.label}>Select pair</Typography>
                <TokenSelect
                  token={state.token0}
                  onChange={(token0) =>
                    setState((prev) => ({ ...prev, token0 }))
                  }
                />
                <TokenSelect
                  token={state.token1}
                  onChange={(token1) =>
                    setState((prev) => ({ ...prev, token1 }))
                  }
                />
                <div>
                  <Typography className={classes.label}>
                    Select fee tier
                  </Typography>
                  <FeeTierSection
                    tier={state.tier}
                    onChange={(tier) => setState((prev) => ({ ...prev, tier }))}
                  />
                </div>
                {state.token0 && state.token1 && state.uniPoolExist && (
                  <div>
                    <Typography className={classes.label}>
                      Deposit amounts
                    </Typography>
                    <TokenBalanceInput
                      token={state.token0}
                      value={state.token0Amount}
                      onChange={(token0Amount) =>
                        setState((prev) => ({ ...prev, token0Amount }))
                      }
                    />
                    <TokenBalanceInput
                      token={state.token1}
                      value={state.token1Amount}
                      onChange={(token1Amount) =>
                        setState((prev) => ({ ...prev, token1Amount }))
                      }
                    />
                  </div>
                )}
              </Grid>
              {state.token0 && state.token1 && state.uniPoolExist && (
                <Grid item xs={12} sm={6}>
                  <Typography className={classes.label}>
                    Select fee tier
                  </Typography>
                </Grid>
              )}
            </Grid>
          </div>
          {state.token0 && state.token1 && !state.uniPoolExist && (
            <Button
              color="primary"
              fullWidth
              onClick={onCreateUniPool}
              variant="contained"
            >
              CREATE NEW POOL
            </Button>
          )}
        </div>
      </PageContent>
    </PageWrapper>
  );
};

export default TerminalNewPoolPage;
