import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { addNdsData } from "../model/api/ndsApi";

interface AddNdsModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
}

const AddNdsModal: React.FC<AddNdsModalProps> = ({ open, onClose, onAdd }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      await addNdsData(values);
      message.success("Товар успешно добавлен!");
      onAdd();
      form.resetFields();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("Произошла ошибка при добавлении товара.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Добавить товар" open={open} onCancel={onClose} footer={null}>
      <Form form={form} onFinish={handleFinish}>
        <Form.Item
          label="ID"
          name="id"
          rules={[
            { required: true, message: "Пожалуйста, введите ID товара!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Название"
          name="name"
          rules={[
            { required: true, message: "Пожалуйста, введите название товара!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Описание"
          name="description"
          rules={[
            { required: true, message: "Пожалуйста, введите описание товара!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Значение"
          name="value"
          rules={[
            { required: true, message: "Пожалуйста, введите значение товара!" },
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Дата удаления"
          name="deletedAt"
          rules={[
            { required: true, message: "Пожалуйста, введите дату удаления!" },
          ]}
        >
          <Input type="datetime-local" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Добавить
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddNdsModal;
