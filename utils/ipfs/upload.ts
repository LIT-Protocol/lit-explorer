import * as IPFS from 'ipfs-core'

interface IPFSData {
    path: string,
    url: string,
}
/**
   * 
   * Upload code to IPFS
   * 
   * @example
   * ```
   const code = `
      const go = async () => {
          const sigShare = await LitActions.signEcdsa({ toSign, keyId, sigName });
      };
      go();
  `;

  const ipfsData  = await uploadToIPFS(code);
  console.log("ipfsData:", ipfsData);
  ```
  * 
  * @param { string } code
  * @returns { IPFSData } 
  */
  const uploadToIPFS = async (code: string) : Promise<IPFSData> => {
  
      const ipfs = await IPFS.create({repo: 'ok' + Math.random()})
  
      const { path } = await ipfs.add(code)
  
      const data : IPFSData = {
          path: path,
          url: `https://ipfs.litgateway.com/ipfs/${path}`,
      };
  
      console.log("[uploadToIPFS] data: ", data);
  
      return data
  
  }

  export default uploadToIPFS;