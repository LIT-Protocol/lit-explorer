import { useEffect, useState } from "react";
import { useAppContext } from "../Contexts/AppContext"

export default function Stats() {

  const { network } = useAppContext();

  const [stats, setStats] = useState<{
    stats: {
      totalPkps: number;
    }
  }>();

  useEffect(() => {
    if (!network) return;


    if (!stats) {
      // -- (fetch minted pkps)
      fetch(`https://lit-general-worker-staging.onrender.com/${network}/stats`)
        .then((res) => res.json())
        .then((data) => {
          setStats(data);
        });

    }

  })

  return (<>
    {

      <div className="stats">
        {
          !stats ? <>Loading...</> :
            <p><b>{stats.stats.totalPkps}</b> PKPs</p>
        }
      </div>
    }
  </>)
}