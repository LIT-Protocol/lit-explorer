import { Alert, Skeleton } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import DisplayCode from "../UI/DisplayCode"
import { cacheFetch } from "../../utils/cacheFetch"
import getContentWidth from "../../utils/getContentWidth"
import { FormattedMessage } from 'react-intl';

interface LoadDataProps{
    title?: string
    errorMessage?: string
    fetchPath?: string
    data?: any
    debug: boolean
    filter: Function
    renderCols?: Function,
    renderRows?: Function,
    loadingMessage?: string,
    height?: number
    renderStatus?: JSX.Element,
    cache?: boolean,
    i18n?: any,
    useData?: boolean
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
    console.log("[LoadData] to fetch:", props.fetchPath);

    // -- if data is provided already, so didn't have to fetch
    if( props?.useData ){
      preloadData(props.data);
      return;
    }

    // -- if fetch path is provided
    if( ! props?.useData){
      console.log("--- use fetch ---");
      cacheFetch(`${props.fetchPath}`, async (rawData: any) => {
        preloadData(rawData);
      }, props.cache ?? true);
      return;
    }

   

  }, [props.data])

  // -- (render)
  const renderi18nTitle = () => {
    return (
      <>
        { 
          props?.i18n?.titleId ? 
          <h2>
            <FormattedMessage id={props?.i18n?.titleId} />
          </h2>
          : 
          <h2>{ props.title }</h2>
        }
      </>
    )
  }

  // -- (render)
  const renderi18nError = () => {
    return (
      <>
        { 
          props?.i18n?.errorMessageId ? 
            <FormattedMessage id={props?.i18n?.errorMessageId} />
          : 
          <>{ props.errorMessage }</>
        }
        
      </>
    )
  }

  // -- (render) loading
  const renderLoading = () => {
    return <>
      {
        props?.i18n?.loadingId ? 
        <h2><FormattedMessage id={props?.i18n?.loadingId} /></h2> : 
        <h2>{ props?.loadingMessage ?? 'Loading...'}</h2>
      }
      <Skeleton height={props.height ?? 332}></Skeleton>
    </>
  }

  // -- render different states
  if (isLoading || ( props.useData && ! props.data)) return renderLoading()
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
          
          { renderi18nTitle() }

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
        <Alert severity="error">
          { renderi18nError() }
        </Alert>
      </div>
    }

    </>

    
  )
}

export default LoadData