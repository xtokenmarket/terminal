import { PageWrapper, PageHeader, PageContent } from "components";
import { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { isAddress } from "utils/tools";
import { PoolDetailsContent } from "./PoolDetailsContent";

const TerminalPoolDetailsPage = () => {
  const history = useHistory();
  const params = useParams();

  const poolAddress = (params as any).id;

  const onBack = () => {
    history.push("/terminal/discover");
  };

  useEffect(() => {
    if (!isAddress(poolAddress)) {
      onBack();
    }
  }, [poolAddress]);

  return (
    <PageWrapper>
      <PageHeader headerTitle=" " backVisible onBack={onBack} />
      <PageContent>
        {isAddress(poolAddress) && (
          <PoolDetailsContent poolAddress={poolAddress} />
        )}
      </PageContent>
    </PageWrapper>
  );
};

export default TerminalPoolDetailsPage;
