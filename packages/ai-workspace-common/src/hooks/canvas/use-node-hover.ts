import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { Node } from '@xyflow/react';
const ZINDEX_ON_GROUP = 2;

export const useNodeHoverEffect = (nodeId: string) => {
  const { setEdges, setNodes, getNodes } = useReactFlow();

  const updateNodeAndEdges = useCallback(
    (isHovered: boolean, selected?: boolean) => {
      // Batch update both nodes and edges in a single React state update
      const newZIndex = isHovered ? 1001 : 0;

      const isGroupNode = getNodes().find((node) => node.id === nodeId)?.type === 'group';

      setNodes((nodes) => {
        // First pass - determine if this is a group node
        return nodes.map((node) => {
          if (node.id === nodeId) {
            // For the target node itself
            if (isGroupNode) {
              return { ...node, style: { ...node.style, zIndex: selected ? 1 : -1 } };
            }

            return {
              ...node,
              style: {
                ...node.style,
                zIndex: node.selected ? 1000 : newZIndex,
              },
            };
          }

          // For child nodes of the group
          if (node.parentId === nodeId) {
            if (selected) {
              return { ...node, style: { ...node.style, zIndex: ZINDEX_ON_GROUP } };
            }
            return { ...node, style: { ...node.style, zIndex: node.selected ? 1000 : 0 } };
          }

          const getIrrelevantNodeIndex = (node: Node) => {
            if (!node.parentId) {
              if (node.selected) {
                return node.type === 'group' ? 2 : 1000;
              }
              return node.type === 'group' ? -1 : 0;
            }
            const parent = nodes.find((n) => n.id === node.parentId);
            return parent?.selected ? 2 : 0;
          };

          return {
            ...node,
            style: {
              ...node.style,
              zIndex: getIrrelevantNodeIndex(node),
            },
          };
        });
      });

      setEdges((eds) => {
        return eds.map((edge) => {
          // Handle edges connected to the node
          if (edge.source === nodeId || edge.target === nodeId) {
            return {
              ...edge,
              data: { ...edge.data, hover: isHovered },
            };
          }

          // Handle edges between nodes in the same group when group is selected
          if (isGroupNode && selected) {
            const sourceNode = getNodes().find((node) => node.id === edge.source);
            const targetNode = getNodes().find((node) => node.id === edge.target);

            if (sourceNode?.parentId === nodeId && targetNode?.parentId === nodeId) {
              return { ...edge, zIndex: ZINDEX_ON_GROUP };
            }
          }

          // Reset edge hover state for other edges
          return { ...edge, data: { ...edge.data, hover: false } };
        });
      });
    },
    [nodeId, setEdges, setNodes, getNodes],
  );

  const handleMouseEnter = useCallback(
    (selected?: boolean) => {
      updateNodeAndEdges(true, selected);
    },
    [updateNodeAndEdges],
  );

  const handleMouseLeave = useCallback(
    (selected?: boolean) => {
      updateNodeAndEdges(false, selected);
    },
    [updateNodeAndEdges],
  );

  return {
    handleMouseEnter,
    handleMouseLeave,
  };
};
