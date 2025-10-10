import { TemplateResult } from 'lit';

export interface CcTableColumnDefinition<T> {
  renderer: (value: T) => TemplateResult | string | Element;
  header: TemplateResult | string | Element;
  width?: CcTableColumnWidthPolicy;
  sort?: CcTableSort<T>;
}

export interface CcTableSort<T> {
  direction?: 'asc' | 'desc' | null;
}

export type CcTableColumnWidthPolicy =
  | CcTableColumnWidthPolicyAuto
  | CcTableColumnWidthPolicyFlex
  | CcTableColumnWidthPolicyFixed;

export interface CcTableColumnWidthPolicyAuto {
  type: 'auto';
}
export interface CcTableColumnWidthPolicyFlex {
  type: 'flex';
  value: string | number;
}
export interface CcTableColumnWidthPolicyFixed {
  type: 'fixed';
  value: string;
}

//-- internal types
export interface CcTableColumnCells<
  W extends CcTableColumnWidthPolicyAuto | CcTableColumnWidthPolicyFlex =
    | CcTableColumnWidthPolicyAuto
    | CcTableColumnWidthPolicyFlex,
> {
  columnIndex: number;
  widthPolicy: W;
  cells?: Array<HTMLElement>;
  width?: number;
}
