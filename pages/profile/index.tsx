import MainLayout from "../../components/Layouts/MainLayout";
import { NextPageWithLayout } from "../_app";
import MyDescription from "../../components/UI/MyDescription";
import PKPsByOwnerAddress from "../../components/Views/PKPsByOwnerAddress";
import { ROUTES } from "../../app_config";
import { useRouter } from "next/router";
import { Box, Button } from "@mui/material";
import { useAccount } from "wagmi";
import RLIsByOwnerAddress from "../../components/Views/RLIsByOwnerAddress";

const ProfilePage: NextPageWithLayout = () => {
	const { address, isConnected } = useAccount();
	const router = useRouter();

	// const renderButton = () => {
	// 	return (
	// 		<div>
	// 			You don&apos;t have any PKPs yet!
	// 			<Button
	// 				className="ml-12 btn-2"
	// 				onClick={() => router.push(ROUTES.MINT_PKP)}
	// 			>
	// 				Mint one now!
	// 			</Button>
	// 		</div>
	// 	);
	// };

	const renderDescription = () => {
		return (
			<MyDescription
				titleId="profile page - title"
				paragraphs={[{ id: "profile page - p1" }]}
			/>
		);
	};

	if (!isConnected) return <></>;

	return (
		<>
			{renderDescription()}
			{/* <PKPs/> */}

			<PKPsByOwnerAddress
				ownerAddress={address!}
				options={{
					height: 240,
					title: `Your PKP NFTs`,
					loadingMessage: "Finding your PKPs...",
					// errorMessage: renderButton(),
				}}
			/>

			<Box sx={{ m: 4 }} />

			<RLIsByOwnerAddress
				ownerAddress={address!}
				options={{
					height: 240,
					title: `Your Capacity Credits NFTS`,
					loadingMessage: "Finding your Capacity Credits NFTs...",
					// errorMessage: renderButton(),
				}}
			/>
		</>
	);
};

export default ProfilePage;

ProfilePage.getLayout = function getLayout(page: any) {
	return <MainLayout>{page}</MainLayout>;
};
