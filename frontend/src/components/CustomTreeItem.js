// components/CustomTreeItem.js

import React, { useRef } from 'react';
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
import { useDrag, useDrop } from 'react-dnd';
import createAxiosInstance from '../services/axiosInstance';


// Styling für den TreeItem-Inhalt
const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
}));

// Definieren des Item-Typs für react-dnd
const ITEM_TYPE = 'TREE_ITEM';

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
  const { itemId, nodeData, children, refreshHierarchyData, ...other } = props;

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

  // Bestimmen des Icons basierend auf dem Status (geöffnet oder geschlossen)
  const IconComponent = status === 'closed' ? ChevronRight : ExpandMore;

  // Refs für Drag und Drop
  const dragRef = useRef(null);
  const dropRef = useRef(null);

  // Drag Source Hook
  const [, drag] = useDrag({
    type: ITEM_TYPE,
    item: { id: nodeData._id },
    canDrag: () => {
      // Optional: Hier können Sie Bedingungen hinzufügen, wann das Ziehen erlaubt ist
      return true;
    },
  });



  // Drop Target Hook
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (draggedItem) => {
      if (draggedItem.id !== nodeData._id) {
        // Supervisor ändern, wenn das gezogene Item nicht der aktuelle Knoten ist
        handleSupervisorChange(draggedItem.id, nodeData._id);
      }
    },
    canDrop: (draggedItem) => {
      return true; // Füge hier deine Logik hinzu
      // Optional: Hier können Sie Logik hinzufügen, um das Ablegen zu erlauben oder zu verhindern
      // Zum Beispiel könnten Sie verhindern, dass ein Knoten auf einen seiner Unterknoten gezogen wird
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // Verbinden der Drag- und Drop-Refs mit dem TreeItem
  drag(drop(dragRef));

  // Funktion zum Ändern des Supervisors
  const handleSupervisorChange = async (recruiterId, newSupervisorId) => {
    try {
      const token = localStorage.getItem('accessToken'); // Token aus localStorage abrufen
      const axiosInstance = createAxiosInstance('recruiters');
      await axiosInstance.put(
        `/${recruiterId}/supervisor`,
        { supervisor: newSupervisorId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Hierarchiedaten nach der Aktualisierung neu laden
      if (refreshHierarchyData) {
        refreshHierarchyData();
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Supervisors:', error);
      // Optional: Fehlermeldung anzeigen, z.B. mit einer Snackbar
    }
  };

  return (
    <TreeItem2Provider itemId={itemId}>
      <TreeItem2Root {...getRootProps(other)}>
        <CustomTreeItemContent
          {...getContentProps()}
          ref={dragRef} // Verwenden des kombinierten Drag-Drop Refs
        >
          <TreeItem2IconContainer {...getIconContainerProps()}>
            {/* Direktes Rendern des Icons */}
            <IconComponent fontSize="small" />
          </TreeItem2IconContainer>
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              padding: '2px',
              backgroundColor: isOver && canDrop ? 'rgba(0, 0, 255, 0.1)' : 'transparent',
            }}
            onClick={handleItemClick}
          >
            <Avatar
              sx={{ width: 50, height: 50 }}
              src={nodeData.avatar}
            >
              {!nodeData.avatar && nodeData.name.charAt(0)}
            </Avatar>
            <Typography variant="body1">
              {nodeData.role}: {nodeData.name}
            </Typography>
          </Box>
        </CustomTreeItemContent>
        {children && <TreeItem2GroupTransition {...getGroupTransitionProps()} 
            sx={{
              marginLeft: 4, // Abstand von Admin zu den Recruiter-Elementen (oder anderen gewünschten Wert)
            }}/>}
      </TreeItem2Root>
    </TreeItem2Provider>
  );
});

export default CustomTreeItem;
