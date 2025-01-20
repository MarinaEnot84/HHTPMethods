import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";

interface AuthProps {
  onSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");

  const handleSubmit = async (values: { token: string }) => {
    setLoading(true);
    try {
      localStorage.setItem("authToken", values.token);
      setToken(values.token);
      onSuccess();
      message.success("Токен успешно сохранен!");
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
        <Input.Password
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Введите ваш JWT токен"
        />
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
