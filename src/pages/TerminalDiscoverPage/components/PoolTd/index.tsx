import { makeStyles } from "@mui/styles";
import clsx from "clsx";

const useStyles = makeStyles((theme: any) => ({
  root: {
    "&.pool": { flex: 1 },
    "&.tvl": { width: "10%" },
    "&.vesting": { width: "10%" },
    "&.program": { width: "15%" },
    "&.ending": { width: "15%" },
    "&.apr": { width: "10%" },
    "&+&": { paddingLeft: 16 },
    "&:last-child": {
      textAlign: "right",
    },
  },
}));

interface IProps {
  type: "pool" | "tvl" | "vesting" | "program" | "ending" | "apr";
  children: React.ReactNode | React.ReactNode[];
}

export const PoolTd = (props: IProps) => {
  const classes = useStyles();

  return <div className={clsx(classes.root, props.type)}>{props.children}</div>;
};
