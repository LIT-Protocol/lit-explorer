import { Button, Divider, Link, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { FormattedMessage } from "react-intl";
import {
	VESUVIUS_APP_CONFIG,
	CHRONICLE_APP_CONFIG,
	ROUTES,
} from "../../app_config";
import { useAppContext } from "../Contexts/AppContext";

const SideNav = () => {
	const router = useRouter();
	const currentRoute = router.pathname;
	const { appConfig } = useAppContext();

	return (
		<>
			{appConfig.NETWORK_LABEL.ENABLED ? (
				<div className="logo-network">
					{appConfig.NETWORK_LABEL.NAME}
				</div>
			) : (
				""
			)}
			<Typography variant="h5" className="title">
				<div className="logo-area">
					<img src="/svg/logo.svg" alt="Lit Protocol" />
					<Link href="/">Lit Explorer</Link>
				</div>
			</Typography>

			<ul className="ul">
				<li>
					<Button
						onClick={() => router.push(ROUTES.PROFILE)}
						className={
							currentRoute.includes(ROUTES.PROFILE)
								? "btn active"
								: "btn"
						}
					>
						<FormattedMessage id="Profile" />
					</Button>
				</li>
			</ul>

			<Divider className="divider" textAlign="left">
				<FormattedMessage id="PKP & Lit Action" />
			</Divider>

			<ul className="ul">
				<li>
					<Button
						onClick={() => router.push(ROUTES.MINT_PKP)}
						className={
							currentRoute.includes(ROUTES.MINT_PKP)
								? "btn active"
								: "btn"
						}
					>
						<FormattedMessage id="Mint New PKP" />
					</Button>
				</li>
				<li>
					<Button
						onClick={() => router.push(ROUTES.CREATE_ACTION)}
						className={
							currentRoute.includes(ROUTES.CREATE_ACTION)
								? "btn active"
								: "btn"
						}
					>
						<FormattedMessage id="Create Action" />
					</Button>
				</li>
				<li>
					<Button
						onClick={() => router.push(ROUTES.GET_CREDITS)}
						className={
							currentRoute.includes(ROUTES.GET_CREDITS)
								? "btn active"
								: "btn"
						}
					>
						<FormattedMessage id="Buy Capacity Credits" />
					</Button>
				</li>
			</ul>

			<Divider className="divider" textAlign="left">
				<FormattedMessage id="Pages" />
			</Divider>
			<ul className="ul">
				{/* PKP Owners */}
				{/* <li>
					<Button
						onClick={() => router.push(ROUTES.OWNERS)}
						className={
							currentRoute.includes(ROUTES.OWNERS)
								? "btn active"
								: "btn"
						}
					>
						<FormattedMessage id="Owners" />
					</Button>
				</li> */}
				{/* <li>
					<Button
						onClick={() => router.push(ROUTES.PKPS)}
						className={
							currentRoute.includes(ROUTES.PKPS)
								? "btn active"
								: "btn"
						}
					>
						<FormattedMessage id="PKPs" />
					</Button>
				</li> */}
				<li>
					<Button
						onClick={() => router.push(ROUTES.ACTIONS)}
						className={
							currentRoute.includes(ROUTES.ACTIONS)
								? "btn active"
								: "btn"
						}
					>
						<FormattedMessage id="Actions" />
					</Button>
				</li>
				{/* <li>
					<Button
						onClick={() => router.push(ROUTES.RLIS)}
						className={
							currentRoute.includes(ROUTES.RLIS)
								? "btn active"
								: "btn"
						}
					>
						<FormattedMessage id="RLIs" />
					</Button>
				</li> */}
			</ul>

			<Divider className="divider" textAlign="left">
				<FormattedMessage id="Other" />
			</Divider>
			<ul className="ul">
				<li>
					<Button
						onClick={() => router.push(ROUTES.CONTRACTS)}
						className={
							currentRoute.includes(ROUTES.CONTRACTS)
								? "btn active"
								: "btn"
						}
					>
						<FormattedMessage id="Contracts" />
					</Button>
				</li>
			</ul>
			<ul className="ul">
				<li>
					<Button
						onClick={() =>
							window.open(
								"https://developer.litprotocol.com",
								"_blank"
							)
						}
						className={
							currentRoute.includes(ROUTES.DOCUMENTATION)
								? "btn active"
								: "btn"
						}
					>
						<FormattedMessage id="Documentation" />
					</Button>
				</li>
			</ul>
		</>
	);
};

export default SideNav;
