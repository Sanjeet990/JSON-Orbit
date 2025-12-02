import { useState, useEffect, useRef } from 'react';
import TextEditor from './TextEditor';
import JsonViewer from './JsonViewer';
import JsonMap from './JsonMap';
import { toToon, fromToon } from '../utils/toon';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu } from 'lucide-react';

const Layout = ({ children }) => {
    const tabs = [
        { key: 'viewer', name: 'Viewer' },
        { key: 'map', name: 'Map' },
        { key: 'text', name: 'JSON Text' },
        { key: 'toon', name: 'TOON Text' }
    ];

    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('text');
    const [jsonInput, setJsonInput] = useState("");
    const [toonInput, setToonInput] = useState('');
    const [parsedJson, setParsedJson] = useState(null);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const detectJson = (str) => {
        const trimmed = str.trim();
        return trimmed.startsWith('{') || trimmed.startsWith('[');
    };

    const detectToon = (str) => {
        const trimmed = str.trim();
        if (detectJson(trimmed)) return false;
        return fromToon(trimmed) !== null;
    };

    const isValidJsonStructure = (str) => {
        if (!str || typeof str !== 'string') return false;
        try {
            const parsed = JSON.parse(str.trim());
            return typeof parsed === 'object' && parsed !== null;
        } catch {
            return false;
        }
    };

    const isEmpty = (str) => !str || str.trim() === '';

    const showModalWithMessage = (message) => {
        setModalMessage(message);
        setShowModal(true);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showDropdown]);

    useEffect(() => {
        if (isEmpty(jsonInput)) return;

        try {
            const parsed = JSON.parse(jsonInput);
            setParsedJson(parsed);
            setToonInput(toToon(parsed));
            setError(null);
        } catch (e) {
            setError(e.message);
        }
    }, []);

    const handleJsonChange = (value) => {
        setJsonInput(value);

        if (isEmpty(value)) {
            setToonInput('');
            setParsedJson(null);
            setError('Empty input');
            return;
        }

        if (detectToon(value)) {
            const parsed = fromToon(value);
            if (parsed !== null) {
                const jsonStr = JSON.stringify(parsed, null, 2);
                setJsonInput(jsonStr);
                setParsedJson(parsed);
                setToonInput(value);
                setError(null);
                showModalWithMessage('TOON format detected, auto converted to JSON.');
                return;
            }
        }

        try {
            const parsed = JSON.parse(value);
            setParsedJson(parsed);
            setToonInput(toToon(parsed));
            setError(null);
        } catch (e) {
            setError(e.message);
        }
    };

    const handleToonChange = (value) => {
        setToonInput(value);

        if (isEmpty(value)) {
            setJsonInput('');
            setParsedJson(null);
            setError('Empty input');
            return;
        }

        if (detectJson(value)) {
            try {
                const parsed = JSON.parse(value);
                const toonStr = toToon(parsed);
                setToonInput(toonStr);
                setJsonInput(value);
                setParsedJson(parsed);
                setError(null);
                showModalWithMessage('JSON format detected, auto converted to TOON.');
                return;
            } catch {
                //Consume it and continue to TOON parsing
            }
        }

        const parsed = fromToon(value);
        if (parsed !== null) {
            setParsedJson(parsed);
            setJsonInput(JSON.stringify(parsed, null, 2));
            setError(null);
        } else {
            setError('Invalid TOON format');
        }
    };

    const validateTabSwitch = (newTab) => {
        const isViewerOrMap = newTab === 'viewer' || newTab === 'map';
        const hasNoData = isEmpty(jsonInput) && isEmpty(toonInput);

        if (isViewerOrMap) {
            if (hasNoData) {
                showModalWithMessage('No data available to view. Please enter JSON or TOON text first.');
                return false;
            }
            if (!isValidJsonStructure(jsonInput)) {
                showModalWithMessage('Invalid JSON data. Please check your input.');
                return false;
            }
        }

        if (activeTab === 'text' && newTab !== 'toon') {
            if (isEmpty(jsonInput)) {
                showModalWithMessage('JSON text is empty.');
                return false;
            }
            try {
                JSON.parse(jsonInput);
            } catch {
                showModalWithMessage('JSON text is invalid.');
                return false;
            }
        }

        if (activeTab === 'toon') {

            if (detectJson(toonInput)) {
                try {
                    const parsed = JSON.parse(toonInput);
                    const converted = toToon(parsed);
                    setToonInput(converted);
                    setParsedJson(parsed);
                    setJsonInput(JSON.stringify(parsed, null, 2));
                    setError(null);
                    showModalWithMessage('JSON format detected, auto converted to TOON.');
                    return false;
                } catch {
                    //Consume it and continue to TOON parsing
                }
            }

            if (!isEmpty(toonInput)) {
                const parsed = fromToon(toonInput);
                if (parsed !== null) {
                    setParsedJson(parsed);
                    setJsonInput(JSON.stringify(parsed, null, 2));
                    setError(null);
                } else {
                    showModalWithMessage('TOON text is invalid.');
                    return false;
                }
            }
        }

        return true;
    };

    const handleTabChange = (newTab) => {
        if (activeTab === newTab) return;

        if (validateTabSwitch(newTab)) {
            setActiveTab(newTab);
            setShowDropdown(false);
        }
    };

    const renderTabButton = (tabKey, tabName, isMobile = false) => {
        const isActive = activeTab === tabKey;
        const baseClasses = isMobile
            ? 'block w-full text-left px-4 py-2.5 text-sm font-medium transition-colors'
            : 'px-4 py-1.5 text-sm font-medium rounded-md transition-colors';

        const activeClasses = isMobile
            ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
            : 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm';

        const inactiveClasses = isMobile
            ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600';

        return (
            <button
                key={tabKey}
                onClick={() => handleTabChange(tabKey)}
                className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
            >
                {tabName}
            </button>
        );
    };

    const currentTab = tabs.find(tab => tab.key === activeTab);
    const hasValidData = parsedJson !== null;

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between shadow-sm">
                <div className="hidden md:flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                    {tabs.map(tab => renderTabButton(tab.key, tab.name))}
                </div>

                <div className="md:hidden relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center space-x-2 px-4 py-1.5 text-sm font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        <Menu size={18} />
                        <span>{currentTab?.name}</span>
                    </button>
                    {showDropdown && (
                        <div className="absolute left-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                            {tabs.map(tab => renderTabButton(tab.key, tab.name, true))}
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    <div className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
                        {error ? (
                            <span className="text-red-500 dark:text-red-400">{error}</span>
                        ) : (
                            <span className="text-green-500 dark:text-green-400">Valid JSON</span>
                        )}
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="cursor-pointer text-gray-900 dark:text-white"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden relative">
                {activeTab === 'viewer' && (
                    <div className="h-full w-full overflow-hidden p-4">
                        {hasValidData ? (
                            <JsonViewer data={parsedJson} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                                Invalid JSON data
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'map' && (
                    <div className="h-full w-full">
                        {hasValidData ? (
                            <JsonMap data={parsedJson} isVisible={true} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                                Invalid JSON data
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'text' && (
                    <div className="h-full w-full">
                        <TextEditor value={jsonInput} onChange={handleJsonChange} language="json" />
                    </div>
                )}

                {activeTab === 'toon' && (
                    <div className="h-full w-full">
                        <TextEditor value={toonInput} onChange={handleToonChange} language="yaml" hideMinify={true} />
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 dark:bg-opacity-30 backdrop-blur-sm z-30">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl m-4">
                        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Alert</h2>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 mb-6">{modalMessage}</p>
                        <div className="flex justify-end">
                            <button
                                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                                onClick={() => setShowModal(false)}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="layout">
                {children}
            </div>
        </div>
    );
};

export default Layout;