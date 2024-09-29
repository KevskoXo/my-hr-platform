// components/HierarchyTreeView.js

import React from 'react';
import { Typography } from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

const HierarchyTreeView = ({ hierarchyData }) => {

    const renderTreeItems = (node) => ({
        id: node._id.toString(),
        label: `${node.role}: ${node.name}`,
        children: node.children ? node.children.map(renderTreeItems) : [],
    });

    if (!hierarchyData) return <Typography>Keine Hierarchiedaten verfügbar.</Typography>;

    const treeItems = [renderTreeItems(hierarchyData)];

    return (
        <RichTreeView items={treeItems} />
    );
};

export default HierarchyTreeView;
