import { APP_CONFIG, DEPLOYED_CONTRACTS, SupportedNetworks } from "../app_config";
import { getABI } from "../utils/blockchain/contracts/getContract";

const tests = () => {
  return (
    <>
      {/* ---------- */}
      <button
        onClick={async () => {
          const ABI = await getABI({
            network: SupportedNetworks.MUMBAI_TESTNET,
            contractAddress: APP_CONFIG.PKP_NFT_CONTRACT_ADDRESS,
          });

          console.log("ABI:", ABI);
        }}
      >
        getMumbaiPkpNftContractABI
      </button>

      {/* ---------- */}
      <button onClick={async () => {

        console.log(DEPLOYED_CONTRACTS);
        
      }}>
        get deployed contracts JSON
      </button>
    </>
  );
};
export default tests;
