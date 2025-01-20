import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { addNdsData } from "../../model/api/ndsApi";
import { AddNdsModalProps, NdsFormValues } from "./types";

const AddNdsModal: React.FC<AddNdsModalProps> = ({ open, onClose, onAdd }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const handleFinish = async (values: NdsFormValues) => {
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

  const formItems = [
    {
      label: "ID",
      name: "id",
      rules: [{ required: true, message: "Пожалуйста, введите ID товара!" }],
    },
    {
      label: "Название",
      name: "name",
      rules: [
        { required: true, message: "Пожалуйста, введите название товара!" },
      ],
    },
    {
      label: "Описание",
      name: "description",
      rules: [
        { required: true, message: "Пожалуйста, введите описание товара!" },
      ],
    },
    {
      label: "Значение",
      name: "value",
      rules: [
        { required: true, message: "Пожалуйста, введите значение товара!" },
      ],
      inputType: "number",
    },
    {
      label: "Дата удаления",
      name: "deletedAt",
      rules: [
        { required: true, message: "Пожалуйста, введите дату удаления!" },
      ],
      inputType: "datetime-local",
    },
  ];

  return (
    <Modal title="Добавить товар" open={open} onCancel={onClose} footer={null}>
      <Form form={form} onFinish={handleFinish}>
        {formItems.map(({ label, name, rules, inputType }) => (
          <Form.Item key={name} label={label} name={name} rules={rules}>
            <Input type={inputType} />
          </Form.Item>
        ))}
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
