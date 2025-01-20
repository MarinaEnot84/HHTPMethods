import React, { useCallback, useEffect, useState } from "react";
import { Table, message, Spin, Button } from "antd";
import {
  deleteNdsById,
  getItemById,
  getNdsData,
  restoreNdsById,
  softDeleteNdsById,
  updateNdsById,
} from "../../model/api/ndsApi";
import AddNdsModal from "../AddNds/AddNdsModal";
import SearchNdsForm from "../SearchForm/SearchNdsForm";
import Card from "antd/es/card/Card";
import EditNdsModal from "../EditNds/EditNdsModal";
import { NdsData, NdsState } from "./types";
import getColumns from "./columns";

const NdsTable: React.FC = () => {
  const [state, setState] = useState<NdsState>({
    data: [] as NdsData[],
    loading: true,
    error: null as string | null,
    isModalVisible: false,
    isEditModalVisible: false,
    searchedItem: null as NdsData | null,
    selectedItem: null as NdsData | null,
    deletedItems: {} as { [key: string]: NdsData },
  });

  const {
    data,
    loading,
    error,
    isModalVisible,
    isEditModalVisible,
    searchedItem,
    selectedItem,
    deletedItems,
  } = state;

  useEffect(() => {
    fetchData();
  }, []);

  const updateState = (newState: Partial<NdsState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  };

  const fetchData = async () => {
    updateState({ loading: true });
    try {
      const result = await getNdsData();
      if (Array.isArray(result)) {
        updateState({ data: result });
      } else {
        throw new Error("Полученные данные не являются массивом.");
      }
    } catch (error) {
      updateState({
        error:
          error instanceof Error
            ? error.message
            : "Произошла ошибка при получении данных.",
      });
    } finally {
      updateState({ loading: false });
    }
  };

  const handleAdd = useCallback(() => {
    fetchData();
  }, []);

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
      await updateNdsById(id, values);
      updateState({
        data: state.data.map((item) =>
          item.id === id ? { ...item, ...values } : item
        ),
        isEditModalVisible: false,
        selectedItem: null,
      });
    } catch (error) {
      message.error("Ошибка при обновлении товара.");
    }
  };

  const handleSearch = (item: NdsData) => {
    updateState({ searchedItem: item });
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
      const itemCopy = { ...itemData };
      updateState({ deletedItems: { ...state.deletedItems, [id]: itemCopy } });
      await softDeleteNdsById(id);
      message.success("Товар успешно мягко удален.");
      fetchData();
    } catch (error) {
      message.error("Ошибка при мягком удалении товара.");
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const deletedItem = deletedItems[id];
      if (!deletedItem) {
        message.error("Элемент не найден в удаленных товарах.");
        return;
      }
      await restoreNdsById(id, deletedItem);
      message.success("Товар успешно восстановлен.");
      setState((prev) => {
        const { [id]: _, ...newDeletedItems } = prev.deletedItems;
        return { ...prev, deletedItems: newDeletedItems };
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

  const columns = getColumns(
    handleDelete,
    handleSoftDelete,
    handleRestore,
    setState
  );

  return (
    <>
      <Button
        type="primary"
        onClick={() => setState((prev) => ({ ...prev, isModalVisible: true }))}
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
          <Button
            type="primary"
            onClick={() =>
              setState((prev) => ({ ...prev, searchedItem: null }))
            }
          >
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
        onClose={() => setState((prev) => ({ ...prev, isModalVisible: false }))}
        onAdd={handleAdd}
      />

      <EditNdsModal
        open={isEditModalVisible}
        onClose={() => {
          setState((prev) => ({ ...prev, isEditModalVisible: false }));
          setState((prev) => ({ ...prev, selectedItem: null }));
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
