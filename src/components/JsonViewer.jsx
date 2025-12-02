import React, { useState, useEffect } from 'react';
import ReactJson from 'react-json-view';
import PropertyTable from './PropertyTable';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useTheme } from '../context/ThemeContext';

const JsonViewer = ({ data }) => {
    const { theme } = useTheme();
    const [viewPath, setViewPath] = useState([]);
    const [viewData, setViewData] = useState(data);
    const [viewName, setViewName] = useState('root');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    console.log('JsonViewer render, data:', data);

    const getValueFromPath = (root, path) => {
        let current = root;
        for (const key of path) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                return undefined;
            }
        }
        return current;
    };

    useEffect(() => {
        setViewPath([]);
    }, [data]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const value = getValueFromPath(data, viewPath);
        setViewData(value);
        setViewName(viewPath.length > 0 ? viewPath[viewPath.length - 1] : 'root');
    }, [viewPath, data]);

    const handleSelect = (select) => {
        if (select.name === 'root' && select.namespace.length === 0) {
            setViewPath([]);
            return;
        }

        const isObject = typeof select.src === 'object' && select.src !== null;

        if (isObject) {
            setViewPath([...select.namespace, select.name]);
        } else {
            setViewPath([...select.namespace]);
        }
    };

    const handleDrillDown = (key) => {
        setViewPath([...viewPath, key]);
    };

    const handleBreadcrumbClick = (path) => {
        setViewPath(path);
    };

    return (
        <div className="h-full border border-gray-200 dark:border-[#1e1e1e] rounded-lg overflow-hidden bg-white dark:bg-[#1e1e1e]">
            {isMobile ? (
                // Mobile: Show only JSON viewer
                <div className="h-full overflow-auto p-2 bg-white dark:bg-[#1e1e1e]">
                    <ReactJson
                        src={data}
                        theme={theme === 'dark' ? 'colors' : 'rjv-default'}
                        iconStyle="triangle"
                        enableClipboard={true}
                        displayDataTypes={false}
                        name={false}
                        displayObjectSize={true}
                        collapsed={1}
                        onSelect={handleSelect}
                        style={{ backgroundColor: 'transparent', fontSize: '14px' }}
                    />
                </div>
            ) : (
                // Desktop: Show both panels
                <PanelGroup direction="horizontal">
                    <Panel defaultSize={80} minSize={50}>
                        <div className="h-full overflow-auto p-2 bg-white dark:bg-[#1e1e1e]">
                            <ReactJson
                                src={data}
                                theme={theme === 'dark' ? 'colors' : 'rjv-default'}
                                iconStyle="triangle"
                                enableClipboard={true}
                                displayDataTypes={false}
                                name={false}
                                displayObjectSize={true}
                                collapsed={1}
                                onSelect={handleSelect}
                                style={{ backgroundColor: 'transparent', fontSize: '14px' }}
                            />
                        </div>
                    </Panel>

                    <PanelResizeHandle className="w-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-col-resize flex items-center justify-center border-l border-r border-gray-200 dark:border-gray-600">
                        <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-500 rounded"></div>
                    </PanelResizeHandle>

                    <Panel defaultSize={20} minSize={20}>
                        <div className="h-full overflow-hidden">
                            <PropertyTable
                                data={viewData}
                                name={viewName}
                                path={viewPath}
                                onDrillDown={handleDrillDown}
                                onBreadcrumbClick={handleBreadcrumbClick}
                            />
                        </div>
                    </Panel>
                </PanelGroup>
            )}
        </div>
    );
};

export default JsonViewer;