import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useExport } from '../../hooks/useExport';

const Toolbar: React.FC = () => {
  const { canvasRef } = useContext(AppContext);
  const { exportAsPNG, exportAsJPG } = useExport();

  const handleExportPNG = () => {
    if (canvasRef.current) {
      exportAsPNG(canvasRef.current);
    }
  };

  const handleExportJPG = () => {
    if (canvasRef.current) {
      exportAsJPG(canvasRef.current);
    }
  };

  return (
    <div className="toolbar">
      <h2>工具栏</h2>
      <div className="toolbar-buttons">
        <button onClick={handleExportPNG} className="export-button">
          导出为 PNG
        </button>
        <button onClick={handleExportJPG} className="export-button">
          导出为 JPG
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
