import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { AuthFormValues, AuthProps } from "./types";

const Auth: React.FC<AuthProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (values: AuthFormValues) => {
    setLoading(true);
    try {
      localStorage.setItem("authToken", values.token);
      message.success("Токен успешно сохранен!");
      onSuccess();
    } catch (error) {
      message.error("Ошибка при сохранении токена.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item
        label="JWT Токен"
        name="token"
        rules={[{ required: true, message: "Пожалуйста, введите токен!" }]}
      >
        <Input.Password placeholder="Введите ваш JWT токен" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Авторизоваться
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Auth;
