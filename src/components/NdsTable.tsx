import React, { useEffect, useState } from "react";
import { Table, message, Spin, Button, Popconfirm } from "antd";
import {
  deleteNdsById,
  getItemById,
  getNdsData,
  restoreNdsById,
  softDeleteNdsById,
  updateNdsById,
} from "../model/api/ndsApi";
import AddNdsModal from "./AddNdsModal";
import SearchNdsForm from "./SearchNdsForm";
import Card from "antd/es/card/Card";
import EditNdsModal from "./EditNdsModal";

interface NdsData {
  id: string;
  name: string;
  description: string;
  value: number;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
}

const NdsTable: React.FC = () => {
  const [data, setData] = useState<NdsData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [searchedItem, setSearchedItem] = useState<NdsData | null>(null);
  const [selectedItem, setSelectedItem] = useState<NdsData | null>(null);
  const [deletedItems, setDeletedItems] = useState<{
    [key: string]: NdsData;
  }>({});

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    console.log("Состояние данных:", data);
  }, [data]);

  const fetchData = async () => {
    try {
      const result = await getNdsData();
      console.log("Результат получения данных:", result);
      if (Array.isArray(result)) {
        setData(result);
      } else {
        throw new Error("Полученные данные не являются массивом.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Произошла ошибка при получении данных.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    fetchData();
  };

  const handleEdit = async (
    id: string,
    values: {
      name: string;
      description: string;
      value: number;
      deletedAt: string;
    }
  ) => {
    try {
      if (!id) {
        throw new Error("ID не указан.");
      }
      console.log("Sending values to update:", values);
      await updateNdsById(id, values);
      setData((prevData) => {
        const newData = prevData.map((item) =>
          item.id === id ? { ...item, ...values } : item
        );
        return newData;
      });

      setIsEditModalVisible(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Ошибка при обновлении:", error);
    }
  };

  const handleSearch = (item: NdsData) => {
    setSearchedItem(item);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNdsById(id);
      message.success("Товар успешно удален.");
      fetchData();
    } catch (error) {
      message.error("Ошибка при удалении товара.");
    }
  };

  const handleSoftDelete = async (id: string) => {
    try {
      const itemData = await getItemById(id);
      console.log("Данные о товаре перед удалением:", itemData);
      const itemCopy = { ...itemData };
      await softDeleteNdsById(id);
      setDeletedItems((prevItems) => ({
        ...prevItems,
        [id]: itemCopy,
      }));
      message.success("Товар успешно мягко удален.");
      fetchData();
    } catch (error) {
      message.error("Ошибка при мягком удалении товара.");
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const deletedItem = deletedItems[id];
      console.log("Удаленный товар для восстановления:", deletedItem);
      if (!deletedItem) {
        message.error("Элемент не найден в удаленных товарах.");
        return;
      }
      console.log("Восстанавливаем товар с ID:", id);
      await restoreNdsById(id);
      console.log("Товар успешно восстановлен.");
      message.success("Товар успешно восстановлен.");
      setDeletedItems((prevItems) => {
        const newItems = { ...prevItems };
        delete newItems[id];
        console.log("Обновленное состояние удаленных товаров:", newItems);
        return newItems;
      });
      fetchData();
    } catch (error) {
      message.error("Ошибка при восстановлении товара.");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin tip="Загрузка данных..." />
      </div>
    );
  }

  if (error) {
    message.error(error);
    return <div>{error}</div>;
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Значение",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Дата создания",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: "Дата обновления",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: "Дата удаления",
      dataIndex: "deletedAt",
      key: "deletedAt",
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: "Действия",
      key: "action",
      render: (record: NdsData) => (
        <div style={{ display: "block" }}>
          <Button
            onClick={() => {
              setSelectedItem(record);
              setIsEditModalVisible(true);
            }}
            style={{ marginRight: 8, marginBottom: 8 }}
          >
            Редактировать
          </Button>
          <Popconfirm
            title="Вы уверены, что хотите удалить этот товар?"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button style={{ marginRight: 8, marginBottom: 8 }}>Удалить</Button>
          </Popconfirm>
          <Popconfirm
            title="Вы уверены, что хотите мягко удалить этот товар?"
            onConfirm={() => handleSoftDelete(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button type="default" style={{ marginRight: 8, marginBottom: 8 }}>
              Мягко удалить
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Вы уверены, что хотите восстановить этот товар?"
            onConfirm={() => handleRestore(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button type="dashed">Восстановить</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: 16 }}
      >
        Добавить товар
      </Button>
      <SearchNdsForm onSearch={handleSearch} />

      {searchedItem ? (
        <Card title="Найденный товар" style={{ marginTop: 16 }}>
          <p>ID: {searchedItem.id}</p>
          <p>Название: {searchedItem.name}</p>
          <p>Описание: {searchedItem.description}</p>
          <p>Значение: {searchedItem.value}</p>
          <p>
            Дата создания: {new Date(searchedItem.createdAt).toLocaleString()}
          </p>
          <p>
            Дата обновления: {new Date(searchedItem.updatedAt).toLocaleString()}
          </p>
          <p>
            Дата удаления: {new Date(searchedItem.deletedAt).toLocaleString()}
          </p>
          <Button type="primary" onClick={() => setSearchedItem(null)}>
            Вернуться к списку
          </Button>
        </Card>
      ) : (
        <Table
          dataSource={data}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}
      <AddNdsModal
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAdd={handleAdd}
      />

      <EditNdsModal
        open={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setSelectedItem(null);
        }}
        onEdit={handleEdit}
        initialData={
          selectedItem || {
            id: "",
            name: "",
            description: "",
            value: 0,
            deletedAt: "",
          }
        }
      />
    </>
  );
};

export default NdsTable;
