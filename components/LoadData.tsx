import { Alert } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import DisplayCode from "../components/DisplayCode"
import MainLayout from "../components/MainLayout"
import { cacheFetch } from "../utils/cacheFetch"
import getContentWidth from "../utils/getContentWidth"
import RenderLink from "../utils/RenderLink"
import { NextPageWithLayout } from "../pages/_app"

interface LoadDataProps{
    title: string
    errorMessage: string
    fetchPath: string
    debug?: boolean
    filter: Function
    renderCols: Function,
    renderRows: Function,
}

const LoadData = (props: LoadDataProps) => {

  const [rawData, setRawData] = useState(null)
  const [filteredData, setFilteredData] = useState(null)
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [isLoading, setLoading] = useState(false)
  const [debug, setDebug] = useState(props?.debug ?? false);

  useEffect(() => {
    setLoading(true);
    cacheFetch(`${props.fetchPath}`, (rawData: any) => {
      
      // -- set raw data
      setRawData(rawData);
      
      // -- get filtered data
    //   const filtered = rawData.data.result.map((tx: any) => tx.address);
      const filtered = props?.filter ? props.filter(rawData) : rawData;
      setFilteredData(filtered)

      // -- get container width
      const width = getContentWidth();

      // -- set cols
      let cols : any = props.renderCols(width);

      setColumns(cols);

      // -- set rows
      let rows : any = props.renderRows(filtered)

      setRows(rows);
      
      setLoading(false)

    });
  }, [])

  // -- render different states
  if (isLoading) return <p>Loading...</p>
  if (!rawData) return <p>No data found</p>

  return (
    <>
      {
        debug ? 
        <>
          <h2>Raw Data:</h2>
          <DisplayCode code={rawData} />
          <h2>Filtered Data:</h2>
          <DisplayCode code={filteredData} />
        </> : ''
      }

      {
      columns.length > 0 && rows.length > 0 ?
      <>
        <h2>{ props.title }</h2>
        <div id="data-area" style={{ height: 300, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} />
        </div>
      </>
      : <div className='mt-12'>
        <Alert severity="error">{ props.errorMessage }</Alert>
      </div>
    }

    </>

    
  )
}

export default LoadData

// LoadData.getLayout = function getLayout(page: any) {
//   return (
//     <MainLayout>
//       { page }
//     </MainLayout>
//   )
// }