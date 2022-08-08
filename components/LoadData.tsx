import { Alert } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import DisplayCode from "../components/DisplayCode"
import { cacheFetch } from "../utils/cacheFetch"
import getContentWidth from "../utils/getContentWidth"

interface LoadDataProps{
    title: string
    errorMessage: string
    fetchPath?: string
    data?: any
    debug?: boolean
    filter: Function
    renderCols?: Function,
    renderRows?: Function,
    loadingMessage?: string,
    height?: number
    renderStatus?: JSX.Element,
    cache?: boolean
}

const LoadData = (props: LoadDataProps) => {

  const [rawData, setRawData] = useState(null)
  const [filteredData, setFilteredData] = useState(null)
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [isLoading, setLoading] = useState(false)
  const [debug, setDebug] = useState(props?.debug ?? false);


  /**
   * Prepare data to render
   */
  const preloadData = async (rawData: any) => {

      console.log("[preloadData] rawData:", rawData);

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
  }

  /**
   * ---------- on mounted ----------
   */
  useEffect(() => {
    setLoading(true);
    console.log("LoadData:", props.fetchPath);

    // -- if fetch path is provided
    if( ! props.data ){
      console.log("--- use fetch ---");
      cacheFetch(`${props.fetchPath}`, async (rawData: any) => {
        preloadData(rawData);
      }, props.cache ?? true);
      return;
    }

    // -- if data is provided already, so didn't have to fetch
    preloadData(props.data);

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
        <div className="flex">
          <h2>{ props.title }</h2>
          {
            props.renderStatus ? 
            <div className="flex-content">
            { props.renderStatus}
            </div> : 
            ''
          }
        </div>
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