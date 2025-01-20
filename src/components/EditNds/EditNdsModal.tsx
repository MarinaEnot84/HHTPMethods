import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber } from "antd";
import { EditNdsModalProps } from "./types";

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

  const formItems = [
    {
      name: "name",
      label: "Название",
      rules: [
        { required: true, message: "Пожалуйста, введите название товара!" },
      ],
      component: <Input />,
    },
    {
      name: "description",
      label: "Описание",
      rules: [
        { required: true, message: "Пожалуйста, введите описание товара!" },
      ],
      component: <Input />,
    },
    {
      name: "value",
      label: "Значение",
      rules: [
        { required: true, message: "Пожалуйста, введите значение товара!" },
      ],
      component: <InputNumber min={0} />,
    },
    {
      name: "deletedAt",
      label: "Дата удаления",
      component: <Input />,
    },
  ];

  return (
    <Modal
      title="Редактировать товар"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
    >
      <Form form={form}>
        {formItems.map(({ name, label, rules, component }) => (
          <Form.Item key={name} name={name} label={label} rules={rules}>
            {component}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default EditNdsModal;
