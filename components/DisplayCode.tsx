import MonacoEditor from '@monaco-editor/react';

interface DisplayCode {
    code: any,
}

const Editor = (props: DisplayCode) => {
    return (
        <MonacoEditor
            language="json"
            value={props.code}
            theme="vs-dark"
            height="300px"
            // wordWrapColumn: 40,
        
            // Set this to false to not auto word wrap minified files
            // wordWrapMinified: true,
        
            // try "same", "indent" or "none"
            // wrappingIndent: 'indent'
        />
    )
}

export default Editor;