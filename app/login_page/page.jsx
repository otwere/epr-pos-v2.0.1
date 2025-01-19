"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRightOutlined,
  LoadingOutlined,
  AppstoreOutlined,
  LineChartOutlined,
  ShopOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { notification, Spin, Progress } from "antd";
import "../login_page/LoginPage.css";



export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter(); // Updated usage
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (type, message, description, pauseOnHover = true) => {
    const duration = 3; // Duration in seconds
    let progress = 100;
    let reverse = false;

    const interval = setInterval(() => {
      if (reverse) {
        progress += 100 / (duration * 10);
        if (progress >= 100) {
          clearInterval(interval);
        }
      } else {
        progress -= 100 / (duration * 10);
        if (progress <= 0) {
          reverse = true;
        }
      }
    }, 100);

    api[type]({
      message,
      description: (
        <div>
          {description}
          <Progress
            percent={progress}
            showInfo={false}
            strokeColor={type === "success" ? "#52c41a" : "#ff4d4f"}
            style={{ marginTop: 10 }}
          />
        </div>
      ),
      placement: "topRight",
      duration,
      style: {
        backgroundColor: type === "success" ? "#f6ffed" : "#fff1f0",
        borderColor: type === "success" ? "#b7eb8f" : "#ffa39e",
      },
      icon: type === "success" ? (
        <CheckCircleOutlined style={{ color: "#52c41a" }} />
      ) : (
        <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
      ),
      onMouseEnter: pauseOnHover ? () => clearInterval(interval) : null,
      onMouseLeave: pauseOnHover ? () => {
        interval = setInterval(() => {
          if (reverse) {
            progress += 100 / (duration * 10);
            if (progress >= 100) {
              clearInterval(interval);
            }
          } else {
            progress -= 100 / (duration * 10);
            if (progress <= 0) {
              reverse = true;
            }
          }
        }, 100);
      } : null,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      // Simulate network request
      if (
        formData.username === "correctUsername" &&
        formData.password === "correctPassword"
      ) {
        openNotification(
          "success",
          "Login Successful",
          "You have successfully logged in to  Dashboard.",
          true // Pause on hover
        );
        router.push("/");
      } else {
        openNotification(
          "error",
          "Login Failed",
          "Invalid username or password.",
          true // Pause on hover
        );
        setLoading(false);
      }
    }, 500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {contextHolder}
      {/* Left Content Section */}
      <div className="relative w-full lg:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 p-8 text-gray-50">
        <div className="max-w-2xl mx-auto py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-6 text-center">
              Integrated Business Management
            </h1>
            <p className="text-white/90 text-lg mb-8 text-center">
              Transform your business with our comprehensive management system
            </p>
          </div>

          <div className="grid gap-8">
            <FeatureCard
              title="Unified Platform"
              description="Seamlessly integrated ERP-POS operations in one powerful platform with eTIMS ready"
              icon={<AppstoreOutlined />}
            />
            <FeatureCard
              title="Real-time Analytics"
              description="Make data-driven decisions with instant insights and reporting"
              icon={<LineChartOutlined />}
            />
            <FeatureCard
              title="Smart Inventory"
              description="Automated stock management across all your sales channels"
              icon={<ShopOutlined />}
            />
            <FeatureCard
              title="Human Resource Management (HRM)"
              description="Efficiently manage your workforce with our comprehensive HRM tools , Payroll, Payslips"
              icon={<UserOutlined />}
            />
          </div>
        </div>
      </div>

      {/* Right Login Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 text-blue-600">
              <div className="flex justify-center mb-8">
                <svg
                  width="80"
                  height="70"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                    fill="#3B82F6"
                  />
                  <path
                    d="M9.29 12.29l1.42 1.42L15.29 9.71l1.42 1.42-6 6-3-3 1.42-1.42z"
                    fill="#3B82F6"
                  />
                </svg>
              </div>
              Snave Webhub Africa
            </h2>
            <p className="text-gray-600">
              Access your Business EPR -POS Management Dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-4 py-3 rounded-md border border-blue-300 focus:ring-0 focus:ring-blue-500 focus:border-transparent"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-lg border border-blue-300 focus:ring-0 focus:ring-blue-500 focus:border-transparent"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-gray-50 font-semibold py-3 px-4 rounded-md transition duration-300 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <Spin
                    indicator={
                      <LoadingOutlined
                        style={{ fontSize: 24, color: "white" }}
                        spin
                      />
                    }
                  />
                ) : (
                  "Login to Dashboard"
                )}
                {!loading && <ArrowRightOutlined className="ml-2" />}
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-500">
              Need assistance? <a href="#" className="text-blue-600 hover:text-blue-700">Contact Admin</a>
            </p>
          </div>
        </div>
      </div>
      
      
    </div>
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-95">
      <div className="flex items-center mb-2">
        {React.cloneElement(icon, { style: { fontSize: '26px' } })}
        <h3 className="text-xl font-semibold text-white ml-2">{title}</h3>
      </div>
      <p className="text-white/80 mb-0">{description}</p>
    </div>
  );
}
