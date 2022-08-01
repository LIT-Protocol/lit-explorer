import { CID } from "multiformats";
import bs58 from 'bs58';
import { ethers } from "ethers";
import getPubkeyRouterAndPermissionsContract from "../blockchain/getPubkeyRouterAndPermissionsContract";


export interface IPFSHash {
    digest: string
    hashFunction: number
    size: number
}

/**
 * Partition multihash string into object representing multihash
 *
 * @param {string} multihash A base58 encoded multihash string
 * @returns {Multihash}
 */
export const getBytes32FromMultihash = (ipfsId: string) => {
    const cid = CID.parse(ipfsId);
    const hashFunction = cid.multihash.code;
    const size = cid.multihash.size;
    const digest = '0x' + Buffer.from(cid.multihash.digest).toString('hex');

    let ipfsHash : IPFSHash = {
        digest,
        hashFunction,
        size
    }

    return ipfsHash
}

  
  /**
   * Encode a multihash structure into base58 encoded multihash string
   *
   * @param { IPFSHash } multihash
   * @returns {(string|null)} base58 encoded multihash string
   */
   export function getIPFSIdFromBytes32(multihash: IPFSHash) {
    
    const { digest, hashFunction, size } = multihash;
    if (size === 0) return null;
  
    // cut off leading "0x"
    let hashBytes: any = Buffer.from(digest?.slice(2), "hex");
  
    // prepend hashFunction and digest size
    const multihashBytes = new hashBytes.constructor(2 + hashBytes.length);
    multihashBytes[0] = hashFunction;
    multihashBytes[1] = size;
    multihashBytes.set(hashBytes, 2);
  
    return bs58.encode(multihashBytes);
  }

  export function ipfsIdToIpfsIdHash(ipfsId: string) {
    const multihashStruct = getBytes32FromMultihash(ipfsId);
    // console.log("multihashStruct", multihashStruct);
    const packed = ethers.utils.solidityPack(
      ["bytes32", "uint8", "uint8"],
      [multihashStruct.digest, multihashStruct.hashFunction, multihashStruct.size]
    );
    return ethers.utils.keccak256(packed);
  }

  /**
 * Parse Solidity response in array to a Multihash object
 *
 * @param {array} response Response array from Solidity
 * @returns {Multihash} multihash object
 */
export function parseMultihashContractResponse(response: any) {
  const [digest, hashFunction, size] = response;

  let multiHash : IPFSHash = {
    digest,
    hashFunction: parseInt(hashFunction),
    size: parseInt(size),
  }

  return multiHash
}

/**
 * Convert "0xb4200a696794b8742fab705a8c065ea6788a76bc6d270c0bc9ad900b6ed74ebc"
 * To "QmUnwHVcaymJWiYGQ6uAHvebGtmZ8S1r9E6BVmJMtuK5WY"
 * 
 * @param { string } solidityIpfsId
 * @return { string } Qmxxx
 */
export const solidityIpfsIdToCID = async (solidityIpfsId: string) => {
  
  const contract = await getPubkeyRouterAndPermissionsContract();
            
  const ipfsRes = await contract.ipfsIds(solidityIpfsId);

  const multiHash = parseMultihashContractResponse(ipfsRes);

  const ipfsId = getIPFSIdFromBytes32(multiHash);

  return ipfsId;
}