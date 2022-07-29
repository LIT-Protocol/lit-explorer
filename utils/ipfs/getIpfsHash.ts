import { CID } from "multiformats";

export interface IPFSHash {
    digest: string
    hashFunction: number
    size: number
}

const getIPFSHash = (ipfsId: string) => {
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

export default getIPFSHash;