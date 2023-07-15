import { Chip, CircularProgress, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppContext } from "../Contexts/AppContext";
import { MyProgressI } from "./FormInputFields";
import ButtonTx from "../ViewModels/ButtonTx";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import throwError from "../../utils/throwError";

const ButtonActionRegisterByIPFSId = (props: {
	ipfsId: string | any;
	defaultButton?: boolean;
	onDone?(): void;
}) => {
	// -- (app context)
	const { routerContract } = useAppContext();

	const [isRegistered, setIsRegistered] = useState<boolean | any>(null);

	// -- (mounted)
	useEffect(() => {
		(async () => {
			await checkIsRegistered();
		})();
	}, []);

	// -- (void) check is registered
	const checkIsRegistered = async () => {
		const _isRegistered = await routerContract.read.isActionRegistered(
			props.ipfsId
		);
		console.log("[checkIsRegistered] _isRegistered:", _isRegistered);
		setIsRegistered(_isRegistered);
	};

	// -- (event) update UI based on progress
	const onProgress = async (progress: MyProgressI) => {
		const _progress = progress.progress || 0;

		console.log("_progress:", _progress);

		if (_progress >= 100 && props.onDone) {
			console.warn("[onProgress]: DONE!");
			props.onDone();
		}

		if (_progress >= 0) {
			await checkIsRegistered();
		}
	};

	// -- (validations) if param doesnt have ipfsId
	if (!props?.ipfsId) return <></>;
	if (isRegistered == null)
		return (
			<>
				<div className="sm">
					<CircularProgress disableShrink />
				</div>
			</>
		);

	// -- (render) registerd
	const renderRegistered = () => {
		return (
			<>
				<Chip label={"Registered"} color={"success"} />
			</>
		);
	};

	// -- (render) not registered
	const renderNotReigstered = () => {
		return (
			<ButtonTx
				defaultButton={props?.defaultButton ?? false}
				icon={<AppRegistrationIcon />}
				labels={{
					default: "Click to register",
					executing: "Registering action...",
				}}
				transaction={async () =>
					await routerContract.write.registerAction(props.ipfsId)
				}
				onProgress={onProgress}
				onError={function (e: any): void {
					throwError(e.message);
					return;
				}}
			/>
		);
	};

	// -- finally
	return (
		<Stack direction="row" spacing={1}>
			{isRegistered ? renderRegistered() : renderNotReigstered()}
		</Stack>
	);
};

export default ButtonActionRegisterByIPFSId;
