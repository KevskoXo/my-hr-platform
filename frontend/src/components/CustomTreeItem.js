// components/CustomTreeItem.js

import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Avatar, Typography } from '@mui/material';
import { useTreeItem2 } from '@mui/x-tree-view/useTreeItem2';
import {
  TreeItem2Content,
  TreeItem2IconContainer,
  TreeItem2GroupTransition,
  TreeItem2Root,
} from '@mui/x-tree-view/TreeItem2';
import { TreeItem2Provider } from '@mui/x-tree-view/TreeItem2Provider';
import { useNavigate } from 'react-router-dom';
import { ExpandMore, ChevronRight } from '@mui/icons-material';

const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
}));

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
  const { itemId, nodeData, children, ...other } = props;

  const navigate = useNavigate();

  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getGroupTransitionProps,
    status,
  } = useTreeItem2({ itemId, children, rootRef: ref });

  const handleItemClick = () => {
    navigate(`/recruiters/${nodeData._id}`);
  };

  // Determine the icon component based on the status
  const IconComponent = status === 'closed' ? ChevronRight : ExpandMore;

  return (
    <TreeItem2Provider itemId={itemId}>
      <TreeItem2Root {...getRootProps(other)}>
        <CustomTreeItemContent {...getContentProps()}>
          <TreeItem2IconContainer {...getIconContainerProps()}>
            {/* Render the icon directly */}
            <IconComponent fontSize="small" />
          </TreeItem2IconContainer>
          <Box
            sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
            onClick={handleItemClick}
          >
            <Avatar
              sx={{ width: 40, height: 40 }}
              src={nodeData.avatar}
            >
              {!nodeData.avatar && nodeData.name.charAt(0)}
            </Avatar>
            <Typography variant="body1">
              {nodeData.role}: {nodeData.name}
            </Typography>
          </Box>
        </CustomTreeItemContent>
        {children && <TreeItem2GroupTransition {...getGroupTransitionProps()} />}
      </TreeItem2Root>
    </TreeItem2Provider>
  );
});

export default CustomTreeItem;
