import { TemplateResult } from 'lit';

export interface CcTableColumnDefinition<T> {
  renderer: (value: T, rowIndex: number, columnIndex: number) => TemplateResult | string | Element;
  header: TemplateResult | string | Element;
  width?: string;
  skeleton?: (rowIndex: number, columnIndex: number) => TemplateResult | string | Element;
  sort?: CcTableSort;
}

export interface CcTableSort {
  direction?: 'asc' | 'desc' | null;
}

export type CcTableElement<T> = CcTableElementSkeleton | CcTableElementItem<T>;

interface CcTableElementSkeleton {
  type: 'skeleton';
}

interface CcTableElementItem<T> {
  type: 'item';
  item: T;
}
