import { useEffect, useState } from "react";
import throwError from "../../utils/throwError";
import { wait } from "../../utils/utils";
import { useAppContext } from "../Contexts/AppContext";
import { MyProgressI } from "./FormInputFields";
import MyButton from "../UI/MyButton";
import MyCard from "../UI/MyCard";
import MyProgress from "../UI/MyProgress";
import SelectionPermittedPKPs from "./SelectionPermittedPKPs";

const FormRevokePermittedAction = ({
	ipfsId,
	onDone,
}: {
	ipfsId: string;
	onDone?(): void;
}) => {
	// -- (app context)
	const { routerContract, pkpPermissionsContract } = useAppContext();

	// -- (state)
	const [isActionRegistered, setIsActionRegisterd] = useState(false);
	const [selectedPKPId, setSelectedPKPId] = useState();
	const [childRefresh, setChildRefresh] = useState(0);
	const [progress, setProgress] = useState<MyProgressI>();

	// -- (mounted)
	useEffect(() => {
		// -- validate
		if (!ipfsId) return;

		// -- refresh
		setChildRefresh((prev) => prev + 1);

		(async () => {
			console.log("[FormRevokePermittedAction] input<ipfsId>:", ipfsId);
			const _isRegistered = await routerContract.read.isActionRegistered(
				ipfsId
			);
			console.log(
				"[FormRevokePermittedAction] output<_isRegistered>:",
				_isRegistered
			);
			setIsActionRegisterd(_isRegistered);
		})();
	}, []);

	// -- (event) when a PKP is selected
	const onSelectPKP = (pkpId: any) => {
		console.log("[onSelectPKP]: input<pkpId>:", pkpId);
		setSelectedPKPId(pkpId);
	};

	// -- (event) on submit
	const onSubmit = async () => {
		// -- prepare input data
		const _pkpId = selectedPKPId;
		const _ipfsId = ipfsId;

		// -- validate
		if (!_pkpId) {
			throwError("You must select a PKP token!");
			return;
		}

		if (!_ipfsId) {
			throwError("_ipfsId cannot be empty!");
			return;
		}

		// -- execute
		setProgress({
			message: `Revoking action from ${_pkpId}...`,
			progress: 50,
		});

		console.log("[onSubmit]: input<_pkpId>:", _pkpId);
		console.log("[onSubmit]: input<_ipfsId>:", _ipfsId);

		let tx: any;

		try {
			tx = await pkpPermissionsContract.write.revokePermittedAction(
				_pkpId,
				_ipfsId
			);
			console.log("[onSubmit]: output<tx>:", tx);
			setProgress({
				message: `Waiting for confirmation...`,
				progress: 75,
			});
			const res = await tx.wait();
			console.log("[onSubmit]: output<res>:", res);

			setProgress({ message: `Done!`, progress: 100 });
			setChildRefresh((prev) => prev + 1);

			await wait(2000);
			setProgress({ message: ``, progress: 0 });

			if (onDone) {
				onDone();
			}
		} catch (e: any) {
			throwError(e.message);
			setProgress({ message: ``, progress: 0 });
			return;
		}
	};

	// -- (render)
	const renderProgress = () => {
		const _progress = progress?.progress || 0;
		const _message = progress?.message || "";

		if (_progress <= 0) return <></>;

		return (
			<div className="mb-24">
				<MyProgress value={_progress} message={_message} />
			</div>
		);
	};

	// -- (render)
	const renderButton = () => {
		const _progress = progress?.progress || 0;

		if (_progress > 0) return <></>;

		return (
			<div className="mt-12 flex">
				<MyButton onClick={onSubmit} className="ml-auto">
					Revoke Permission
				</MyButton>
			</div>
		);
	};

	// -- (render) the selection form
	const renderForm = () => {
		const _progress = progress?.progress || 0;

		if (_progress > 0) return <></>;

		return (
			<SelectionPermittedPKPs
				title="Select your PKP"
				onSelect={onSelectPKP}
				refresh={childRefresh}
				ipfsId={ipfsId}
				onDefaultToken={(defaultToken: any) => {
					setSelectedPKPId(defaultToken);
				}}
			/>
		);
	};

	// -- (render)
	const renderPKPSelectionForm = () => {
		return (
			<div className="mt-24">
				<MyCard title="Revoke permitted action">
					{renderProgress()}

					{renderForm()}

					{renderButton()}
				</MyCard>
			</div>
		);
	};

	// -- (validation)
	if (!ipfsId) return <>ipfsId is not loaded</>;
	if (!isActionRegistered) return <></>;

	return <>{renderPKPSelectionForm()}</>;
};
export default FormRevokePermittedAction;
