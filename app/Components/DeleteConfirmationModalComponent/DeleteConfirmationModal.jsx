import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Modal, Typography } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

const DeleteConfirmationModal = ({
  isDeleteModalVisible,
  setIsDeleteModalVisible,
  shiftToDelete,
  handleDelete,
}) => {
  // Guard clause to handle cases where shiftToDelete is undefined or null
  if (!shiftToDelete) return null;

  return (
    <Modal
      title={
        <div className="flex items-center">
          <ExclamationCircleOutlined className="text-orange-500 mr-2 text-xl" />
          <span className="text-lg font-semibold">Confirm Deletion</span>
        </div>
      }
      open={isDeleteModalVisible} // Controls modal visibility
      onOk={handleDelete} // Handles delete action
      onCancel={() => setIsDeleteModalVisible(false)} // Closes the modal on cancel
      okText="Delete"
      okButtonProps={{
        danger: true,
        className:
          "font-medium bg-red-500 hover:bg-red-600 text-white rounded-md",
      }}
      cancelText="Cancel"
      cancelButtonProps={{
        className:
          "font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md",
      }}
      centered
      width={520}
    >
      <div className="p-2 rounded-md">
        <div className="space-y-2">
          <p className="text-gray-800 text-sm">
            Are you sure you want to delete the shift for{" "}
            <Text className="font-semibold text-gray-900">
              {shiftToDelete.branch}
            </Text>
            ?
          </p>          
          <p className="text-xs text-gray-500">
            This action{" "}
            <span className="font-semibold text-red-600">cannot</span> be
            undone.
          </p>
        </div>
      </div>
    </Modal>
  );
};

// PropTypes validation
DeleteConfirmationModal.propTypes = {
  isDeleteModalVisible: PropTypes.bool.isRequired, // Boolean: required
  setIsDeleteModalVisible: PropTypes.func.isRequired, // Function: required
  shiftToDelete: PropTypes.shape({
    branch: PropTypes.string.isRequired, // Object with branch (string) and shiftDate (string)
    shiftDate: PropTypes.string.isRequired,
  }).isRequired,
  handleDelete: PropTypes.func.isRequired, // Deletion handler: required
};

export default DeleteConfirmationModal;
