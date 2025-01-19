import React, { useState, useEffect } from "react";
import { Form, Input, DatePicker, Select, Row, Col, Divider, Radio } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const { Option } = Select;

const banksInKenya = [
  "Kenya Commercial Bank (KCB)",
  "Equity Bank",
  "Co-operative Bank of Kenya",
  "Standard Chartered Bank Kenya",
  "Barclays Bank of Kenya",
  "Diamond Trust Bank",
  "Stanbic Bank Kenya",
  "NIC Bank",
  "I&M Bank",
  "National Bank of Kenya",
];

const PersonalInformationStep = ({ form }) => {
  const [isTerminated, setIsTerminated] = useState(false);
  const [isKenyanCitizen, setIsKenyanCitizen] = useState(true);
  const [isRehired, setIsRehired] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rehireDateLabel, setRehireDateLabel] = useState("Re Hire Date");

  useEffect(() => {
    const gender = form.getFieldValue("gender");
    form.setFieldsValue({ gender });
  }, [form]);

  const handleTerminationChange = (value) => {
    setIsTerminated(value === "yes");
  };

  const handleCitizenshipChange = (e) => {
    setIsKenyanCitizen(e.target.value === "kenyan");
  };

  const handleRehireChange = (value) => {
    setIsRehired(value === "reHired" || value === "reinstated" || value === "reAppointed");
    if (value === "reHired") {
      setRehireDateLabel("Re-Hire Date");
    } else if (value === "reinstated") {
      setRehireDateLabel("Re-Instated Date");
    } else if (value === "reAppointed") {
      setRehireDateLabel("Re-Appointment Date");
    } else {
      setRehireDateLabel("Re Hire Date");
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleGenderChange = (value) => {
    form.setFieldsValue({ gender: value });
  };

  const filteredBanks = banksInKenya.filter((bank) =>
    bank.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const disabledFutureDate = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const validateAge = (_, value) => {
    if (value) {
      const today = dayjs();
      const dob = dayjs(value);
      const age = today.diff(dob, "years");

      if (age < 18) {
        return Promise.reject("The person must be at least 18 years old.");
      }
    }
    return Promise.resolve();
  };

  const validateIdentityOrPassport = ({ getFieldValue }) => ({
    validator(_, value) {
      const idNo = getFieldValue("identityCardNo");
      const passportNo = getFieldValue("passportNo");
      const foreignPermitNo = getFieldValue("foreignPermitNo");
      const workPermitNo = getFieldValue("workPermitNo");

      if (isKenyanCitizen && !idNo) {
        return Promise.reject("Kenyan ID No. is required for Kenyan citizens.");
      }

      if (!isKenyanCitizen && !passportNo && !foreignPermitNo && !workPermitNo) {
        return Promise.reject("Either Passport No., Foreign Permit No., or Work Permit No. is required for foreign residents.");
      }

      return Promise.resolve();
    },
  });

  const dateFormat = "DD-MM-YYYY";

  return (
    <>
      <Divider orientation="left">
        <FileTextOutlined /> Biographical Info
      </Divider>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="dateOfBirth"
            label="Date of Birth *"
            rules={[
              { required: true, message: "This field is required" },
              { validator: validateAge },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format={dateFormat}
              disabledDate={disabledFutureDate}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="gender"
            label="Gender *"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Select placeholder="Select gender" onChange={handleGenderChange}>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="maritalStatus"
            label="Marital Status *"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Select placeholder="Select marital status">
              <Option value="single">Single</Option>
              <Option value="married">Married</Option>
              <Option value="divorced">Divorced</Option>
              <Option value="widowed">Widowed</Option>
              <Option value="separated">Separated</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="ethnicGroup" label="Ethnic Group">
            <Input placeholder="Enter ethnic group" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="citizenship"
            label="Citizenship *"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Radio.Group onChange={handleCitizenshipChange} defaultValue="kenyan">
              <Radio value="kenyan">Kenyan Citizen</Radio>
              <Radio value="foreign">Foreign Resident</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      {isKenyanCitizen ? (
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="identityCardNo"
              label="Kenyan ID No. *"
              rules={[
                {
                  required: true,
                  message: "Kenyan ID No. is required for Kenyan citizens.",
                },
              ]}
            >
              <Input placeholder="Enter Kenyan ID No." />
            </Form.Item>
          </Col>
        </Row>
      ) : (
        <>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="passportNo"
                label="Passport No. *"
                rules={[
                  {
                    required: true,
                    message: "Passport No. is required for foreign residents.",
                  },
                ]}
              >
                <Input placeholder="Enter Passport No." />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="placeOfIssuance"
                label="Place of Issuance *"
                rules={[
                  {
                    required: true,
                    message: "Place of Issuance is required for foreign residents.",
                  },
                ]}
              >
                <Input placeholder="Enter Place of Issuance" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="issuanceAuthority"
                label="Issuance Authority *"
                rules={[
                  {
                    required: true,
                    message: "Issuance Authority is required for foreign residents.",
                  },
                ]}
              >
                <Input placeholder="Enter Issuance Authority" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="dateOfIssue"
                label="Date of Issue *"
                rules={[
                  {
                    required: true,
                    message: "Date of Issue is required for foreign residents.",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format={dateFormat}
                  disabledDate={disabledFutureDate}
                  placeholder="Select Date of Issue"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="expiryDate"
                label="Expiry Date *"
                rules={[
                  {
                    required: true,
                    message: "Expiry Date is required for foreign residents.",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format={dateFormat}
                  placeholder="Select Expiry Date"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="foreignPermitNo"
                label="Foreign Permit No."
                rules={[
                  {
                    validator: validateIdentityOrPassport,
                  },
                ]}
              >
                <Input placeholder="Enter Foreign Permit No." />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="workPermitNo"
                label="Work Permit No."
                rules={[
                  {
                    validator: validateIdentityOrPassport,
                  },
                ]}
              >
                <Input placeholder="Enter Work Permit No." />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="countryOfOrigin"
                label="Country of Origin *"
                rules={[
                  { required: true, message: "Country of Origin is required for foreign residents." },
                ]}
              >
                <Input placeholder="Enter Country of Origin" />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name="kraPinNo" label="KRA PIN No.">
            <Input placeholder="Enter KRA PIN no." />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="hudumaNo" label="Huduma No.">
            <Input placeholder="Enter huduma no." />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name="nssfNo" label="NSSF No.">
            <Input placeholder="Enter NSSF no." />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="shifNo" label="SHIF No.">
            <Input placeholder="Enter SHIF no." />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">
        <FileTextOutlined /> Personal Information
      </Divider>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="divisionDepartment"
            label="Division | Department *"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Select placeholder="Select division or department">
              <Option value="division1">Division 1</Option>
              <Option value="division2">Division 2</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="position"
            label="Position *"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Select placeholder="Select position">
              <Option value="position1">Position 1</Option>
              <Option value="position2">Position 2</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="dutyType"
            label="Duty Type *"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Select placeholder="Select duty type">
              <Option value="fullTime">Full Time</Option>
              <Option value="partTime">Part Time</Option>
              <Option value="Contractual">Contractual</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="hireDate"
            label="Hire Date *"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format={dateFormat}
              disabledDate={disabledFutureDate}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="originalHireDate"
            label="Appointment Date *"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format={dateFormat}
              disabledDate={disabledFutureDate}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="terminationDate" label="Termination Date">
            <DatePicker
              style={{ width: "100%" }}
              disabled={!isTerminated}
              disabledDate={disabledFutureDate}
              format={dateFormat}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name="terminationReason" label="Termination Reason">
            <Input
              placeholder="Enter termination reason"
              disabled={!isTerminated}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="contractTerminated"
            label="Contract Terminated"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Select
              placeholder="Select termination status"
              onChange={handleTerminationChange}
            >
              <Option value="yes">Yes</Option>
              <Option value="no">No</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="rehireStatus"
            label="Rehire Status"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Select
              placeholder="Select rehire status"
              onChange={handleRehireChange}
            >
              <Option value="reHired">Re-Hired</Option>
              <Option value="reinstated">Re-Instated</Option>
              <Option value="reAppointed">Re-Appointed</Option>
              <Option value="none">None</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="reHireDate" label={rehireDateLabel}>
            <DatePicker
              style={{ width: "100%" }}
              format={dateFormat}
              disabledDate={disabledFutureDate}
              disabled={!isRehired}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="rateType"
            label="Rate Type"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Select placeholder="Select rate type">
              <Option value="hourly">Hourly</Option>
              <Option value="salary">Salary</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="rate"
            label="Rate *"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Input placeholder="Enter rate" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="payFrequency"
            label="Pay Frequency *"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Select placeholder="Select pay frequency">
              <Option value="daily">Daily | Per Day</Option>
              <Option value="weekly">Weekly</Option>
              <Option value="biWeekly">Bi-Weekly</Option>
              <Option value="monthly">Monthly</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name="payFrequencyText" label="Pay Frequency Text">
            <Input placeholder="Enter pay frequency text" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="hourlyRate2" label="Hourly rate2">
            <Input placeholder="Enter hourly rate2" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name="overtimeHourlyRate" label="Overtime Hourly Rate">
            <Input placeholder="Enter overtime hourly rate" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="bankName"
            label="Bank Name"
          >
            <Select
              showSearch
              placeholder="Select bank name"
              onSearch={handleSearch}
              filterOption={false}
            >
              {filteredBanks.map((bank) => (
                <Option key={bank} value={bank}>
                  {bank}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="bankAccountNo"
            label="Bank Account No. *"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Input placeholder="Enter bank account no." />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="bankBranch" label="Bank Branch">
            <Input placeholder="Enter bank branch" />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default PersonalInformationStep;