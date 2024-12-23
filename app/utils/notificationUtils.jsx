export const generateUniqueMessages = (numMessages, tillNumber) => {
    const messages = [];
    for (let i = 0; i < numMessages; i++) {
      const date = new Date();
      date.setMinutes(date.getMinutes() + i);
      messages.push({
        id: `${tillNumber}-${i + 1}`,
        title: `Mpesa | Till No : ${tillNumber}`,
        content: `FDE2284E3 Confirmed you received Kshs.3000 from 0712345678 Client's Name ${date.toLocaleString()}. Mpesa Balance Kshs.230,000.00`,
        read: false,
        datetime: date.toISOString(),
        tillNumber,
      });
    }
    return messages;
  };
  
  export const initialMessages = [
    ...generateUniqueMessages(15, "000 721"),
    ...generateUniqueMessages(25, "000 722"),
  ];
  
  export const initialState = {
    messages: initialMessages,
    unreadCount: initialMessages.filter((message) => !message.read).length,
    selectedMessage: null,
    isModalOpen: false,
    collapsed: true,
    showAllMessages: false,
    searchInput: "",
  };
  
  