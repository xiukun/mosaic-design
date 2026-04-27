import { Template, CanvasConfig } from '../types';

// 基础画布配置
const basicCanvasConfig: CanvasConfig = {
  width: 800,
  height: 800,
  backgroundColor: '#ffffff',
  backgroundBlur: 0,
  borderColor: '#000000',
  borderWidth: 0,
  borderRadius: 0,
  shadowColor: '#000000',
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
};

// 社交媒体画布配置
const instagramSquareConfig: CanvasConfig = {
  ...basicCanvasConfig,
  width: 1080,
  height: 1080,
};

const instagramStoryConfig: CanvasConfig = {
  ...basicCanvasConfig,
  width: 1080,
  height: 1920,
};

// 内置模板数据
export const templates: Template[] = [
  // 基础布局模板
  {
    id: 'template-1',
    name: '基础网格',
    category: '基础布局',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=photo%20collage%20grid%20layout%20with%204%20photos&image_size=square',
    isPopular: true,
    isNew: false,
    canvasConfig: basicCanvasConfig,
    placeholders: [
      {
        id: 'placeholder-1',
        x: 50,
        y: 50,
        width: 350,
        height: 350,
        aspectRatio: 1,
        rotation: 0,
        zIndex: 1,
      },
      {
        id: 'placeholder-2',
        x: 400,
        y: 50,
        width: 350,
        height: 350,
        aspectRatio: 1,
        rotation: 0,
        zIndex: 1,
      },
      {
        id: 'placeholder-3',
        x: 50,
        y: 400,
        width: 350,
        height: 350,
        aspectRatio: 1,
        rotation: 0,
        zIndex: 1,
      },
      {
        id: 'placeholder-4',
        x: 400,
        y: 400,
        width: 350,
        height: 350,
        aspectRatio: 1,
        rotation: 0,
        zIndex: 1,
      },
    ],
  },
  {
    id: 'template-2',
    name: '三栏布局',
    category: '基础布局',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=photo%20collage%20three%20column%20layout&image_size=landscape_4_3',
    isPopular: false,
    isNew: true,
    canvasConfig: basicCanvasConfig,
    placeholders: [
      {
        id: 'placeholder-1',
        x: 50,
        y: 50,
        width: 200,
        height: 700,
        aspectRatio: 2/7,
        rotation: 0,
        zIndex: 1,
      },
      {
        id: 'placeholder-2',
        x: 275,
        y: 50,
        width: 250,
        height: 700,
        aspectRatio: 5/14,
        rotation: 0,
        zIndex: 1,
      },
      {
        id: 'placeholder-3',
        x: 550,
        y: 50,
        width: 200,
        height: 700,
        aspectRatio: 2/7,
        rotation: 0,
        zIndex: 1,
      },
    ],
  },
  // 社交媒体模板
  {
    id: 'template-3',
    name: 'Instagram方形',
    category: '社交媒体',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=instagram%20square%20photo%20collage&image_size=square',
    isPopular: true,
    isNew: false,
    canvasConfig: instagramSquareConfig,
    placeholders: [
      {
        id: 'placeholder-1',
        x: 50,
        y: 50,
        width: 490,
        height: 490,
        aspectRatio: 1,
        rotation: 0,
        zIndex: 1,
      },
      {
        id: 'placeholder-2',
        x: 540,
        y: 50,
        width: 490,
        height: 490,
        aspectRatio: 1,
        rotation: 0,
        zIndex: 1,
      },
      {
        id: 'placeholder-3',
        x: 50,
        y: 540,
        width: 490,
        height: 490,
        aspectRatio: 1,
        rotation: 0,
        zIndex: 1,
      },
      {
        id: 'placeholder-4',
        x: 540,
        y: 540,
        width: 490,
        height: 490,
        aspectRatio: 1,
        rotation: 0,
        zIndex: 1,
      },
    ],
  },
  {
    id: 'template-4',
    name: 'Instagram故事',
    category: '社交媒体',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=instagram%20story%20photo%20collage&image_size=portrait_9_16',
    isPopular: true,
    isNew: false,
    canvasConfig: instagramStoryConfig,
    placeholders: [
      {
        id: 'placeholder-1',
        x: 50,
        y: 50,
        width: 980,
        height: 500,
        aspectRatio: 98/50,
        rotation: 0,
        zIndex: 1,
      },
      {
        id: 'placeholder-2',
        x: 50,
        y: 600,
        width: 480,
        height: 480,
        aspectRatio: 1,
        rotation: 0,
        zIndex: 1,
      },
      {
        id: 'placeholder-3',
        x: 550,
        y: 600,
        width: 480,
        height: 480,
        aspectRatio: 1,
        rotation: 0,
        zIndex: 1,
      },
      {
        id: 'placeholder-4',
        x: 50,
        y: 1130,
        width: 980,
        height: 740,
        aspectRatio: 98/74,
        rotation: 0,
        zIndex: 1,
      },
    ],
  },
  // 创意模板
  {
    id: 'template-5',
    name: '不规则布局',
    category: '创意',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=creative%20irregular%20photo%20collage%20layout&image_size=landscape_4_3',
    isPopular: false,
    isNew: true,
    canvasConfig: basicCanvasConfig,
    placeholders: [
      {
        id: 'placeholder-1',
        x: 50,
        y: 50,
        width: 400,
        height: 400,
        aspectRatio: 1,
        rotation: 0,
        zIndex: 1,
      },
      {
        id: 'placeholder-2',
        x: 475,
        y: 50,
        width: 275,
        height: 275,
        aspectRatio: 1,
        rotation: 15,
        zIndex: 2,
      },
      {
        id: 'placeholder-3',
        x: 475,
        y: 350,
        width: 275,
        height: 400,
        aspectRatio: 11/16,
        rotation: 0,
        zIndex: 1,
      },
      {
        id: 'placeholder-4',
        x: 50,
        y: 475,
        width: 275,
        height: 275,
        aspectRatio: 1,
        rotation: -15,
        zIndex: 2,
      },
    ],
  },
  // 主题模板
  {
    id: 'template-6',
    name: '旅行主题',
    category: '主题',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=travel%20theme%20photo%20collage&image_size=landscape_4_3',
    isPopular: true,
    isNew: false,
    canvasConfig: {
      ...basicCanvasConfig,
      backgroundColor: '#f0f8ff',
    },
    placeholders: [
      {
        id: 'placeholder-1',
        x: 50,
        y: 50,
        width: 350,
        height: 250,
        aspectRatio: 7/5,
        rotation: 0,
        zIndex: 1,
      },
      {
        id: 'placeholder-2',
        x: 450,
        y: 50,
        width: 300,
        height: 300,
        aspectRatio: 1,
        rotation: 0,
        zIndex: 1,
      },
      {
        id: 'placeholder-3',
        x: 50,
        y: 350,
        width: 350,
        height: 400,
        aspectRatio: 7/8,
        rotation: 0,
        zIndex: 1,
      },
      {
        id: 'placeholder-4',
        x: 450,
        y: 400,
        width: 300,
        height: 350,
        aspectRatio: 6/7,
        rotation: 0,
        zIndex: 1,
      },
    ],
    elements: [
      {
        id: 'element-1',
        type: 'text',
        content: '旅行回忆',
        x: 400,
        y: 780,
        zIndex: 10,
      },
    ],
  },
];

// 获取模板分类
export const getTemplateCategories = (): string[] => {
  const categories = new Set<string>();
  templates.forEach(template => categories.add(template.category));
  return Array.from(categories);
};

// 根据分类获取模板
export const getTemplatesByCategory = (category: string): Template[] => {
  if (category === '全部') {
    return templates;
  }
  return templates.filter(template => template.category === category);
};

// 根据ID获取模板
export const getTemplateById = (id: string): Template | undefined => {
  return templates.find(template => template.id === id);
};

// 获取热门模板
export const getPopularTemplates = (): Template[] => {
  return templates.filter(template => template.isPopular);
};

// 获取最新模板
export const getNewTemplates = (): Template[] => {
  return templates.filter(template => template.isNew);
};

// 搜索模板
export const searchTemplates = (query: string): Template[] => {
  const lowerQuery = query.toLowerCase();
  return templates.filter(template => 
    template.name.toLowerCase().includes(lowerQuery) ||
    template.category.toLowerCase().includes(lowerQuery)
  );
};