import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { searchNdsById } from "../../model/api/ndsApi";
import { SearchFormValues, SearchNdsFormProps } from "./types";

const SearchNdsForm: React.FC<SearchNdsFormProps> = ({ onSearch }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleFinish = async (values: SearchFormValues) => {
    setLoading(true);
    try {
      const result = await searchNdsById(values.id);
      onSearch(result);
      message.success("Товар найден!");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Произошла ошибка при поиске товара.";
      message.error(errorMessage);
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
