const FAUCET_LINK = 'https://faucet.litprotocol.com/';

export default function FaucetLink() {
  return <div className="mt-12 res-result">
    <div className="center-content">
      Faucet: <a href={FAUCET_LINK} className="center-item" target="_blank" rel="noreferrer">{FAUCET_LINK}</a>
    </div>
  </div>
};