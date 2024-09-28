// components/HierarchyTreeView.js

import React from 'react';
import { Typography, Avatar } from '@mui/material';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view'; // Import aus @mui/lab
import { ExpandMore, ChevronRight } from '@mui/icons-material';

const HierarchyTreeView = ({ hierarchyData }) => {
    const renderTree = (node) => (
        <TreeItem
            key={node._id.toString()}
            nodeId={node._id.toString()} // Verwenden von nodeId
            label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        sx={{ width: 24, height: 24, mr: 1 }}
                        src={node.avatar}
                    >
                        {!node.avatar && node.name.charAt(0)}
                    </Avatar>
                    <Typography variant="body1">
                        {node.role}: {node.name}
                    </Typography>
                </div>
            }
        >
            {Array.isArray(node.children) && node.children.length > 0
                ? node.children.map((child) => renderTree(child))
                : null}
        </TreeItem>
    );

    if (!hierarchyData) return <Typography>Keine Hierarchiedaten verfügbar.</Typography>;

    return (
        <SimpleTreeView
            defaultCollapseIcon={<ExpandMore />}
            defaultExpandIcon={<ChevronRight />}
        >
            {renderTree(hierarchyData)}
        </SimpleTreeView>
    );
};

export default HierarchyTreeView;
