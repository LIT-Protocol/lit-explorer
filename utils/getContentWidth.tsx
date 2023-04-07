const getContentWidth = () => {
	return (
		window.innerWidth -
		document.getElementsByClassName("side-wrapper")[0].clientWidth
	);
};

export default getContentWidth;
