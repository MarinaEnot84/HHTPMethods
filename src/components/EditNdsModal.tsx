import { Modal, Form, Input, InputNumber } from "antd";
import { useEffect } from "react";

interface EditNdsModalProps {
  open: boolean;
  onClose: () => void;
  onEdit: (
    id: string,
    values: {
      name: string;
      description: string;
      value: number;
      deletedAt: string;
    }
  ) => Promise<void>;
  initialData: {
    id: string;
    name: string;
    description: string;
    value: number;
    deletedAt: string;
  };
}

const EditNdsModal: React.FC<EditNdsModalProps> = ({
  open,
  onClose,
  onEdit,
  initialData,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.setFieldsValue(initialData);
    }
  }, [open, initialData, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onEdit(initialData.id, values);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Validation Failed:", error);
    }
  };

  return (
    <Modal
      title="Редактировать товар"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
    >
      <Form form={form}>
        <Form.Item
          name="name"
          label="Название"
          rules={[
            { required: true, message: "Пожалуйста, введите название товара!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Описание"
          rules={[
            { required: true, message: "Пожалуйста, введите описание товара!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="value"
          label="Значение"
          rules={[
            { required: true, message: "Пожалуйста, введите значение товара!" },
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item name="deletedAt" label="Дата удаления">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditNdsModal;
