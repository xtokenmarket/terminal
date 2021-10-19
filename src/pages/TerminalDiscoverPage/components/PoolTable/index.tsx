import { makeStyles } from "@mui/styles";
import { PoolTableHeader, PoolTableItem } from "..";

const useStyles = makeStyles((theme: any) => ({
  root: {},
}));

interface IProps {
  poolAddresses: string[];
}

export const PoolTable = (props: IProps) => {
  return (
    <div>
      <PoolTableHeader />
      <div>
        {props.poolAddresses.map((address) => (
          <PoolTableItem poolAddress={address} key={address} />
        ))}
      </div>
    </div>
  );
};
