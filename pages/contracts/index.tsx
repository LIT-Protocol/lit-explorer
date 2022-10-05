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
  createData('AccessControlConditions', APP_CONFIG.ACCS_CONTRACT_ADDRESS),
  createData('LITToken', APP_CONFIG.LIT_TOKEN_CONTRACT),
  createData('PKPNFT', APP_CONFIG.PKP_NFT_CONTRACT_ADDRESS),
  createData('PubkeyRouterAndPermissions', APP_CONFIG.ROUTER_CONTRACT_ADDRESS),
  createData('Rate Limit Increase NFT', APP_CONFIG.RATE_LIMIT_CONTRACT_ADDRESS),
  createData('Multisender', APP_CONFIG.MULTI_SENDER_CONTRACT),
  createData('Deployer address', APP_CONFIG.DEPLOYER_CONTRACT),
  createData('Staked node address', APP_CONFIG.STAKED_NODE_CONTRACT),
];

const ContractsPage: NextPageWithLayout = () => {

  return (
    <>
        <h1>On Mumbai:</h1>
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
                <a target="_blank" rel="noreferrer" href={`${APP_CONFIG.EXPLORER}${row.address}`}>{row.address}</a>
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