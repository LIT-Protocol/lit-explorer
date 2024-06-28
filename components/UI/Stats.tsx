import { useEffect, useState } from "react";
import { useAppContext } from "../Contexts/AppContext";

interface StatsData {
	stats: {
		totalPkps: number;
	};
}

export default function Stats() {
	const { network } = useAppContext();
	const [stats, setStats] = useState<StatsData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!network) return;

		setIsLoading(true);
		fetch(
			`https://lit-general-worker-staging.onrender.com/${network}/stats`
		)
			.then((res) => res.json())
			.then((data: StatsData) => {
				setStats(data);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching stats:", error);
				setIsLoading(false);
			});
	}, [network]);

	return (
		<div className="stats">
			{isLoading ? (
				<p>Loading...</p>
			) : stats && stats.stats ? (
				<p>
					<b>{stats.stats.totalPkps}</b> PKPs
				</p>
			) : (
				<p>No data available</p>
			)}
		</div>
	);
}
