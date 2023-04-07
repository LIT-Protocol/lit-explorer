import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ROUTES } from "../app_config";
import MainLayout from "../components/Layouts/MainLayout";
import type { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
	const router = useRouter();

	useEffect(() => {
		router.push(ROUTES.MINT_PKP);
	}, []);

	return (
		<div className="mt-12">
			<CircularProgress />
		</div>
	);
};

export default Home;

Home.getLayout = function getLayout(page: any) {
	return <MainLayout>{page}</MainLayout>;
};
