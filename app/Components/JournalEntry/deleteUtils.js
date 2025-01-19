import { Modal } from "antd";

export const handleBulkDelete = (items, setItems, selectedRowKeys, setSelectedRowKeys, setLoading, notification) => {
  Modal.confirm({
    title: "Are you sure you want to delete these entries?",
    content: "This action cannot be undone.",
    onOk() {
      setLoading(true);
      setTimeout(() => {
        setItems(items.filter((item) => !selectedRowKeys.includes(item.id)));
        setSelectedRowKeys([]);
        setLoading(false);
        notification.success({
          message: "Entries Deleted",
          description: "Selected entries deleted successfully.",
          placement: "topRight",
        });
      }, 1000);
    },
    onCancel() {
      setSelectedRowKeys([]);
    },
  });
};

