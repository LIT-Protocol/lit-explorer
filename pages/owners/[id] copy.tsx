import { DataGrid } from '@mui/x-data-grid';

import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import DisplayCode from "../../components/DisplayCode"
import MainLayout from "../../components/MainLayout"
import { cacheFetch } from "../../utils/cacheFetch"
import { NextPageWithLayout } from "../_app"
import { Alert } from '@mui/material';
import RenderDate from '../../utils/RenderDate';
import RenderLink from '../../utils/RenderLink';
import getContentWidth from '../../utils/getContentWidth';

const OwnersPage: NextPageWithLayout = () => {

  const router = useRouter();
  const { id } = router.query;

  const [rawData, setRawData] = useState(null)
  const [filteredData, setFilteredData] = useState(null);
  const [cols, setCols] = useState([]);
  const [rows, setRows] = useState([]);
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {

    // -- variables to wait for before running fetch
    if( ! id ) return;

    setLoading(true);
    cacheFetch(`/api/get-pkps-by-address/${id}`, (rawData: any) => {

      setRawData(rawData)

      // -- extract objects that 
      // 1. transaction's contract address is equal to PKP contract address
      // 2. transaction's to address is equal to query id
      const pkps = rawData.data.result.filter(
        (tx: any) => {
          return tx.contractAddress === process.env.NEXT_PUBLIC_PKP_NFT_CONTRACT && 
          id.toString().toLowerCase() == tx.to.toLowerCase();
        }
      );
      
      setFilteredData(pkps);

      // -- get container width (window width - sidebar width)
      const width = getContentWidth();
      
      // -- set date cols
      let cols : any = [
        { headerName: "Token ID", field: "tokenID", minWidth: width * .5, renderCell: RenderLink},
        { headerName:"Acquired Date", field: "date", minWidth: width * .2, renderCell: RenderDate},
        { headerName:"From", field: "from", minWidth: width * .3},
      ];

      setCols(cols);

      // -- set data row
      let rows = pkps?.map((pkp: any, i: number) => {
        return {
          id: i + 1,
          tokenID: pkp.tokenID,
          date: pkp.timeStamp,
          from: pkp.from,
        };
      })

      setRows(rows);
      setLoading(false)
    }, true)

  }, [id])

  if (isLoading) return <p>Loading...</p>
  if (!rawData) return <p>No profile data</p>

  return (
    <div>
    {/* <h2>Raw Data:</h2>
    <DisplayCode code={rawData} />

    <h2>(Raw) Owner&apos;s PKPs:</h2>
    
    <DisplayCode code={filteredData} /> */}

    
    {
      cols.length > 0 && rows.length > 0 ?
      <>
        <h2>Owner&apos;s PKPs:</h2>
        <div id="data-area" style={{ height: 300, width: '100%' }}>
          <DataGrid rows={rows} columns={cols} />
        </div>
      </>
      : <div className='mt-12'>
        <Alert severity="error">{`No PKPs found in ${id}`}</Alert>
      </div>
    }

    </div>
  )
}

export default OwnersPage

OwnersPage.getLayout = function getLayout(page: any) {
  return (
    <MainLayout>
      { page }
    </MainLayout>
  )
}