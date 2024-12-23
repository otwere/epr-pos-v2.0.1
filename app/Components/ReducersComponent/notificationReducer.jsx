export const reducer = (state, action) => {
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
  
  