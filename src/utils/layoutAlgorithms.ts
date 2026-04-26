export interface GridItem {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface LayoutOptions {
  containerWidth: number;
  gap: number;
  algorithm?: 'fixed-columns' | 'dynamic';
  columns?: number;
}

export function calculateGridLayout(
  items: Array<{ id: string; width: number; height: number }>,
  options: LayoutOptions
): GridItem[] {
  const { containerWidth, gap, algorithm = 'fixed-columns', columns = 3 } = options;
  
  if (algorithm === 'fixed-columns') {
    return calculateFixedColumnsLayout(items, containerWidth, gap, columns);
  } else {
    return calculateDynamicLayout(items, containerWidth, gap);
  }
}

function calculateFixedColumnsLayout(
  items: Array<{ id: string; width: number; height: number }>,
  containerWidth: number,
  gap: number,
  columns: number
): GridItem[] {
  const columnWidth = (containerWidth - (columns - 1) * gap) / columns;
  const result: GridItem[] = [];
  const columnHeights = new Array(columns).fill(0);
  
  items.forEach((item) => {
    // 找到高度最小的列
    let minHeight = Infinity;
    let minColumn = 0;
    
    for (let i = 0; i < columns; i++) {
      if (columnHeights[i] < minHeight) {
        minHeight = columnHeights[i];
        minColumn = i;
      }
    }
    
    const x = minColumn * (columnWidth + gap);
    const y = minHeight;
    
    result.push({
      id: item.id,
      width: columnWidth,
      height: item.height,
      x,
      y
    });
    
    columnHeights[minColumn] = y + item.height + gap;
  });
  
  return result;
}

function calculateDynamicLayout(
  items: Array<{ id: string; width: number; height: number }>,
  containerWidth: number,
  gap: number
): GridItem[] {
  const result: GridItem[] = [];
  let currentX = 0;
  let currentY = 0;
  let rowHeight = 0;
  
  items.forEach((item) => {
    if (currentX + item.width > containerWidth) {
      currentX = 0;
      currentY += rowHeight + gap;
      rowHeight = 0;
    }
    
    result.push({
      id: item.id,
      width: item.width,
      height: item.height,
      x: currentX,
      y: currentY
    });
    
    currentX += item.width + gap;
    rowHeight = Math.max(rowHeight, item.height);
  });
  
  return result;
}
