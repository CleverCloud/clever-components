export interface Tab {
  path: string;
  name: string;
  selected?: boolean;
}

export interface CcConsoleHeadbar {
  productType: string;
  productId: string;
  tabs: Tab[];
  skeleton: boolean;
}
