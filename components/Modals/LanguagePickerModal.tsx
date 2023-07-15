import { Box, Chip, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { MODAL_STYLE } from "./_modalStyle";
import { LinearProgressWithLabel } from "../UI/Progress";
import LanguageIcon from "@mui/icons-material/Language";
import MyButton from "../UI/MyButton";

const LanguagePickerModal = ({
	onSelectLanguage,
}: {
	onSelectLanguage?(lang: string): void;
}) => {
	// -- (state)
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	// -- (event) handleClick
	const handleClick = async () => {
		handleOpen();
	};

	// -- (render) modal
	const renderModal = () => {
		if (!onSelectLanguage) return <></>;

		return (
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={MODAL_STYLE}>
					<div className="flex">
						<MyButton onClick={() => onSelectLanguage("ENGLISH")}>
							ENGLISH
						</MyButton>
						<MyButton onClick={() => onSelectLanguage("SPANISH")}>
							Español
						</MyButton>
						<MyButton onClick={() => onSelectLanguage("CHINESE")}>
							中文
						</MyButton>
					</div>
				</Box>
			</Modal>
		);
	};

	// -- (render) button
	const renderButton = () => {
		return (
			<Chip
				onClick={handleClick}
				icon={<LanguageIcon />}
				label="Languages"
			/>
		);
	};

	return (
		<>
			{renderModal()}
			{renderButton()}
		</>
	);
};
export default LanguagePickerModal;
