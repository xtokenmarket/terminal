import { PageWrapper, PageHeader, PageContent, SimpleLoader } from "components";
import { useTerminalPool } from "helpers";
import { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { ITerminalPool } from "types";
import { isAddress } from "utils/tools";
import { PoolDetailsContent } from "./PoolDetailsContent";

const TerminalPoolDetailsPage = () => {
  const history = useHistory();
  const params = useParams();

  const poolAddress = (params as any).id;

  const { pool: poolData, loading, loadInfo } = useTerminalPool(poolAddress);

  const onBack = () => {
    history.push("/terminal/discover");
  };

  useEffect(() => {
    if (!isAddress(poolAddress)) {
      onBack();
    }
    if (!loading && !poolData) {
      onBack();
    }
  }, [poolAddress, loading, poolData]);

  return (
    <PageWrapper>
      <PageHeader headerTitle=" " backVisible onBack={onBack} />
      <PageContent>
        {isAddress(poolAddress) &&
          (!poolData ? (
            <SimpleLoader />
          ) : (
            <PoolDetailsContent
              poolData={poolData}
              reloadTerminalPool={loadInfo}
            />
          ))}
      </PageContent>
    </PageWrapper>
  );
};

export default TerminalPoolDetailsPage;
