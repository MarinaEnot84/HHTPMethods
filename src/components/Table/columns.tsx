import React from "react";
import { Button, Popconfirm } from "antd";
import { NdsData, NdsState } from "./types";

const formatDate = (text: string) => new Date(text).toLocaleString();
const getColumns = (
  handleDelete: (id: string) => void,
  handleSoftDelete: (id: string) => void,
  handleRestore: (id: string) => void,
  setState: React.Dispatch<React.SetStateAction<any>>
) => {
  return [
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
      render: formatDate,
    },
    {
      title: "Дата обновления",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: formatDate,
    },
    {
      title: "Дата удаления",
      dataIndex: "deletedAt",
      key: "deletedAt",
      render: formatDate,
    },
    {
      title: "Действия",
      key: "action",
      render: (record: NdsData) => (
        <div style={{ display: "block" }}>
          <Button
            onClick={() => {
              setState((prev: NdsState) => ({
                ...prev,
                selectedItem: record,
                isEditModalVisible: true,
              }));
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
            <Button type="default" style={{ marginRight: 8, marginBottom: 8 }}>
              Удалить
            </Button>
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
};

export default getColumns;
