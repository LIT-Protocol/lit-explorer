import { useRouter } from "next/router"
import MainLayout from "../../components/MainLayout"
import { NextPageWithLayout } from "../_app"
import RenderLink from '../../utils/RenderLink';
import LoadData from '../../components/LoadData';
import { solidityIpfsIdToCID } from "../../utils/ipfs/ipfsHashConverter";
import { asyncForEachReturn } from "../../utils/asyncForeach";
import getWeb3Wallet from "../../utils/blockchain/getWeb3Wallet";
import PKPOptionsModal from "../../components/PKPOptionsModal";
import { useState } from "react";

declare global {
  interface Window{
    ethereum?:any
  }
}

const PKPsPageById: NextPageWithLayout = () => {

  const router = useRouter();
  const { id } = router.query;

  if ( ! id ) return <p>Param is not ready</p>

  const [oneOn, setOneOn] = useState(true);
  const [cacheAddress, setCacheAddress] = useState();

  // -- (render) render status
  const renderStatus = () => {
    return <PKPOptionsModal 
      pkpId={id}
      onDone={(userAddress: any) => {
        console.warn("ON DONE!")
        setCacheAddress(userAddress);
        setOneOn(false);

        setTimeout(() => {
          setOneOn(true);
        }, 1000)
      }} 
    />;
  }

  return (
    
    <>
      {
        oneOn ? 
        <LoadData
        key={id.toString()}
        debug={false}
        title="Authorised PKP Controllers:"
        renderStatus={renderStatus()}
        errorMessage="No PKP owners found."
        loadingMessage="Loading authorised PKP controllers..."
        fetchPath={`/api/get-permitted-by-pkp/${id}`}
        filter={(rawData: any) => {
          console.log("on filtered: ", rawData);

          const list = rawData?.data?.addresses;

          if( cacheAddress ){
            list.push(cacheAddress);
          }

          return list;
        } }
        renderCols={(width: number) => {
          return [
            { headerName: "Address", field: "address", width, renderCell: RenderLink}
          ];
    
        } }
        renderRows={(filteredData: any) => {
          return filteredData?.map((item: any, i: number) => {
            return {
              id: i + 1,
              address: item,
            };
          });
        } }    
      /> : 
      ''
      }

      <LoadData
        key={id.toString() + 2}
        debug={false}
        title="Authorised Actions stored on IPFS:"
        errorMessage="No authorised actions found."
        loadingMessage="Loading authorised actions..."
        fetchPath={`/api/get-permitted-by-pkp/${id}`}
        filter={async (rawData: any) => {
          console.log("on filtered: ", rawData);

          const { signer } = await getWeb3Wallet();

          return await asyncForEachReturn(rawData?.data?.actions, async(solidityIpfsId: string) => {
            return await solidityIpfsIdToCID(solidityIpfsId, signer);
          })
        } }
        renderCols={(width: number) => {
          return [
            { headerName: "Address", field: "address", width, renderCell: RenderLink}
          ];
    
        } }
        renderRows={(filteredData: any) => {
          return filteredData?.map((item: any, i: number) => {
            return {
              id: i + 1,
              address: item,
            };
          });
        } }    
        />
    </>
  )
}

export default PKPsPageById

PKPsPageById.getLayout = function getLayout(page: any) {
  return (
    <MainLayout>
      { page }
    </MainLayout>
  )
}