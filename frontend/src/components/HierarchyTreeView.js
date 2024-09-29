// components/HierarchyTreeView.js

import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import CustomTreeItem from './CustomTreeItem';
import { ExpandMore, ChevronRight } from '@mui/icons-material';
import createAxiosInstance from '../services/axiosInstance';

const HierarchyTreeView = () => {
  const [hierarchyData, setHierarchyData] = useState(null);

  const fetchHierarchyData = async () => {
    try {
      const token = localStorage.getItem('accessToken'); // Token aus localStorage abrufen
      const axiosInstance = createAxiosInstance('recruiters')
      const response = await axiosInstance.get('/hierarchy', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHierarchyData(response.data);
    } catch (error) {
      console.error('Fehler beim Abrufen der Hierarchie-Daten:', error);
      // Optional: Fehlermeldung anzeigen, z.B. mit einer Snackbar
    }
  };

  useEffect(() => {
    fetchHierarchyData();
  }, []);

  if (!hierarchyData) return <Typography>Keine Hierarchiedaten verfügbar.</Typography>;

  const renderTree = (node) => (
    <CustomTreeItem
      key={node._id.toString()}
      itemId={node._id.toString()}
      nodeData={node}
      refreshHierarchyData={fetchHierarchyData} // Übergabe der Aktualisierungsfunktion
    >
      {Array.isArray(node.children) && node.children.length > 0
        ? node.children.map((child) => renderTree(child))
        : null}
    </CustomTreeItem>
  );

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
