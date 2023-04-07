import MainLayout from "../../components/Layouts/MainLayout";
import { NextPageWithLayout } from "../_app";
import PKPs from "../../components/Views/PKPs";
import MyDescription from "../../components/UI/MyDescription";

const PKPsPage: NextPageWithLayout = () => {
	const renderDescription = () => {
		return (
			<MyDescription
				titleId="pkps page - title"
				paragraphs={[{ id: "pkps page" }]}
			/>
		);
	};

	return (
		<>
			{renderDescription()}
			<PKPs />
		</>
	);
};

export default PKPsPage;

PKPsPage.getLayout = function getLayout(page: any) {
	return <MainLayout>{page}</MainLayout>;
};
