import MonacoEditor from "@monaco-editor/react";
import {
	Alert,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { APP_LINKS, DEFAULT_LIT_ACTION } from "../../app_config";
import MainLayout from "../../components/Layouts/MainLayout";
import MyCard from "../../components/UI/MyCard";
import MyDescription from "../../components/UI/MyDescription";
import MyProgress from "../../components/UI/MyProgress";
import { AppRouter } from "../../utils/AppRouter";
import { preventPageLeave } from "../../utils/utils";
import { NextPageWithLayout } from "../_app";

const API =
	"https://apis.getlit.dev/lit-action/examples";

const CreateAction: NextPageWithLayout = () => {
	const router = useRouter();

	// -- (state)
	const [code, setCode] = useState(DEFAULT_LIT_ACTION);
	const [msg, setMsg] = useState("Loading...");
	const [progress, setProgress] = useState(0);
	const [ipfsId, setIpfsId] = useState<string | any>();
	const [completed, setCompleted] = useState(false);
	const [demoIndex, setDemoIndex] = useState(8);
	const [examples, setExamples] = useState<any[] | any>();
	const [exampleIndex, setExampleIndex] = useState(0);

	useEffect(() => {
		if (!examples) {
			fetch(API).then(async (res) => {
				const data = (await res.json()).data;
				setExamples(data);
			});
		}
	});

	/**
	 * When code is being edited
	 * @param code
	 */
	const onEdit = (code: any) => {
		setCode(code);
	};

	/**
	 * (event) Upload the code to IPFS
	 */
	const handleUpload = async () => {
		preventPageLeave();

		setProgress(20);
		setMsg("Uploading to IPFS & pinning...");

		const res = await fetch("/api/pinata/upload", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ code }),
		});

		const ipfsData = await res.json();

		console.log("ipfsData:", ipfsData);

		const cid = ipfsData.IpfsHash;

		// console.log("ipfsData:", ipfsData)
		// return;

		// setProgress(20);
		// setMsg('Uploading to IPFS...');
		// console.warn("Uploading to IPFS");
		// const ipfsData = await uploadToIPFS(code);
		// console.log("[handleUpload] ipfsData:", ipfsData)

		// wait for 2 seconds
		await new Promise((resolve) => setTimeout(resolve, 2000));
		// setProgress(40);
		// setMsg('Requesting data to be pinned...');
		// console.warn("Pinning data");
		// const data = await fetch(`/api/pinata/${ipfsData.path}`).then((res) => res.json());
		// console.log("[handleUpload] data:", data);

		setProgress(60);
		setMsg("Data uploaded! waiting for it to be pinned...");
		console.log("cid:", cid);
		setIpfsId(cid);

		// const isPinned = await tryUntil({
		//   onlyIf: async () => (await fetch(`${APP_CONFIG.IPFS_PATH}/${data.data.ipfsHash}`)).status !== 404,
		//   thenRun: async () => true,
		//   onTrying: (counter: number) => {
		setCompleted(true);
		//     setProgress(60 + counter);
		//     setMsg(`Pinning...`);
		//   },
		//   onError: (_: any) => {
		//     throwError("Failed to check the pinning status, maybe check again in 5 mins");
		//     return;
		//   },
		//   max: 40,
		//   interval: 3000,
		// })

		// console.log("[handleUpload] isPinned:", isPinned);

		setMsg("Done!");
		setProgress(100);
		preventPageLeave({ reset: true });
	};

	/**
	 * (render) render progress UI
	 */
	const renderProgress = () => {
		// -- validate
		if (progress <= 0 || progress >= 100) return <></>;

		// -- finally
		return <MyProgress value={progress} message={msg} />;
	};

	/*
	 * (render) render lit action demo select
	 */
	const renderDemoSelect = () => {
		return (
			<FormControl fullWidth>
				<InputLabel id="demo-simple-select-label">
					Select Example
				</InputLabel>

				{examples && examples[exampleIndex]?.file && (
					<>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={exampleIndex}
							label="Select Example"
							onChange={(e) => {
								// @ts-ignore
								setExampleIndex(e.target.value);
								setCode(examples[e.target.value]?.content);
							}}
						>
							{examples.map(
								(
									item: { file: string; content: string },
									key: string
								) => {
									return (
										<MenuItem key={key} value={key}>
											{item.file}
										</MenuItem>
									);
								}
							)}
						</Select>
					</>
				)}
			</FormControl>
		);
	};

	/**
	 * (render) render post upload
	 */
	const renderPostUpload = () => {
		// (inner event) handleViewCode
		const _handleViewCode = () => {
			const page = AppRouter.getPage(ipfsId);
			router.push(page);
		};

		// (inner render) render status
		const _renderStatus = () => {
			if (progress < 100) return "";
			return (
				<Alert severity="success">Successfully uploaded to IPFS!</Alert>
			);
		};

		// (inner render) render view code button
		const _renderViewCodeButton = () => {
			if (progress < 100)
				return (
					<Button disabled className="btn-2 ml-auto">
						View Code
					</Button>
				);

			return (
				<Button onClick={_handleViewCode} className="btn-2 ml-auto">
					View Code
				</Button>
			);
		};

		// -- validate
		if (!completed) return <></>;

		// -- finally
		return (
			<MyCard className="mt-12">
				{_renderStatus()}

				<TextField
					className="mt-12 textfield"
					fullWidth
					label="IPFS ID"
					value={ipfsId}
				/>
				<div className="mt-12 flex">
					<div className="ml-auto flex">
						{_renderViewCodeButton()}
					</div>
				</div>
			</MyCard>
		);
	};

	/**
	 * (render) render content
	 */
	const renderContent = () => {
		return (
			<>
				<h1>Create Action</h1>

				<div className="flex">
					<div className="mr-12 w-240 mt-12">
						{renderDemoSelect()}
					</div>

					<div className="code-editor mt-12 width-full">
						<MonacoEditor
							language="javascript"
							onChange={(code) => onEdit(code)}
							value={code}
							theme="vs-dark"
							height="300px"
						/>
					</div>
				</div>
				<div className="mt-12 flex">
					<Button onClick={handleUpload} className="btn-2 ml-auto">
						Upload to IPFS
					</Button>
				</div>
			</>
		);
	};

	const renderDescription = () => {
		return (
			<MyDescription
				titleId="what are lit actions - title"
				paragraphs={[
					{ id: "what are lit actions" },
					{
						id: "read more",
						link: APP_LINKS.WORKING_WITH_LIT_ACTIONS,
					},
				]}
			/>
		);
	};

	// (validations)

	return (
		<>
			{renderDescription()}
			{renderProgress()}
			{renderPostUpload()}
			{renderContent()}
		</>
	);
};

export default CreateAction;

CreateAction.getLayout = function getLayout(page: any) {
	return <MainLayout>{page}</MainLayout>;
};
