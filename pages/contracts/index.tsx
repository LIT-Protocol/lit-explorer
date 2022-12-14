import MainLayout from "../../components/Layouts/MainLayout"
import { NextPageWithLayout } from "../_app"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { APP_CONFIG } from "../../app_config";

function createData( name: string, address: string ) {
  return { name, address };
}

const rows = [
  createData('AccessControlConditions', '0x156a99e169aAcaB8Cf5eA87D034664156Af4F0E6'),
  createData('LITToken', '0x8515B6c4Ce073CDEA3BB0C07DBA2B4413c11F97b'),
  createData('PKPNFT', APP_CONFIG.PKP_NFT_CONTRACT_ADDRESS),
  createData('PubkeyRouterAndPermissions', APP_CONFIG.ROUTER_CONTRACT_ADDRESS),
  createData('Rate Limit Increase NFT', APP_CONFIG.RATE_LIMIT_CONTRACT_ADDRESS),
  createData('Multisender', '0xe9e9613881F95987559ab943c539f256E582F839'),
  createData('Deployer address', '0x50e2dac5e78B5905CB09495547452cEE64426db2'),
  createData('Staked node address', '0xdbd360F30097fB6d938dcc8B7b62854B36160B45'),
];

const ContractsPage: NextPageWithLayout = () => {

  return (
    <>
        <h1>On Celo Mainnet</h1>
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><b>Smart Contract</b></TableCell>
            <TableCell align="right"><b>Address</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">
                <a target="_blank" rel="noreferrer" href={`https://celoscan.io/address/${row.address}`}>{row.address}</a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
        </TableContainer>
    </>
  )
}

export default ContractsPage

ContractsPage.getLayout = function getLayout(page: any) {
  return (
    <MainLayout>
      { page }
    </MainLayout>
  )
}