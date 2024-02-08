const NetworkBasedMessage = ({
  network,
  type = 'general',
}: {
  network: string,
  type: 'general' | 'capacity-credits'
}) => {
  return (
    <>
      {/* ----- General ----- */}
      {
        type === 'general' && (<>
          {/* -- cayenne -- */}
          {network === 'cayenne' ? <>
            <div className="mt-12 mb-12 info">
              <div>🔥 <strong>Important:</strong> The Cayenne testnet is a centralised public testnet and is not meant for production use. Keys are not persistent and will be deleted. Please use the Cayenne testnet for testing and development purposes only.</div>
            </div>
          </> : ''}
          {/* -- manzano -- */}
          {network === 'manzano' ? <>
            <div className="mt-12 mb-12 info">
              <div>🔥 <strong>Important:</strong> The Manzano testnet is a decentralised public testnet and is not meant for production use as there's no persistency guarantees. Please use the Manzano testnet for testing and development purposes only.</div>
            </div>
          </> : ''}
        </>)
      }

      {/* ----- Capacity Credits NFT ----- */}
      {
        type === 'capacity-credits' && (<>
          {/* -- cayenne -- */}
          {network === 'cayenne' ? <>
            <div className="mt-12 mb-12 info">
              <div>🔥 <strong>Important:</strong> The Cayenne testnet does not have a rate limit system. Please use Manzano (testnet) or Habanero(mainnet) instead.</div>
            </div>
          </> : ''}
        </>)
      }
    </>
  );
}
export default NetworkBasedMessage;