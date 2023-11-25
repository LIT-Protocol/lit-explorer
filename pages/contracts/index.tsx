import MainLayout from "../../components/Layouts/MainLayout";
import { NextPageWithLayout } from "../_app";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { APP_CONFIG } from "../../app_config";

function createData(name: string, address: string) {
	return { name, address };
}

const rows = [
	createData("AccessControlConditions", APP_CONFIG.ACCS_CONTRACT.ADDRESS),
	createData("LITToken", APP_CONFIG.LIT_TOKEN_CONTRACT.ADDRESS),
	createData("PKPNFT", APP_CONFIG.PKP_NFT_CONTRACT.ADDRESS),
	createData(
		"PubkeyRouterAndPermissions",
		APP_CONFIG.ROUTER_CONTRACT.ADDRESS
	),
	createData("Capacity Credits NFT", APP_CONFIG.RATE_LIMIT_CONTRACT.ADDRESS),
	createData("Multisender", APP_CONFIG.MULTI_SENDER_CONTRACT.ADDRESS),
	createData("Deployer address", APP_CONFIG.DEPLOYER_CONTRACT.ADDRESS),
	createData("Staked node address", APP_CONFIG.STAKED_NODE_CONTRACT.ADDRESS),
];

const ContractsPage: NextPageWithLayout = () => {
	return (
		<>
			<h1>Chronicle Testnet - Lit Protocol</h1>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>
								<b>Smart Contract</b>
							</TableCell>
							<TableCell align="right">
								<b>Address</b>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row) => (
							<TableRow
								key={row.name}
								sx={{
									"&:last-child td, &:last-child th": {
										border: 0,
									},
								}}
							>
								<TableCell component="th" scope="row">
									{row.name}
								</TableCell>
								<TableCell align="right">
									<a
										target="_blank"
										rel="noreferrer"
										href={`${APP_CONFIG.EXPLORER}/address/${row.address}`}
									>
										{row.address}
									</a>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

export default ContractsPage;

ContractsPage.getLayout = function getLayout(page: any) {
	return <MainLayout>{page}</MainLayout>;
};
