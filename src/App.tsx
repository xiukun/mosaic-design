import React from 'react';
import Toolbar from './components/Toolbar';
import CanvasEditor from './components/CanvasEditor';
import LeftSidebar from './components/Sidebar/LeftSidebar';

const App: React.FC = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 flex flex-col overflow-hidden">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-5xl mx-auto">
            <CanvasEditor />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
