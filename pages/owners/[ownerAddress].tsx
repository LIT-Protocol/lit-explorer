import { useRouter } from "next/router";
import MainLayout from "../../components/Layouts/MainLayout";
import { NextPageWithLayout } from "../_app";
import PKPsByOwnerAddress from "../../components/Views/PKPsByOwnerAddress";
// import { useAppContext } from "../../components/Contexts/AppContext";
// import RLIsByOwnerAddress from "../../components/Views/RLIsByOwnerAddress";

const OwnersPageById: NextPageWithLayout = () => {
	// -- (app context)
	// const { contractsSdk } = useAppContext();

	const router = useRouter();
	const { ownerAddress } = router.query;

	let _ownerAddress: string = ownerAddress as string;

	// -- (validate)
	if (!ownerAddress) return <p>Param is not ready</p>;

	// -- final
	return (
		<>
			<PKPsByOwnerAddress
				ownerAddress={_ownerAddress}
				options={{ height: 500 }}
			/>
			{/* <RLIsByOwnerAddress key={_ownerAddress} ownerAddress={_ownerAddress} /> */}
		</>
	);
};

export default OwnersPageById;

OwnersPageById.getLayout = function getLayout(page: any) {
	return <MainLayout>{page}</MainLayout>;
};
