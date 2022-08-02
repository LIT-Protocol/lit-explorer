import { Alert } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import DisplayCode from "../components/DisplayCode"
import { cacheFetch } from "../utils/cacheFetch"
import getContentWidth from "../utils/getContentWidth"

interface LoadDataProps{
    title: string
    errorMessage: string
    fetchPath: string
    debug?: boolean
    filter: Function
    renderCols?: Function,
    renderRows?: Function,
    loadingMessage?: string,
    height?: number
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
    console.log("LoadData:", props.fetchPath);
    cacheFetch(`${props.fetchPath}`, async (rawData: any) => {
      
      // -- set raw data
      setRawData(rawData);

      if( ! props?.filter ){
        console.warn("No filtered data.");
        return;
      }
      
      // -- get filtered data
      const filtered = props?.filter ? await props.filter(rawData) : rawData;
      setFilteredData(filtered)

      // -- get container width
      const width = getContentWidth();

      // -- set cols
      if( props.renderCols ){
        let cols : any = props.renderCols(width);
  
        setColumns(cols);
      }

      // -- set rows
      if( props.renderRows ){
        let rows : any = props.renderRows(filtered)
  
        setRows(rows);
      }
      
      setLoading(false)
      

    });
  }, [])

  // -- render different states
  if (isLoading) return <p>{ props?.loadingMessage ?? 'Loading data...' }</p>
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
        <div id="data-area" style={{ height: props.height ?? 300, width: '100%' }}>
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