import { APP_CONFIG, SupportedNetworks } from "../app_config";
import { getABI, getContractFromAppConfig } from "../utils/blockchain/contracts/getContract";

// write an interface for globalThis
declare global {
    interface Window {
        test: any;
    }
}

const tests = () => {
  return (
    <>
      {/* ---------- */}
      <button
        onClick={async () => {
          const ABI = await getABI({
            network: SupportedNetworks.MUMBAI_TESTNET,
            contractAddress: APP_CONFIG.PKP_NFT_CONTRACT.ADDRESS,
          });

          console.log("ABI:", ABI);
        }}
      >
        getMumbaiPkpNftContractABI
      </button>

      {/* ---------- */}
      <button onClick={async () => {

        const contract = getContractFromAppConfig("1");

        
        console.log(contract);

        
      }}>
        TEST
      </button>
    </>
  );
};
export default tests;
