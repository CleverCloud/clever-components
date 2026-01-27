import { IconModel } from '../common.types.js';

export interface CcGridColumnDefinition<T> {
  cellAt: (value: T, rowIndex: number, columnIndex: number) => CcGridCell | null | undefined;
  header: string;
  align?: 'start' | 'end';
  width?: string;
  sort?: CcGridSort;
  volatile?: boolean;
}

export type CcGridSort = 'none' | 'asc' | 'desc' | null;

export type CcGridCell = CcGridCellText | CcGridCellLink | CcGridCellButton;

interface CcGridCellText {
  type: 'text';
  value: string;
  icon?: IconModel;
  skeleton?: boolean;
  enableCopyToClipboard?: boolean;
}

interface CcGridCellLink {
  type: 'link';
  value: string;
  icon?: IconModel;
  onClick: () => void;
  skeleton?: boolean;
}

interface CcGridCellButton {
  type: 'button';
  value: string;
  icon?: IconModel;
  waiting?: boolean;
  onClick: () => void;
  skeleton?: boolean;
}
