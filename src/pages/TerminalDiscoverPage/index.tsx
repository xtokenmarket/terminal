import { SimpleLoader } from "components";
import { useTerminalPools } from "helpers";
import { HeaderSection, PoolTable } from "./components";

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
