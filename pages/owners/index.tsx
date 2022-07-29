import { Alert } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import DisplayCode from "../../components/DisplayCode"
import LoadData from "../../components/LoadData"
import MainLayout from "../../components/MainLayout"
import RenderLink from "../../utils/RenderLink"
import { NextPageWithLayout } from "../_app"

const OwnersPage: NextPageWithLayout = () => {

  return (
    <>
      <LoadData 
        debug={false}
        title="PKP Owners:"
        errorMessage="No PKP owners found."
        fetchPath={"/api/get-all-pkp-owners"}
        filter={(rawData: any) => {
          return rawData.data.result.map((tx: any) => tx.address);
        }}
        renderCols={(width: any) => {
          return [
            { headerName: "Address", field: 'address', width, renderCell: RenderLink}
          ];
        }}
        renderRows={(filteredData: any) => {
          return filteredData?.map((item: any, i: number) => {
            return {
              id: i + 1,
              address: item,
            }
          });
        }}
      />
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