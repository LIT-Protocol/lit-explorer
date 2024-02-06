import { useEffect, useState } from "react";
import { pub2Addr } from "../../../utils/converter";
import { useAppContext } from "../../Contexts/AppContext";
import Copy from "../../UI/Copy";
import GreenTick from "../../UI/GreenTick";
const { toChecksumAddress } = require("ethereum-checksum-address");

const ETHAddressByPKPId = ({ pkpId }: { pkpId: string | any }) => {
	// -- (app context)
	const { contractsSdk } = useAppContext();

	// -- (state)
	const [address, setAddress] = useState<any>();

	// -- (mounted)
	useEffect(() => {
		// -- validate
		if (!pkpId || contractsSdk === undefined) return;

		(async () => {
			const _pubKey = await contractsSdk.pubkeyRouterContract.read.getPubkey(pkpId);

			const _ethAddress = "0x" + pub2Addr(_pubKey);

			const _checksummedAddress = toChecksumAddress(_ethAddress);

			setAddress(_checksummedAddress);
		})();
	}, [contractsSdk]);

	// -- (validations)
	if (!address) return <>loading...</>;

	return (
		<div className="flex text-sm">
			<div className="flex-content flex">
				<div className="flex-content">ETH Address: {address}</div>
				<GreenTick message="Checksummed" />
			</div>
			<Copy value={address} />
		</div>
	);
};
export default ETHAddressByPKPId;
