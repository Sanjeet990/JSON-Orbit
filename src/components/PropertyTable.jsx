import React from 'react';
import { Copy } from 'lucide-react';

const PropertyTable = ({ data, name, path = [], onDrillDown, onBreadcrumbClick }) => {
    if (!data || typeof data !== 'object') {
        return (
            <div className="p-4 text-gray-500 dark:text-gray-400 text-sm">
                Select a node to view properties.
            </div>
        );
    }

    const entries = Object.entries(data);
    const isRoot = path.length === 0;

    const handleCopy = (text) => {
        navigator.clipboard.writeText(String(text));
    };

    return (
        <div className="flex flex-col h-full border-l border-gray-200 dark:border-[#1e1e1e] bg-white dark:bg-[#1e1e1e]">
            <div className="bg-gray-100 dark:bg-[#1e1e1e] px-4 py-2 border-b border-gray-200 dark:border-[#1e1e1e] font-medium text-sm text-gray-700 dark:text-gray-200 flex flex-col">
                {!isRoot && (
                    <div className="flex items-center flex-wrap gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <button
                            onClick={() => onBreadcrumbClick && onBreadcrumbClick([])}
                            className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer"
                        >
                            root
                        </button>
                        {path.map((key, index) => (
                            <React.Fragment key={index}>
                                <span>&gt;</span>
                                <button
                                    onClick={() => onBreadcrumbClick && onBreadcrumbClick(path.slice(0, index + 1))}
                                    className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer"
                                >
                                    {key}
                                </button>
                            </React.Fragment>
                        ))}
                    </div>
                )}
                <div className="flex justify-between items-center">
                    <span>{isRoot ? 'Properties' : `Properties for: ${name}`}</span>
                </div>
            </div>

            <div className="overflow-auto flex-1">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-[#1e1e1e] bg-white dark:bg-[#1e1e1e]">
                    <thead className="bg-gray-50 dark:bg-[#1e1e1e]">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Value
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-[#1e1e1e] divide-y divide-gray-200 dark:divide-[#1e1e1e]">
                        {entries.map(([key, value]) => {
                            const isObject = typeof value === 'object' && value !== null;
                            return (
                                <tr key={key} className="hover:bg-gray-50 dark:hover:bg-[#1e1e1e] group">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
                                        <span className="mr-2">{key}</span>
                                        <button
                                            onClick={() => handleCopy(key)}
                                            className="opacity-0 group-hover:opacity-100 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-opacity"
                                            title="Copy Key"
                                        >
                                            <Copy size={16} />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center">
                                            {isObject ? (
                                                <button
                                                    onClick={() => onDrillDown && onDrillDown(key)}
                                                    className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center"
                                                >
                                                    {Array.isArray(value) ? `Array[${value.length}]` : `Object{${Object.keys(value).length}}`}
                                                </button>
                                            ) : (
                                                <span className="truncate max-w-xs block" title={String(value)}>{String(value)}</span>
                                            )}

                                            {!isObject && (
                                                <button
                                                    onClick={() => handleCopy(value)}
                                                    className="ml-2 opacity-0 group-hover:opacity-100 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-opacity"
                                                    title="Copy Value"
                                                >
                                                    <Copy size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {entries.length === 0 && (
                            <tr>
                                <td colSpan="2" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                                    No properties
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PropertyTable;