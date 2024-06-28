import { useAppContext } from "../Contexts/AppContext";

const FAUCET_LINK = "https://faucet.litprotocol.com/";
const DATIL_FACUET = "https://datil-dev-faucet.vercel.app/";

export default function FaucetLink() {
	const { appConfig } = useAppContext();

	const faucetLink =
		appConfig.NETWORK.params.network === "datil-dev"
			? DATIL_FACUET
			: FAUCET_LINK;

	return (
		<div className="mt-12 res-result">
			<div className="center-content">
				Faucet:{" "}
				<a
					href={faucetLink}
					className="center-item"
					target="_blank"
					rel="noreferrer"
				>
					{faucetLink}
				</a>
			</div>
		</div>
	);
}
