import React from "react";
import { Button, Tooltip, Space } from "antd";
import { LeftOutlined, RightOutlined, SaveOutlined } from "@ant-design/icons";

const FormNavigation = ({ currentPage, steps, prevPage, nextPage, showModal, isSubmitting }) => (
  <Space className="flex justify-between w-full">
    {currentPage > 1 && (
      <Tooltip title="Previous Page">
        <Button
          icon={<LeftOutlined />}
          onClick={prevPage}
          className="bg-gray-300 text-black hover:bg-gray-400 rounded-lg px-4 py-2 ml-auto"
        >
          Previous
        </Button>
      </Tooltip>
    )}
    {currentPage < steps.length ? (
      <Tooltip title="Next Page">
      <div className="flex justify-end">
        <Button
          type="primary"
          onClick={nextPage}
          icon={<RightOutlined />}
          className="bg-blue-500 text-white hover:bg-blue-600 rounded-lg px-4 py-2"
        >
          Next
        </Button>
      </div>
    </Tooltip>
    
    ) : (
      <Tooltip title="Save Employee">
        <Button
          type="primary"
          onClick={showModal}
          icon={<SaveOutlined />}
          className="bg-blue-500 text-white hover:bg-blue-600 rounded-lg px-4 py-2"
          disabled={isSubmitting}
        >
          Save Employee
        </Button>
      </Tooltip>
    )}
  </Space>
);

export default FormNavigation;