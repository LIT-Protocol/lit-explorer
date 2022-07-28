const getABI = async (contractAddressHash: string) => {

    const baseURL = process.env.NEXT_PUBLIC_CELO_API_BASE_URL;

    const query = `?module=contract&action=getsourcecode&address=${contractAddressHash}`;

    const data = await fetch(`${baseURL}${query}`)
        .then((res) => res.json())
    
    return data;
}

export default getABI;