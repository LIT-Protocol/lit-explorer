import MainLayout from "../../components/Layouts/MainLayout";
import { NextPageWithLayout } from "../_app";
import PKPs from "../../components/Views/PKPs";
import MyDescription from "../../components/UI/MyDescription";
import { useAppContext } from "../../components/Contexts/AppContext";
import PKPsByOwnerAddress from "../../components/Views/PKPsByOwnerAddress";

const ProfilePage: NextPageWithLayout = () => {
  // -- (app context)
  const appContext = useAppContext();

  const renderDescription = () => {
    return (
      <MyDescription
        titleId="profile page - title"
        paragraphs={[{ id: "profile page - p1" }]}
      />
    );
  };

  if (!appContext.web3.ownerAddress) return <></>;

  return (
    <>
      {renderDescription()}
      {/* <PKPs/> */}

      <PKPsByOwnerAddress
        ownerAddress={appContext.web3.ownerAddress}
        options={{
          height: 500,
          title: `Your account: ${appContext.web3.ownerAddress}`,
          loadingMessage: "Finding your PKPs...",
        }}
      />
    </>
  );
};

export default ProfilePage;

ProfilePage.getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>;
};
