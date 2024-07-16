import { useAppContext } from "../Contexts/AppContext";

const CHRONICLE_FAUCET = "https://faucet.litprotocol.com/";
const CHRONICLE_VESUVIUS_FACUET =
	"https://chronicle-vesuvius-faucet.getlit.dev/";

export default function FaucetLink() {
	const { appConfig } = useAppContext();

	const faucetLink =
		appConfig.NETWORK.params.network === "datil-dev" ||
		appConfig.NETWORK.params.network === "datil-test"
			? CHRONICLE_VESUVIUS_FACUET
			: CHRONICLE_FAUCET;

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
