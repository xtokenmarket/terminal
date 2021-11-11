import { SimpleLoader, HeaderSection, PoolTable } from "components";
import { useMyTerminalPools } from "helpers";

const TerminalMyPoolsPage = () => {
  const { pools: poolAddresses, loading } = useMyTerminalPools();
  return (
    <div>
      <HeaderSection />
      <PoolTable poolAddresses={poolAddresses} />
      {loading && poolAddresses.length === 0 && <SimpleLoader />}
    </div>
  );
};

export default TerminalMyPoolsPage;
