import { useRouter } from "next/router";
import MainLayout from "../../components/Layouts/MainLayout";
import { NextPageWithLayout } from "../_app";
import LoadData from "../../components/ViewModels/LoadData";
import PKPPermittedControllersByPKPId from "../../components/Views/PKPPermittedControllersByPKPId";
import RenderAction from "../../components/Views/MuiRenders/RenderAction";
import MyCard from "../../components/UI/MyCard";
import PubKeyByPKPId from "../../components/Views/Parts/PubKeyByPKPId";
import ETHAddressByPKPId from "../../components/Views/Parts/ETHAddressByPKPId";
import { appendEvenWidths } from "../../utils/mui/mui";
import LitActionsByPKPId from "../../components/Views/LitActionsByPKPId";

declare global {
	interface Window {
		ethereum?: any;
	}
}

const PKPsPageById: NextPageWithLayout = () => {
	const router = useRouter();

	const { pkpId } = router.query;

	if (!pkpId) return <> Loading PKP id...</>;

	return (
		<>
			<MyCard>
				<PubKeyByPKPId pkpId={pkpId} />
				<ETHAddressByPKPId pkpId={pkpId} />
			</MyCard>

			<PKPPermittedControllersByPKPId pkpId={pkpId} />

			<LitActionsByPKPId pkpId={pkpId} />
		</>
	);
};

export default PKPsPageById;

PKPsPageById.getLayout = function getLayout(page: any) {
	return <MainLayout>{page}</MainLayout>;
};
