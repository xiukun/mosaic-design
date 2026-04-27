import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Template } from '../../types';
import { getTemplatesByCategory, getPopularTemplates, getNewTemplates, searchTemplates, getTemplateById } from '../../utils/templates';
import { useTemplateApplication } from '../../hooks/useTemplateApplication';

const TemplateSelector: React.FC = () => {
  const { state, selectTemplate, toggleFavoriteTemplate } = useApp();
  const { applyTemplateWithImages } = useTemplateApplication();
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);

  useEffect(() => {
    let templates: Template[] = [];
    
    if (searchQuery) {
      templates = searchTemplates(searchQuery);
    } else if (selectedCategory === '热门') {
      templates = getPopularTemplates();
    } else if (selectedCategory === '最新') {
      templates = getNewTemplates();
    } else {
      templates = getTemplatesByCategory(selectedCategory);
    }
    
    setFilteredTemplates(templates);
  }, [selectedCategory, searchQuery, state.templates]);

  const handleTemplateClick = (template: Template) => {
    selectTemplate(template.id);
  };

  const handleApplyTemplate = (template: Template) => {
    applyTemplateWithImages(template);
  };

  const handleToggleFavorite = (e: React.MouseEvent, templateId: string) => {
    e.stopPropagation();
    toggleFavoriteTemplate(templateId);
  };

  const categories = ['全部', '热门', '最新', ...state.templateCategories];

  return (
    <div className="p-4 space-y-4">
      {/* 搜索框 */}
      <div className="relative">
        <input
          type="text"
          placeholder="搜索模板..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="absolute left-3 top-2.5 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* 分类导航 */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${selectedCategory === category
              ? 'bg-indigo-500 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 模板网格 */}
      <div className="grid grid-cols-2 gap-3">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className={`relative rounded-xl overflow-hidden shadow-md transition-all cursor-pointer ${state.selectedTemplateId === template.id
              ? 'ring-2 ring-indigo-500'
              : 'hover:shadow-lg'
              }`}
            onClick={() => handleTemplateClick(template)}
          >
            {/* 模板预览图 */}
            <div className="aspect-square overflow-hidden">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* 模板信息 */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
              <h3 className="text-white text-sm font-medium truncate">{template.name}</h3>
              <p className="text-white/70 text-xs truncate">{template.category}</p>
            </div>

            {/* 收藏按钮 */}
            <button
              className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center ${state.favoriteTemplates.includes(template.id)
                ? 'bg-red-500 text-white'
                : 'bg-white/80 text-slate-600 hover:bg-white'
                }`}
              onClick={(e) => handleToggleFavorite(e, template.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={state.favoriteTemplates.includes(template.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {/* 热门/新标签 */}
            {template.isPopular && (
              <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded">热门</div>
            )}
            {template.isNew && (
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">新</div>
            )}
          </div>
        ))}
      </div>

      {/* 选中模板操作 */}
      {state.selectedTemplateId && (
        <div className="mt-4 p-4 bg-slate-100 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">{state.selectedTemplateId ? getTemplateById(state.selectedTemplateId)?.name : ''}</h3>
            <button
              onClick={() => selectTemplate(null)}
              className="text-slate-500 hover:text-slate-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            {state.selectedTemplateId ? getTemplateById(state.selectedTemplateId)?.category : ''}
          </p>
          <button
            onClick={() => {
              if (state.selectedTemplateId) {
                const template = getTemplateById(state.selectedTemplateId);
                if (template) {
                  handleApplyTemplate(template);
                }
              }
            }}
            className="w-full py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            应用模板
          </button>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;