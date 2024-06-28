import { Signer } from "ethers";
import { SupportedNetworks } from "../../../app_config";

export interface ContractProps {
	signer?: Signer;
	contractAddress?: string;
	network?: "datil-dev" | "habanero" | "manzano" | "cayenne";
}
