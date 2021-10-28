import { BigNumber } from "@ethersproject/bignumber";
import { Button, Grid, makeStyles, Typography } from "@material-ui/core";
import {
  PageContent,
  PageHeader,
  PageWrapper,
  TokenAmountInput,
  TokenSelect,
} from "components";
import { useState } from "react";
import { useHistory } from "react-router";
import { IToken } from "types";
import { ZERO } from "utils/number";
import { FeeTierSection } from "./components";

const useStyles = makeStyles((theme) => ({
  label: {
    color: theme.colors.white,
    marginBottom: 16,
  },
}));

interface IState {
  token0?: IToken;
  token1?: IToken;
  tier: number;
  token0Amount: BigNumber;
  token1Amount: BigNumber;
}

const initialState: IState = {
  tier: 0.05,
  token0Amount: ZERO,
  token1Amount: ZERO,
};

const TerminalNewPoolPage = () => {
  const history = useHistory();
  const classes = useStyles();

  const [state, setState] = useState<IState>(initialState);

  const onBack = () => {
    history.push("/terminal/discover");
  };

  return (
    <PageWrapper>
      <PageHeader
        headerTitle="Create new LM pool"
        backVisible
        onBack={onBack}
      />
      <PageContent>
        <div>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography className={classes.label}>Select pair</Typography>
              <TokenSelect
                token={state.token0}
                onChange={(token0) => setState((prev) => ({ ...prev, token0 }))}
              />
              <TokenSelect
                token={state.token1}
                onChange={(token1) => setState((prev) => ({ ...prev, token1 }))}
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
              {state.token0 && state.token1 && (
                <div>
                  <Typography className={classes.label}>
                    Deposit amounts
                  </Typography>
                  <TokenAmountInput
                    token={state.token0}
                    value={state.token0Amount}
                    onChange={(token0Amount) =>
                      setState((prev) => ({ ...prev, token0Amount }))
                    }
                  />
                  <TokenAmountInput
                    token={state.token1}
                    value={state.token1Amount}
                    onChange={(token1Amount) =>
                      setState((prev) => ({ ...prev, token1Amount }))
                    }
                  />
                </div>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography className={classes.label}>Select fee tier</Typography>
            </Grid>
          </Grid>
        </div>
        <Button color="primary" fullWidth variant="contained">
          CREATE NEW POOL
        </Button>
      </PageContent>
    </PageWrapper>
  );
};

export default TerminalNewPoolPage;
