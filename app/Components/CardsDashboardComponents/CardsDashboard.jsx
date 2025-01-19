import React, { useRef } from "react";
import { Breadcrumb, Typography, Card } from "antd";
import Link from "next/link";
import DateTime from "../DateTimeComponent/DateTime";

const { Text } = Typography;

// Utility function to get current month and year
const getCurrentMonth = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${month}-${year}`;
};

// Enhanced CardsDashboard component with improved routing and Antd styling
const CardsDashboard = (props) => {
  const cardRefs = useRef([]);

  const handleCardClick = (item, index) => {
    // If the card has a link, use Next.js routing
    if (item.link) {
      window.location.href = item.link;
    } else {
      console.log(`${item.title} card clicked!`);
      console.log("Card Ref:", cardRefs.current[index]); // Log the specific card's ref
    }
  };

  return (
    <div className="site-card-wrapper bg-gray-50">
      <CustomBreadcrumb />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {props.data.map((item, index) => (
          <Card
            key={index}
            ref={cardRefs.current[index]} // Assign ref for each card
            className={` 
              ${item.color} ${item.hoverColor}
              text-white cursor-pointer transition duration-300 
              transform hover:scale-95 hover:shadow-xl
            `}
            style={{
              body: {
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                color: 'white',
              },
            }}
            onClick={() => handleCardClick(item, index)}
          >
            <div className="flex items-center w-full">
              <div className="text-3xl mr-4 border-r-2 border-white pr-3">
                {item.icon}
              </div>
              <div className="flex-grow">
                <Text strong className="block text-xs text-white mb-1">
                  {item.title}
                </Text>
                <Text strong className="block text-xs text-white mb-2">
                  {item.amount}
                </Text>
                {item.subtitle && (
                  <div className="border-t border-gray-300 pt-1 text-xs text-gray-200">
                    {item.subtitle}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const CustomBreadcrumb = () => (
  <div className="mb-4 flex justify-between items-center border-b border-gray-300 pb-2">
    <Breadcrumb
      items={[
        { title: <Link href="/">Home</Link> },
        { title: "Dashboard" },
      ]}
    />
    <DateTime />
  </div>
);

// Enhanced card data with more detailed customer information
const cardData = [
  {
    key: 1,
    title: "TODAY'S SALES",
    amount: "Kshs 150,210.00",
    subtitle: new Date().toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
    }),
    color: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
    icon: "💵",
  },
  {
    key: 2,
    title: "CREDIT SALES",
    amount: "Kshs 2,000.00",
    subtitle: "Accounts Receivable",
    color: "bg-teal-600",
    hoverColor: "hover:bg-teal-700",
    icon: "📈",
  },
  {
    key: 3,
    title: "PURCHASE DUE",
    amount: "Kshs 66,250.00",
    subtitle: "Accounts Payable",
    color: "bg-lime-600",
    hoverColor: "hover:bg-lime-700",
    icon: "📬",
    link: "/Purchase_Analysis_List",
  },
  {
    key: 4,
    title: "EXPENSE AMOUNT",
    amount: "Kshs 4,550.00",
    subtitle: `For ${getCurrentMonth()}`,
    color: "bg-red-500",
    hoverColor: "hover:bg-red-700",
    icon: "💸",
    link: "/expenditure_breakdown",
  },
  {
    key: 5,
    title: "CUSTOMERS | CLIENTS",
    amount: "Total Clients - 120",
    subtitle: `Clients - 3 | ${getCurrentMonth()}`,
    color: "bg-green-600",
    hoverColor: "hover:bg-green-700",
    icon: "🧑‍🤝‍🧑",
    link: "/customers_list",
  },
  {
    key: 6,
    title: "SUPPLIERS",
    amount: "Total Suppliers - 30",
    subtitle: `Active Suppliers - 25 | ${getCurrentMonth()}`,
    color: "bg-slate-600",
    hoverColor: "hover:bg-slate-700",
    icon: "🚚",
  },
  {
    key: 7,
    title: "PURCHASE INVOICE",
    amount: "Total Invoices - 12",
    subtitle: `Pending - 3 | ${getCurrentMonth()}`,
    color: "bg-orange-400",
    hoverColor: "hover:bg-orange-700",
    icon: "📄",
    link: "/Purchase_List",
  },
  {
    key: 8,
    title: "SALES INVOICE",
    amount: "Total Invoices - 3",
    subtitle: `Paid - 1 | ${getCurrentMonth()}`,
    color: "bg-yellow-600",
    hoverColor: "hover:bg-yellow-700",
    icon: "📄",
    link: "/Invoice_Sales",
  },
];

// Use the CardsDashboard component with card data
const Cards = () => {
  return <CardsDashboard data={cardData} />;
};

export default Cards;

