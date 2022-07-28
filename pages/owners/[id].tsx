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

      const pkps = rawData.data.data?.result.filter((token: any) => token.contractAddress == process.env.NEXT_PUBLIC_PKP_NFT_CONTRACT);

      setOwnersPKPs(pkps);

      // let rows : any = [];

      // pkps?.forEach((pkp: any, i: number) => {
      //   rows.push({
      //     id: i,
      //     contractAddress: pkp.contractAddress
      //   });
      // })

      // setRows(rows);

      setLoading(false)
    })

  }, [id])

  if (isLoading) return <p>Loading...</p>
  if (!rawData) return <p>No profile data</p>

  return (
    <>
    <h2>Raw Data:</h2>
    <DisplayCode code={beautify(rawData, null, 2, 100)} />
    
    <h2>ownersPKPs:</h2>
    <DisplayCode code={beautify(ownersPKPs, null, 2, 100)} />
  
    {/* <DataGrid
      columns={[{ field: 'contractAddress', width: 400 }]}
      rows={rows}
    /> */}

    </>
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