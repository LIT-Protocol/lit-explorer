const throwError = (msg: string, throwError = false) => {
	const globalMessage = document.getElementById(
		"global-message"
	) as HTMLDivElement;

	const globalMessageContent = document.getElementById(
		"global-message-content"
	) as HTMLDivElement;

	globalMessage.style.display = "block";
	globalMessageContent.innerText = msg;

	const displayTime = (msg.length / 1000) * 60 * 1000;

	setTimeout(() => {
		globalMessage.style.display = "none";
		globalMessageContent.innerText = "";
	}, displayTime);

	if (throwError) {
		throw new Error(`${msg}`);
	}
	console.error(`${msg}`);
};

export default throwError;
