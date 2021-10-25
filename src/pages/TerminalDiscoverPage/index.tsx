import { SimpleLoader, HeaderSection, PoolTable } from "components";
import { useTerminalPools } from "helpers";

const TerminalDiscoverPage = () => {
  const { pools: poolAddresses, loading } = useTerminalPools();
  return (
    <div>
      <HeaderSection />
      <PoolTable poolAddresses={poolAddresses} />
      {loading && poolAddresses.length === 0 && <SimpleLoader />}
    </div>
  );
};

export default TerminalDiscoverPage;
