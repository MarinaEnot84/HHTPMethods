import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { searchNdsById } from "../model/api/ndsApi";

const SearchNdsForm: React.FC<{ onSearch: (data: any) => void }> = ({
  onSearch,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleFinish = async (values: { id: string }) => {
    setLoading(true);
    try {
      const result = await searchNdsById(values.id);
      onSearch(result);
      message.success("Товар найден!");
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("Произошла ошибка при поиске товара.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={handleFinish} layout="inline" style={{ marginBottom: 16 }}>
      <Form.Item
        name="id"
        rules={[{ required: true, message: "Пожалуйста, введите ID товара!" }]}
      >
        <Input placeholder="Введите ID товара" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Поиск
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SearchNdsForm;
