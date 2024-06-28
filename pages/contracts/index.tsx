import MainLayout from "../../components/Layouts/MainLayout";
import { NextPageWithLayout } from "../_app";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { useAppContext } from "../../components/Contexts/AppContext";

const DATA_API =
	"https://apis.getlit.dev/network/addresses";

const ContractsPage: NextPageWithLayout = () => {
	const [rows, setRows] = useState([]);
	const { network } = useAppContext();
	const [data, setData] = useState(null);
	const { appConfig } = useAppContext();

	useEffect(() => {
		if (!data) {
			// fetch https://apis.getlit.dev/network/addresses
			(async () => {
				const response = await fetch(DATA_API);
				const data = await response.json();
				setData(data);
			})();
		}
	});

	return (
		<>
			{data && (
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
							{/* @ts-ignore */}
							{data[network]?.map(
								(row: { name: string; address: string }) => (
									<TableRow
										key={row.name}
										sx={{
											"&:last-child td, &:last-child th":
												{
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
												href={`${appConfig.EXPLORER}/address/${row.address}`}
											>
												{row.address}
											</a>
										</TableCell>
									</TableRow>
								)
							)}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</>
	);
};

export default ContractsPage;

ContractsPage.getLayout = function getLayout(page: any) {
	return <MainLayout>{page}</MainLayout>;
};
