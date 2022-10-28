import MainLayout from "../../components/Layouts/MainLayout";
import { NextPageWithLayout } from "../_app";
import PKPs from "../../components/Views/PKPs";
import MyDescription from "../../components/UI/MyDescription";
import { useAppContext } from "../../components/Contexts/AppContext";
import PKPsByOwnerAddress from "../../components/Views/PKPsByOwnerAddress";
import { ROUTES } from "../../app_config";
import { useRouter } from "next/router";
import { Button } from "@mui/material";

const ProfilePage: NextPageWithLayout = () => {
  // -- (app context)
  const appContext = useAppContext();
  const router = useRouter();

  const renderButton = () => {
    return (
      <div>
        You don't have any PKPs yet! 
        <Button className="ml-12 btn-2" onClick={() => router.push(ROUTES.MINT_PKP)}>Mint one now!</Button>
      </div>
    );
  };

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
          errorMessage: renderButton(),
        }}
      />
    </>
  );
};

export default ProfilePage;

ProfilePage.getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>;
};
