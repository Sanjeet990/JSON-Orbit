import { useMemo, useEffect, useState } from 'react';
import ReactFlow, {
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    MarkerType,
    Handle,
    Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom node component for objects
const ObjectNode = ({ data }) => {
    const isNested = data.isNested;
    const bgGradient = isNested
        ? 'bg-gradient-to-br from-green-100 to-green-200'
        : 'bg-gradient-to-br from-indigo-100 to-indigo-200';
    const borderColor = isNested ? 'border-green-500' : 'border-indigo-500';
    const keyColor = isNested ? 'text-green-800' : 'text-indigo-700';
    const valueColor = isNested ? 'text-green-700' : 'text-indigo-600';

    return (
        <div className={`${bgGradient} ${borderColor} border-2 rounded-lg p-3 min-w-[240px] shadow-lg relative`}>
            <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-gray-400" />
            <div className="font-mono text-sm space-y-1">
                {data.properties.map((prop, idx) => (
                    <div key={idx} className="whitespace-nowrap">
                        <span className={keyColor + ' font-semibold'}>{prop.key}</span>
                        {prop.displayValue && (
                            <>
                                <span className={keyColor + ' font-semibold'}>:</span>{' '}
                                <span className={valueColor}>{prop.displayValue}</span>
                            </>
                        )}
                    </div>
                ))}
            </div>
            <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-gray-400" />
        </div>
    );
};

// Custom node component for array items
const ArrayItemNode = ({ data }) => {
    return (
        <div className="bg-gradient-to-br from-red-300 to-red-400 border-2 border-red-500 rounded-lg w-[70px] h-[70px] shadow-lg flex items-center justify-center relative">
            <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-gray-400" />
            <div className="text-white font-bold text-2xl">
                {data.label}
            </div>
            <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-gray-400" />
        </div>
    );
};

const nodeTypes = {
    object: ObjectNode,
    arrayItem: ArrayItemNode,
    property: ObjectNode,
};

const JsonMap = ({ data, isVisible }) => {
    const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
        if (!data) return { nodes: [], edges: [] };

        let nodeId = 0;
        const NODE_WIDTH = 280;
        const X_SPACING = 500;
        const Y_SPACING = 25;

        //Build Virtual Tree with intermediate property nodes
        const buildTree = (obj, depth = 0, propertyKey = null) => {
            const id = `${nodeId++}`;
            const node = {
                id,
                depth,
                width: NODE_WIDTH,
                height: 0,
                children: [],
                data: null,
                type: 'object',
                propertyKey,
            };

            if (Array.isArray(obj)) {

                node.type = 'property';
                node.width = 200;
                node.height = 60;
                node.data = { properties: [{ key: propertyKey || 'array', displayValue: '' }], isNested: depth > 0 };

                obj.forEach((item, index) => {
                    if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
                        const childNode = buildTree(item, depth + 1);
                        node.children.push(childNode);
                    } else {
                        const childId = `${nodeId++}`;
                        node.children.push({
                            id: childId,
                            depth: depth + 1,
                            width: 70,
                            height: 70,
                            children: [],
                            type: 'arrayItem',
                            data: { label: String(item) }
                        });
                    }
                });

            } else if (typeof obj === 'object' && obj !== null) {
                // Separate properties into simple values and complex children
                const simpleProps = [];
                const complexChildren = [];

                Object.entries(obj).forEach(([key, value]) => {
                    if (typeof value === 'object' && value !== null) {
                        complexChildren.push({ key, value });
                    } else {
                        simpleProps.push({
                            key,
                            displayValue: String(value).length > 25 ? String(value).substring(0, 25) + '...' : String(value)
                        });
                    }
                });

                // Current node shows only simple properties
                node.data = { properties: simpleProps, isNested: depth > 0 };
                node.height = simpleProps.length * 22 + 32 + 10;

                // For complex children, create intermediate property nodes
                complexChildren.forEach(({ key, value }) => {
                    if (Array.isArray(value)) {
                        const propNode = buildTree(value, depth + 1, key);
                        node.children.push(propNode);
                    } else {
                        // Create intermediate property node for object
                        const propNodeId = `${nodeId++}`;
                        const propNode = {
                            id: propNodeId,
                            depth: depth + 1,
                            width: 200,
                            height: 60,
                            children: [],
                            type: 'property',
                            data: { properties: [{ key, displayValue: '' }], isNested: depth > 0 }
                        };
                        
                        const childNode = buildTree(value, depth + 2);
                        propNode.children.push(childNode);
                        node.children.push(propNode);
                    }
                });
            }
            return node;
        };

        const root = {
            id: 'root',
            depth: 0,
            width: 150,
            height: 60,
            children: [],
            type: 'object',
            data: { properties: [{ key: 'root', displayValue: '' }], isNested: false }
        };

        if (Array.isArray(data)) {
            data.forEach((item, index) => {
                if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
                    const child = buildTree(item, 1);
                    root.children.push(child);
                } else {
                    const childId = `${nodeId++}`;
                    root.children.push({
                        id: childId,
                        depth: 1,
                        width: 70,
                        height: 70,
                        children: [],
                        type: 'arrayItem',
                        data: { label: String(item) }
                    });
                }
            });
        } else {

            Object.entries(data).forEach(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                    if (Array.isArray(value)) {
                        const propNode = buildTree(value, 1, key);
                        root.children.push(propNode);
                    } else {
                        const propNodeId = `${nodeId++}`;
                        const propNode = {
                            id: propNodeId,
                            depth: 1,
                            width: 200,
                            height: 60,
                            children: [],
                            type: 'property',
                            data: { properties: [{ key, displayValue: '' }], isNested: false }
                        };
                        
                        const childNode = buildTree(value, 2);
                        propNode.children.push(childNode);
                        root.children.push(propNode);
                    }
                } else {
                    // Simple property stays in root
                }
            });
        }

        //Calculate tree heights
        const measureTree = (node) => {
            if (node.children.length === 0) {
                node.treeHeight = node.height;
                return node.height;
            }

            let childrenHeight = 0;
            node.children.forEach(child => {
                childrenHeight += measureTree(child);
            });

            childrenHeight += (node.children.length - 1) * Y_SPACING;

            node.treeHeight = Math.max(node.height, childrenHeight);
            return node.treeHeight;
        };

        measureTree(root);

        const layoutTree = (node, x, y) => {
            node.x = x;
            node.y = y;

            if (node.children.length === 0) return;

            const totalChildrenHeight = node.children.reduce((acc, child) => acc + child.treeHeight, 0) + (node.children.length - 1) * Y_SPACING;

            const parentCenterY = y + node.height / 2;
            let currentChildY = parentCenterY - totalChildrenHeight / 2;

            const childX = x + X_SPACING;

            node.children.forEach(child => {
                const childSlotHeight = child.treeHeight;
                const childNodeY = currentChildY + (childSlotHeight - child.height) / 2;

                layoutTree(child, childX, childNodeY);

                currentChildY += childSlotHeight + Y_SPACING;
            });
        };

        layoutTree(root, 0, 0);

        const finalNodes = [];
        const finalEdges = [];

        const flatten = (node) => {
            finalNodes.push({
                id: node.id,
                type: node.type,
                position: { x: node.x, y: node.y },
                data: node.data,
            });

            node.children.forEach(child => {
                finalEdges.push({
                    id: `e${node.id}-${child.id}`,
                    source: node.id,
                    target: child.id,
                    type: 'default',
                    animated: false,
                    style: { stroke: '#94a3b8', strokeWidth: 3 },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: '#94a3b8',
                        width: 20,
                        height: 20,
                    },
                });
                flatten(child);
            });
        };

        flatten(root);

        console.log('Symmetric Nodes:', finalNodes);
        console.log('Symmetric Edges:', finalEdges);

        return { nodes: finalNodes, edges: finalEdges };
    }, [data]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    useEffect(() => {
        setNodes(initialNodes);
        setEdges(initialEdges);
        if (reactFlowInstance) {
            setTimeout(() => {
                reactFlowInstance.fitView({ padding: 0.2, duration: 800 });
            }, 100);
        }
    }, [initialNodes, initialEdges, setNodes, setEdges, reactFlowInstance, isVisible]);

    return (
        <div className="w-full h-full bg-white" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.1}
                maxZoom={2}
                nodesDraggable={true}
                nodesConnectable={false}
                elementsSelectable={true}
                defaultEdgeOptions={{
                    type: 'default',
                    animated: false,
                    style: { strokeWidth: 2, stroke: '#94a3b8' },
                }}
                proOptions={{ hideAttribution: true }}
            >
                <Controls className="bg-white border border-gray-300 rounded-lg shadow-lg" />
                <Background color="#e5e7eb" gap={20} size={1} />
            </ReactFlow>
        </div>
    );
};

export default JsonMap;
