import { DataGrid } from "@mui/x-data-grid"
import beautify from "json-beautify"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import DisplayCode from "../../components/DisplayCode"
import MainLayout from "../../components/MainLayout"
import { cacheFetch } from "../../utils/cacheFetch"
import { NextPageWithLayout } from "../_app"

const OwnersPage: NextPageWithLayout = () => {

  const router = useRouter();
  const { id } = router.query;

  const [rawData, setRawData] = useState(null)
  const [ownersPKPs, setOwnersPKPs] = useState(null);
  const [rows, setRows] = useState([]);
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {

    if( ! id ) return;

    setLoading(true);
    cacheFetch(`/api/getPKPsByAddress/${id}`, (rawData: any) => {

      setRawData(rawData)

      const pkps = rawData.data.result.filter((tx: any) => tx.contractAddress === process.env.NEXT_PUBLIC_PKP_NFT_CONTRACT);

      setOwnersPKPs(pkps);

      // let rows : any = [];

      let rows = pkps?.map((pkp: any, i: number) => {
        return {
          id: i,
          tokenId: pkp.tokenID,
          date: pkp.timeStamp,
        };
      })

      setRows(rows);
      setLoading(false)
    }, true)

  }, [id])

  if (isLoading) return <p>Loading...</p>
  if (!rawData) return <p>No profile data</p>
  if (!rows) return <p>Rows not ready</p>

  return (
    <div>
    {/* <h2>Raw Data:</h2>
    <DisplayCode code={beautify(rawData, null, 2, 100)} /> */}

    <h2>(Raw) Owner's PKPs:</h2>
    <DisplayCode code={beautify(ownersPKPs, null, 2, 100)} />

    <h2>Owner's PKPs:</h2>
    <div>
      <ul>
        {
          rows.map((row, i) => {
            return (<li key={i}>
              <div>TokenID: { row["tokenId"]  }</div>
              <div>Date: { parseInt(row["date"])  }</div>
            </li>)
          })
        }

      </ul>

    </div>

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