const getLatestBlock = async () => {

    const baseURL = process.env.NEXT_PUBLIC_CELO_API_BASE_URL;  

    const latestBlock = await fetch(`${baseURL}?module=block&action=eth_block_number`).then((res) => res.json()).then((data) => parseInt(data.result));
    
    return latestBlock;
}

export default getLatestBlock;