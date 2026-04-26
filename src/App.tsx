import React from 'react';
import Toolbar from './components/Toolbar';
import CanvasEditor from './components/CanvasEditor';
import { LeftSidebar, RightSidebar } from './components/Sidebar';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <div className="flex-1 overflow-auto">
          <CanvasEditor />
        </div>
        <RightSidebar />
      </div>
    </div>
  );
};

export default App;
