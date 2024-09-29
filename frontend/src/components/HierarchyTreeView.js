import React from 'react';
import { Typography } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import CustomTreeItem from './CustomTreeItem';
import { ExpandMore, ChevronRight } from '@mui/icons-material';

const HierarchyTreeView = ({ hierarchyData }) => {
  const renderTree = (node) => (
    <CustomTreeItem
      key={node._id.toString()}
      itemId={node._id.toString()}
      nodeData={node}
    >
      {Array.isArray(node.children) && node.children.length > 0
        ? node.children.map((child) => renderTree(child))
        : null}
    </CustomTreeItem>
  );

  if (!hierarchyData) return <Typography>Keine Hierarchiedaten verfügbar.</Typography>;

  return (
    <SimpleTreeView
      defaultExpandedItems={[hierarchyData._id.toString()]}
      slots={{
        collapseIcon: <ExpandMore />,
        expandIcon: <ChevronRight />,
      }}
    >
      {renderTree(hierarchyData)}
    </SimpleTreeView>
  );
};

export default HierarchyTreeView;
