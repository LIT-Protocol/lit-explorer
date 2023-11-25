import MainLayout from "../../components/Layouts/MainLayout";
import { NextPageWithLayout } from "../_app";
import { APP_LINKS } from "../../app_config";
import MyDescription from "../../components/UI/MyDescription";
import FormMintRLI from "../../components/Forms/FormMintRLI";

const GetCapacityCreditsPage: NextPageWithLayout = () => {
	return (
		<>
			<div className="mt-12">
				<MyDescription
					titleId="rlis page - title"
					paragraphs={[
						{ id: "rlis page" },
						{ id: "read more", link: APP_LINKS.WHAT_IS_RLI },
					]}
				/>

				<FormMintRLI />
			</div>
		</>
	);
};

export default GetCapacityCreditsPage;

GetCapacityCreditsPage.getLayout = function getLayout(page: any) {
	return <MainLayout>{page}</MainLayout>;
};
