import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Switch,
  Row,
  Col,
  Select,
  Collapse,
  Radio,
  message,
} from "antd";
import dayjs from "dayjs";

const { Option } = Select;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;

const BenefitSupervisorStep = ({ form }) => {
  const gender = Form.useWatch("gender", form);
  const [maternityLeaveDays, setMaternityLeaveDays] = useState(null);
  const [paternityLeaveDays, setPaternityLeaveDays] = useState(null);
  const [maternityStartDate, setMaternityStartDate] = useState(null);
  const [paternityStartDate, setPaternityStartDate] = useState(null);
  const [annualLeaveDates, setAnnualLeaveDates] = useState(null);

  // Kenyan Public Holidays for 2023 with names
  const kenyanPublicHolidays2023 = [
    { date: "2023-01-01", name: "New Year's Day" },
    { date: "2023-04-07", name: "Good Friday" },
    { date: "2023-04-10", name: "Easter Monday" },
    { date: "2023-05-01", name: "Labour Day" },
    { date: "2023-06-01", name: "Madaraka Day" },
    { date: "2023-10-10", name: "Huduma Day" },
    { date: "2023-10-20", name: "Mashujaa Day" },
    { date: "2023-12-12", name: "Jamhuri Day" },
    { date: "2023-12-25", name: "Christmas Day" },
    { date: "2023-12-26", name: "Boxing Day" },
  ];

  // Function to find the next upcoming holiday with its name
  const getUpcomingHoliday = () => {
    const today = dayjs();
    for (const holiday of kenyanPublicHolidays2023) {
      const holidayDate = dayjs(holiday.date);
      if (holidayDate.isAfter(today)) {
        return `${holidayDate.format("D MMMM")} is Public Holiday: ${
          holiday.name
        }`; // Return the next holiday with name
      }
    }
    return "No upcoming holidays"; // If no holidays are left in the year
  };

  const upcomingHoliday = getUpcomingHoliday(); // Get the upcoming holiday with name

  useEffect(() => {
    if (gender === "male") {
      form.setFieldsValue({ maternityLeave: undefined }); // Clear maternity leave value
      form.setFieldsValue({ paternityLeave: "" }); // Enable paternity leave
    } else if (gender === "female") {
      form.setFieldsValue({ paternityLeave: undefined }); // Clear paternity leave value
      form.setFieldsValue({ maternityLeave: "" }); // Enable maternity leave
    }
  }, [gender, form]);

  const calculateEndDate = (startDate, days) => {
    let remainingDays = days;
    let currentDate = dayjs(startDate);

    while (remainingDays > 0) {
      currentDate = currentDate.add(1, "day");
      const dayOfWeek = currentDate.day(); // 0 = Sunday, 6 = Saturday
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isPublicHoliday = kenyanPublicHolidays2023.some(
        (holiday) => holiday.date === currentDate.format("DD-MM-YYYY")
      );

      if (!isWeekend && !isPublicHoliday) {
        remainingDays--;
      }
    }

    return currentDate;
  };

  const handleMaternityLeaveDaysChange = (value) => {
    setMaternityLeaveDays(value);
    if (maternityStartDate) {
      const endDate = calculateEndDate(maternityStartDate, value);
      form.setFieldsValue({ maternityLeave: [maternityStartDate, endDate] });
    }
  };

  const handlePaternityLeaveDaysChange = (value) => {
    setPaternityLeaveDays(value);
    if (paternityStartDate) {
      const endDate = calculateEndDate(paternityStartDate, value);
      form.setFieldsValue({ paternityLeave: [paternityStartDate, endDate] });
    }
  };

  const handleMaternityStartDateChange = (date) => {
    setMaternityStartDate(date);
    if (maternityLeaveDays) {
      const endDate = calculateEndDate(date, maternityLeaveDays);
      form.setFieldsValue({ maternityLeave: [date, endDate] });
    }
  };

  const handlePaternityStartDateChange = (date) => {
    setPaternityStartDate(date);
    if (paternityLeaveDays) {
      const endDate = calculateEndDate(date, paternityLeaveDays);
      form.setFieldsValue({ paternityLeave: [date, endDate] });
    }
  };

  // Function to calculate working days excluding weekends and public holidays
  const calculateWorkingDays = (startDate, endDate) => {
    let workingDays = 0;
    let currentDate = dayjs(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.day(); // 0 = Sunday, 6 = Saturday
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isPublicHoliday = kenyanPublicHolidays2023.some(
        (holiday) => holiday.date === currentDate.format("DD-MM-YYYY")
      );

      if (!isWeekend && !isPublicHoliday) {
        workingDays++;
      }

      currentDate = currentDate.add(1, "day");
    }

    return workingDays;
  };

  const handleAnnualLeaveDatesChange = (dates) => {
    if (dates && dates[0] && dates[1]) {
      const startDate = dates[0];
      const endDate = dates[1];
      const workingDays = calculateWorkingDays(startDate, endDate);

      if (workingDays > 21) {
        message.warning("Annual Leave cannot exceed 21 working days.");
        return; // Stop further processing if the limit is exceeded
      }

      setAnnualLeaveDates(dates);
      form.setFieldsValue({ annualLeave: workingDays }); // Automatically update Annual Leave input
    } else {
      setAnnualLeaveDates(null);
      form.setFieldsValue({ annualLeave: null }); // Clear Annual Leave input if no dates are selected
    }
  };

  // Disable dates outside the current year
  const disabledDate = (current) => {
    const startOfYear = dayjs().startOf("year");
    const endOfYear = dayjs().endOf("year");
    return current && (current < startOfYear || current > endOfYear);
  };

  const items = [
    {
      key: "mandatoryBenefits",
      label: "Mandatory Benefits and Deductions",
      children: (
        <>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="annualLeave"
                label="Annual Leave Days "
                rules={[
                  { required: true, message: "Annual Leave is required." },
                  {
                    validator: (_, value) => {
                      if (value > 21) {
                        return Promise.reject(
                          new Error(
                            "Annual Leave cannot exceed 21 working days."
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder="Enter annual leave entitlement"
                  min={0}
                  max={21}
                  readOnly // Make the input read-only
                  style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }} // Optional: Add styling to indicate it's read-only
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="annualLeaveDates"
                label="Select Annual Leave Dates"
                rules={[
                  { required: true, message: "Leave dates are required." },
                ]}
              >
                <RangePicker
                  style={{ width: "100%" }}
                  disabledDate={disabledDate}
                  onChange={handleAnnualLeaveDatesChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="publicHolidays" label="Public Holidays">
                <Input
                  value={upcomingHoliday}
                  readOnly
                  style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="sickLeaveApproval"
                label="Sick Leave Approval"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="Approved"
                  unCheckedChildren="Rejected"
                />
              </Form.Item>
            </Col>
          </Row>
          {/* Sick Leave Approval Section */}
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                name="sickLeaveComments"
                label="Supervisor Sick Approval Comments"
              >
                <Input.TextArea
                  placeholder="Enter comments for sick leave approval"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="maternityLeave"
                label="Maternity Leave"
                rules={[
                  {
                    required: gender === "female",
                    message: "Maternity Leave is required for females.",
                  },
                ]}
              >
                <RangePicker
                  style={{ width: "100%" }}
                  disabled={gender !== "female"}
                  placeholder={["Start Date", "End Date"]}
                  onChange={(dates) => handleMaternityStartDateChange(dates[0])}
                />
              </Form.Item>
              {gender === "female" && (
                <Form.Item
                  name="maternityLeaveDays"
                  label="Maternity Leave Days"
                  rules={[
                    {
                      required: gender === "female",
                      message: "Maternity Leave Days are required for females.",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select number of days"
                    onChange={handleMaternityLeaveDaysChange}
                  >
                    <Option value={15}>15 Days</Option>
                    <Option value={21}>21 Days</Option>
                    <Option value={30}>30 Days</Option>
                    <Option value={45}>45 Days</Option>
                    <Option value={60}>60 Days</Option>
                    <Option value={90}>90 Days</Option>
                  </Select>
                </Form.Item>
              )}
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="paternityLeave"
                label="Paternity Leave"
                rules={[
                  {
                    required: gender === "male",
                    message: "Paternity Leave is required for males.",
                  },
                ]}
              >
                <RangePicker
                  style={{ width: "100%" }}
                  disabled={gender !== "male"}
                  placeholder={["Start Date", "End Date"]}
                  onChange={(dates) => handlePaternityStartDateChange(dates[0])}
                />
              </Form.Item>
              {gender === "male" && (
                <Form.Item
                  name="paternityLeaveDays"
                  label="Paternity Leave Days"
                  rules={[
                    {
                      required: gender === "male",
                      message: "Paternity Leave Days are required for males.",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select number of days"
                    onChange={handlePaternityLeaveDaysChange}
                  >
                    <Option value={15}>15 Days</Option>
                    <Option value={21}>21 Days</Option>
                    <Option value={30}>30 Days</Option>
                    <Option value={45}>45 Days</Option>
                    <Option value={60}>60 Days</Option>
                    <Option value={90}>90 Days</Option>
                  </Select>
                </Form.Item>
              )}
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="nssf"
                label="NSSF Number"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter NSSF Number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="shif"
                label="SHIF Number"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter SHIF Number" />
              </Form.Item>
            </Col>
          </Row>
          {/* New Deductions Section */}
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="paye" label="PAYE" rules={[{ required: true }]}>
                <Input placeholder="Enter PAYE details" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="houseLevy"
                label="House Levy"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter House Levy details" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="nita" label="NITA" rules={[{ required: true }]}>
                <Input placeholder="Enter NITA details" />
              </Form.Item>
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: "optionalBenefits",
      label: "Optional Benefits",
      children: (
        <>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="pensionSchemes" label="Pension Schemes">
                <Select placeholder="Select pension schemes" mode="multiple">
                  <Option value="scheme1">Scheme 1</Option>
                  <Option value="scheme2">Scheme 2</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="groupLifeInsurance" label="Group Life Insurance">
                <Input placeholder="Enter group life insurance details" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="medicalInsurance" label="Medical Insurance">
                <Select
                  placeholder="Select medical insurance options"
                  mode="multiple"
                >
                  <Option value="basic">Basic Coverage</Option>
                  <Option value="premium">Premium Coverage</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="flexibleWorkArrangements"
                label="Flexible Work Arrangements"
              >
                <Radio.Group>
                  <Radio value="remoteWork">Remote Work</Radio>
                  <Radio value="flexHours">Flexible Hours</Radio>
                  <Radio value="onsite">Onsite</Radio>
                  <Radio value="hybrid">Hybrid</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="wellnessPrograms" label="Wellness Programs">
                <Select placeholder="Select wellness programs" mode="multiple">
                  <Option value="gymMembership">Gym Membership</Option>
                  <Option value="mentalHealth">Mental Health Support</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="subsidies" label="Subsidies">
                <Input placeholder="Enter subsidy details" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="employeeDiscounts" label="Employee Discounts">
                <Input placeholder="Enter employee discount details" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="onSiteBenefits" label="On-Site Benefits">
                <Input placeholder="Enter on-site benefits details" />
              </Form.Item>
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: "supervisor",
      label: "Supervisor Details",
      children: (
        <>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="supervisorName"
                label="Supervisor Name"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter supervisor name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="isSupervisor"
                label="Is Supervisor"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="supervisorReport" label="Supervisor Report">
                <Input.TextArea placeholder="Enter supervisor report" />
              </Form.Item>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  return (
    <>
      <Collapse
        defaultActiveKey={[
          "mandatoryBenefits",
          "optionalBenefits",
          "supervisor",
        ]}
        items={items}
      />
    </>
  );
};

export default BenefitSupervisorStep;
