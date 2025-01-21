"use client";
import React, { useReducer } from "react";
import { Badge, Dropdown, Button, Modal, Input } from "antd";
import { MailOutlined, SearchOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";

const generateUniqueMessages = (numMessages, tillNumber) => {
  const messages = [];
  for (let i = 0; i < numMessages; i++) {
    const date = new Date();
    date.setMinutes(date.getMinutes() + i);
    messages.push({
      id: `${tillNumber}-${i + 1}`,
      title: `Mpesa | Till No : ${tillNumber}`,
      content: `FDE2284E3 Confirmed you received KES : 3000 from 0712345678 Client's Name ${date.toLocaleString()}. Mpesa Balance KES : 230,000.00`,
      read: false,
      datetime: date.toISOString(),
      tillNumber,
    });
  }
  return messages;
};

const initialMessages = [
  ...generateUniqueMessages(15, "000 721"),
  ...generateUniqueMessages(25, "000 722"),
];

const initialState = {
  messages: initialMessages,
  unreadCount: initialMessages.filter((message) => !message.read).length,
  selectedMessage: null,
  isModalOpen: false,
  collapsed: true,
  showAllMessages: false,
  searchInput: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "MARK_AS_READ":
      const updatedMessages = state.messages.map((message) =>
        message.id === action.payload && !message.read
          ? { ...message, read: true }
          : message
      );
      const unreadCount = updatedMessages.filter(
        (message) => !message.read
      ).length;
      return {
        ...state,
        messages: updatedMessages,
        unreadCount: unreadCount,
      };
    case "SHOW_MESSAGE":
      const selectedMessage = state.messages.find(
        (message) => message.id === action.payload
      );
      return {
        ...state,
        selectedMessage: selectedMessage,
        isModalOpen: true,
      };
    case "HIDE_MODAL":
      return {
        ...state,
        isModalOpen: false,
      };
    case "TOGGLE_COLLAPSE":
      return {
        ...state,
        collapsed: !state.collapsed,
      };
    case "SHOW_ALL_MESSAGES":
      return {
        ...state,
        showAllMessages: true,
      };
    case "UPDATE_SEARCH_INPUT":
      return {
        ...state,
        searchInput: action.payload,
      };
    default:
      return state;
  }
};

const NotificationIcon = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const markAsRead = (messageId) => {
    dispatch({ type: "MARK_AS_READ", payload: messageId });
  };

  const showMessage = (messageId) => {
    dispatch({ type: "SHOW_MESSAGE", payload: messageId });
    markAsRead(messageId);
  };

  const toggleCollapse = () => {
    dispatch({ type: "TOGGLE_COLLAPSE" });
  };

  const handleSearchInputChange = (e) => {
    dispatch({ type: "UPDATE_SEARCH_INPUT", payload: e.target.value });
  };

  const handleShowAllMessages = () => {
    dispatch({ type: "SHOW_ALL_MESSAGES" });
  };

  let messagesToDisplay = state.messages;
  if (!state.showAllMessages) {
    messagesToDisplay = state.messages.slice(0, 9);
  }

  const filteredMessages = messagesToDisplay.filter(
    (message) =>
      message.title.toLowerCase().includes(state.searchInput.toLowerCase()) ||
      message.content.toLowerCase().includes(state.searchInput.toLowerCase())
  );

  const menuItems = [
    {
      key: "search",
      label: (
        <Input
          prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
          placeholder="Search messages"
          value={state.searchInput}
          onChange={handleSearchInputChange}
          onClick={(e) => e.stopPropagation()}
          style={{ width: "100%", marginBottom: 10 }}
        />
      ),
    },
    ...filteredMessages.map((message) => ({
      key: message.id,
      label: (
        <div
          onClick={() => showMessage(message.id)}
          className={`p-4 border-b border-gray-200 ${
            message.read ? "opacity-70" : "opacity-100"
          }`}
        >
          <div className="flex justify-between">
            <strong
              className={
                message.read ? "text-green-500" : "text-safaricomGreen"
              }
            >
              {message.title}
            </strong>
            <span className="text-xs text-gray-500">
              {message.read ? "Read" : "Unread"}
            </span>
          </div>
          <p className="text-sm mt-1 mb-0">{message.content}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(message.datetime).toLocaleString()}
          </p>
        </div>
      ),
    })),

    !state.showAllMessages && {
      key: "show-more",
      label: (
        <Button type="link" block onClick={handleShowAllMessages}>
          Show More Messages
        </Button>
      ),
    },
  ];

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString();
  };

  const readBy = "Nuru Blessing";
  const readerRole = "Company MD";

  return (
    <>
      <Dropdown
        menu={{
          items: menuItems,
        }}
        placement="bottomRight"
        trigger={["click"]}
      >
        <Badge count={state.unreadCount} overflowCount={99} offset={[10, 0]}>
          <MailOutlined className="text-blue-600 text-3xl -ml-1" />
        </Badge>
      </Dropdown>
      <Modal
        title={
          <span className="text-safaricomGreen">
            {state.selectedMessage ? state.selectedMessage.title : ""}
          </span>
        }
        open={state.isModalOpen}
        onOk={() => dispatch({ type: "HIDE_MODAL" })}
        onCancel={() => dispatch({ type: "HIDE_MODAL" })}
        footer={[
          <Button
            className="bg-blue-600 text-white"
            key="back"
            onClick={() => dispatch({ type: "HIDE_MODAL" })}
          >
            OK
          </Button>,
        ]}
        style={{ maxWidth: "700px" }}
      >
        <p>{state.selectedMessage ? state.selectedMessage.content : ""}</p>
        <hr  className="mt-3"/>
        <p className="text-xs text-gray-500 pt-3">          
          <span className="mx-0"></span>
          Read by : {readBy} - {readerRole} on : {getCurrentDateTime()}
        </p>
      </Modal>
    </>
  );
};

export default NotificationIcon;
