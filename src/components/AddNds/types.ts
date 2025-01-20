export interface AddNdsModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
}

export interface NdsFormValues {
  id: string;
  name: string;
  description: string;
  value: number;
  deletedAt: string;
}
