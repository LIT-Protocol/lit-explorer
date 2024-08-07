import { Signer } from "ethers";
import { SupportedNetworks } from "../../../app_config";

export interface ContractProps {
	signer?: Signer;
	contractAddress?: string;
	network?: "datil-dev" | "datil-test" | "habanero" | "manzano" | "cayenne";
}
