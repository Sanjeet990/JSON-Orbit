import { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from '../context/ThemeContext';

const TextEditor = ({ value, onChange, language = 'json', hideMinify = false }) => {
    const editorRef = useRef(null);
    const { theme } = useTheme();

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
    };

    const handleEditorChange = (value) => {
        onChange(value);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            onChange(text);
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
        }
    };

    const handleClear = () => {
        onChange('');
    };

    const handleFormat = () => {
        if (language === 'json') {
            try {
                const parsed = JSON.parse(value);
                onChange(JSON.stringify(parsed, null, 2));
                if (editorRef.current) {
                    editorRef.current.getAction('editor.action.formatDocument').run();
                }
            } catch (e) {
                //Consume. No need to show it to user
            }
        } else {
            if (editorRef.current) {
                editorRef.current.getAction('editor.action.formatDocument').run();
            }
        }
    };

    const handleMinify = () => {
        try {
            const parsed = JSON.parse(value);
            onChange(JSON.stringify(parsed));
        } catch (e) {
            // Ignore
        }
    };

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onChange(e.target.result);
            };
            reader.readAsText(file);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([value], { type: language === 'json' ? 'application/json' : 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `file.${language === 'json' ? 'json' : 'toon'}`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleSelectAll = () => {
        if (editorRef.current) {
            editorRef.current.setSelection({
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: editorRef.current.getModel().getLineCount(),
                endColumn: editorRef.current.getModel().getLineMaxColumn(editorRef.current.getModel().getLineCount())
            });
        }
    };

    return (
        <div className="flex flex-col h-full bg-white text-black dark:bg-black dark:text-white">
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex flex-wrap gap-2 items-center dark:bg-[#1e1e1e] dark:border-[#1e1e1e]">
                <button
                    onClick={handleSelectAll}
                    className="px-3 py-1 text-xs font-medium rounded bg-white text-black border border-gray-300 hover:bg-gray-50 dark:bg-gray-900 dark:text-white dark:border-gray-600 dark:hover:bg-[#1e1e1e]"
                >
                    Select All
                </button>
                <button
                    onClick={handleCopy}
                    className="px-3 py-1 text-xs font-medium rounded bg-white text-black border border-gray-300 hover:bg-gray-50 dark:bg-gray-900 dark:text-white dark:border-gray-600 dark:hover:bg-[#1e1e1e]"
                >
                    Copy
                </button>
                <button
                    onClick={handlePaste}
                    className="px-3 py-1 text-xs font-medium rounded bg-white text-black border border-gray-300 hover:bg-gray-50 dark:bg-gray-900 dark:text-white dark:border-gray-600 dark:hover:bg-[#1e1e1e]"
                >
                    Paste
                </button>
                <button
                    onClick={handleClear}
                    className="px-3 py-1 text-xs font-medium rounded bg-white text-black border border-gray-300 hover:bg-gray-50 dark:bg-gray-900 dark:text-white dark:border-gray-600 dark:hover:bg-[#1e1e1e]"
                >
                    Clear
                </button>
                <div className="w-px bg-gray-300 mx-1 h-6 self-center dark:bg-gray-600"></div>
                {!hideMinify && (
                    <>
                        <button
                            onClick={handleFormat}
                            className="px-3 py-1 text-xs font-medium rounded bg-white text-black border border-gray-300 hover:bg-gray-50 dark:bg-gray-900 dark:text-white dark:border-gray-600 dark:hover:bg-[#1e1e1e]"
                        >
                            Beautify
                        </button>
                        <button
                            onClick={handleMinify}
                            className="px-3 py-1 text-xs font-medium rounded bg-white text-black border border-gray-300 hover:bg-gray-50 dark:bg-gray-900 dark:text-white dark:border-gray-600 dark:hover:bg-[#1e1e1e]"
                        >
                            Minify
                        </button>
                    </>
                )}
                {language === 'json' && (
                    <>
                        <input
                            type="file"
                            accept={language === 'json' ? '.json' : '.toon'}
                            onChange={handleUpload}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="px-3 py-1 text-xs font-medium rounded bg-white text-black border border-gray-300 hover:bg-gray-50 dark:bg-gray-900 dark:text-white dark:border-gray-600 dark:hover:bg-[#1e1e1e] cursor-pointer"
                        >
                            Upload
                        </label>
                        <button
                            onClick={handleDownload}
                            className="px-3 py-1 text-xs font-medium rounded bg-white text-black border border-gray-300 hover:bg-gray-50 dark:bg-gray-900 dark:text-white dark:border-gray-600 dark:hover:bg-[#1e1e1e]"
                        >
                            Download
                        </button>
                    </>
                )}
            </div>

            <div className="flex-1 min-h-0 overflow-hidden bg-white text-black dark:bg-black dark:text-white">
                <Editor
                    height="100%"
                    defaultLanguage={language}
                    value={value}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    theme={theme === 'dark' ? 'vs-dark' : 'light'}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        wordWrap: 'on',
                        contextmenu: false,
                        scrollbar: {
                            vertical: 'visible',
                            horizontal: 'visible'
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default TextEditor;
