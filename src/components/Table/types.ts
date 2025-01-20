export interface NdsData {
  id: string;
  name: string;
  description: string;
  value: number;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface NdsState {
  data: NdsData[];
  loading: boolean;
  error: string | null;
  selectedItem: NdsData | null;
  isEditModalVisible: boolean;
  isModalVisible: boolean;
  deletedItems: Record<string, NdsData>;
  searchedItem: NdsData | null;
}
