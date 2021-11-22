import { Button, makeStyles } from "@material-ui/core";
import { WarningInfo } from "..";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 32,
  },
  button: { height: 48, marginTop: 24 },
}));

interface IProps {
  onNext: () => void;
}

export const InitSection = (props: IProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <WarningInfo
        title="Trade at your own risk!"
        description="xToken Terminal is a permissionless platform. Please do proper due diligence on the token and project before providing liquidity to a pool."
      />

      <Button
        className={classes.button}
        color="primary"
        fullWidth
        onClick={props.onNext}
        variant="contained"
      >
        CONTINUE
      </Button>
    </div>
  );
};
