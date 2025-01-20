export interface EditNdsModalProps {
  open: boolean;
  onClose: () => void;
  onEdit: (id: string, values: NdsFormValues) => Promise<void>;
  initialData: NdsFormValues & { id: string };
}

export interface NdsFormValues {
  name: string;
  description: string;
  value: number;
  deletedAt: string;
}
