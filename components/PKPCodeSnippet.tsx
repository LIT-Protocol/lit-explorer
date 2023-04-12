import { useEffect, useState } from "react";
import getWeb3Wallet from "../utils/blockchain/getWeb3Wallet";
import MyCard from "./MyCard";
import { RLIContract } from "../utils/blockchain/contracts/RLIContract";
import { Button } from "@mui/material";
import { APP_CONFIG, SupportedNetworks } from "../app_config";
import RLIListByOwner from "./Views/RLIsByOwner";
import { useAppContext } from "./AppContext";
import RLIMint from "./Views/RLIMint";
import { MultiETHFormat } from "../utils/converter";
import { wait } from "../utils/utils";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import Copy from "./UI/Copy";

const PKPCodeSnippet = ({ pkpId }: { pkpId: any }) => {
  // -- validate
  if (!pkpId) return <>'Loading...'</>;

  const codeSnippet = `await LitActions.signEcdsa({
  toSign,
  keyId: "${pkpId}",
  sigName: "sig1",
});`;

  return (
    <>
      <div className="mt-24">
        <MyCard title={"PKP Code Snippet"}>
          <Copy value={codeSnippet} />
          <TextField
            label="Paste this into your project"
            multiline
            rows={5}
            value={codeSnippet}
            fullWidth
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </MyCard>
      </div>
    </>
  );
};
export default PKPCodeSnippet;
