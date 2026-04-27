import React from 'react';
import Toolbar from './components/Toolbar';
import CanvasEditor from './components/CanvasEditor';
import { LeftSidebar, RightSidebar } from './components/Sidebar';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto">
            <CanvasEditor />
          </div>
        </div>
        <RightSidebar />
      </div>
    </div>
  );
};

export default App;
