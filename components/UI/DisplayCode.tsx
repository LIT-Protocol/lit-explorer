import MonacoEditor from "@monaco-editor/react";
import beautify from "json-beautify";

interface DisplayCode {
	code: any;
}

const Editor = (props: DisplayCode) => {
	const beautifiedJson = beautify(props.code, null, 2, 100);

	return (
		<MonacoEditor
			language="json"
			value={beautifiedJson}
			theme="vs-dark"
			height="300px"
		/>
	);
};

export default Editor;
