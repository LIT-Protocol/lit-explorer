import { CID } from "multiformats";
import bs58 from "bs58";
import { ethers } from "ethers";

export interface IPFSHash {
  digest: string;
  hashFunction: number;
  size: number;
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
  const digest = "0x" + Buffer.from(cid.multihash.digest).toString("hex");

  let ipfsHash: IPFSHash = {
    digest,
    hashFunction,
    size,
  };

  return ipfsHash;
};

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

/**
 * Partition multihash string into object representing multihash
 *
 * @param {string} multihash A base58 encoded multihash string
 * @returns {Multihash}
 */
export const getBytesFromMultihash = (multihash: string) => {
  const decoded = bs58.decode(multihash);

  return `0x${Buffer.from(decoded).toString("hex")}`;
};

/**
 * 
 * Convert bytes32 to IPFS ID
 * @param { string } byte32 0x1220baa0d1e91f2a22fef53659418ddc3ac92da2a76d994041b86ed62c0c999de477
 * @returns { string } QmZKLGf3vgYsboM7WVUS9X56cJSdLzQVacNp841wmEDRkW
 */
export const getMultihashFromBytes = (byte32: string) : string => {

  const text = byte32.replace('0x', '');

  const hashFunction = parseInt(text.slice(0, 2), 16);
  const digestSize = parseInt(text.slice(2, 4), 16);
  const digest = text.slice(4, 4 + digestSize * 2);

  const multihash = bs58.encode(Buffer.from(`1220${digest}`, 'hex'));

  return multihash;

}

/**
 * Parse Solidity response in array to a Multihash object
 *
 * @param {array} response Response array from Solidity
 * @returns {Multihash} multihash object
 */
export function parseMultihashContractResponse(response: any) {
  const [digest, hashFunction, size] = response;

  let multiHash: IPFSHash = {
    digest,
    hashFunction: parseInt(hashFunction),
    size: parseInt(size),
  };

  return multiHash;
}