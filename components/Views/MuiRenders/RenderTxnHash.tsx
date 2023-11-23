import { GridRenderCellParams } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { APP_CONFIG, SupportedSearchTypes } from "../../../app_config";
import { AppRouter } from "../../../utils/AppRouter";
import { heyShorty } from "../../../utils/converter";
import Copy from "../../UI/Copy";
import { MyOptions } from "./RenderPKPToAddress";
import { Link } from "@mui/material";

const RenderTxnHash = (props: GridRenderCellParams, options: MyOptions) => {
	const hash = props.row.hash;

	// -- (render)
	const renderValue = (v: string) => {
		return (
			<div className="flex justify-cell">
				<Link
					id={`link-${v}`}
					href={`${APP_CONFIG.EXPLORER}/tx/${v}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					{options?.short ? heyShorty(v) : v}
				</Link>
				{options?.copy ? <Copy value={v} /> : ""}
			</div>
		);
	};

	return <div className="flex justify-cell">{renderValue(hash)}</div>;
};

export default RenderTxnHash;
