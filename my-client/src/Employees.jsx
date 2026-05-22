import { useState, useEffect } from "react";
import { employees } from "../employees.js";
import axios from "axios";
import "./styles/employees.css";
import "./styles/header.css";

const mapEmployeeFromAPI = (employee) => ({
  id: employee.employee_id,
  name: employee.employee_name,
  image: employee.image,
  hourlyPay: Number(employee.hourly_pay),
  hireDate: employee.hire_date?.split("T")[0],
  position: employee.position,
});

const RenderEmployees = () => {
  // const [myEmployees, setMyEmployees] = useState("");

  console.log("API:", import.meta.env.VITE_API_BASE_URL);
  const API = import.meta.env.VITE_API_BASE_URL;

  const [addedEmployee, setAddedEmployee] = useState([]);

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${API}/api/v1/employees`);
        console.log(response.data);

        setAddedEmployee(response.data.map(mapEmployeeFromAPI));
        console.log("Mapped:", response.data.map(mapEmployeeFromAPI));
      } catch (error) {
        console.error("Failed to get employees database", error);
      }
    };
    fetchEmployees();
  }, [API]);

  const [formData, setFormData] = useState({
    name: "",
    hourlyPay: 0,
    hireDate: "",
    position: "",
  });
  /*
  const [addedEmployee, setAddedEmployee] = useState(() => {
    const saved = localStorage.getItem("addedEmployee");
    return saved ? JSON.parse(saved) : [];
  });
*/

  /*
  useEffect(() => {
    localStorage.setItem("addedEmployee", JSON.stringify(addedEmployee));
  }, [addedEmployee]);
*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    /*
    if (!myEmployees) {
      return alert("Please fill out all fields");
    }
*/

    if (
      !formData.name ||
      !formData.hourlyPay === "" ||
      !formData.hireDate ||
      !formData.position
    ) {
      return alert("Please fill out all fields");
    }

    /*
    const fakeId = Date.now();
    const newEmployee = {
      id: fakeId,
      ...formData,
    };
    const updatedEmployee = [...addedEmployee, newEmployee];
*/

    const response = await axios.post(`${API}/api/v1/new-employee`, {
      employee_name: formData.name,
      hourly_pay: formData.hourlyPay,
      hire_date: formData.hireDate,
      position: formData.position,
    });
    console.log("POST RESPONSE", response.data);

    setAddedEmployee((prev) => [...prev, mapEmployeeFromAPI(response.data)]);
    setFormData({
      name: "",
      hourlyPay: "",
      hireDate: "",
      position: "",
    });
    setShowForm(false);
  };

  /*
  const handleAdd = (employee) => {
    setAddedEmployee((prev) => {
      const itExists = prev.find((e) => e.id === employee.id);
      return itExists
        ? prev.map((e) =>
            e.id === employee.id
              ? {
                  ...e,
                  quantity: e.quantity + 1,
                }
              : e,
          )
        : [...prev, { ...employee, quantity: 1 }];
    });
  };
*/

  const handleRemove = async (id) => {
    try {
      await axios.delete(`${API}/api/v1/employees/${id}`);
      setAddedEmployee((prev) => {
        return prev.filter((employee) => employee.id !== id);
      });
    } catch (error) {
      console.error("Could not delete. Please try again.", error);
    }
  };
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({
    name: "",
    hourlyPay: "",
    hireDate: "",
    position: "",
  });
  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setEditValues({
      name: employee.name,
      hourlyPay: employee.hourlyPay,
      hireDate: employee.hireDate,
      position: employee.position,
    });
  };
  const [showButtons, setShowButtons] = useState(null);
  const handleSave = async (id) => {
    try {
      const response = await axios.patch(`${API}/api/v1/employees/${id}`, {
        employee_name: editValues.name,
        hourly_pay: editValues.hourlyPay,
        hire_date: editValues.hireDate,
        position: editValues.position,
      });

      setAddedEmployee((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...editValues } : e)),
      );
      setEditingId(null);
      setShowButtons(false);
    } catch (error) {
      console.error("Could not update. Please try again.", error);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    // setFormData(e.target.value); wrong because the value is an object
    if (editingId) {
      setEditValues((prev) => ({
        ...prev,
        [id]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: id === "hourlyPay" ? (value === "" ? "" : Number(value)) : value,
      }));
    }
  };

  return (
    <>
      <header className="header-container">
        <div className="header-title">
          <h1>Employee Database API</h1>
        </div>

        <div className="logo">
          <img src="/src/assets/logo.png" className="img-logo" />
        </div>
      </header>
      <div className="employee-header">
        <div className="employee-title">
          <h4>Employee</h4>
        </div>
        <div className="employee-title">
          <h4>Pay</h4>
        </div>
        <div className="employee-title">
          <h4>Hire Date</h4>
        </div>
        <div>
          <h4>Position</h4>
        </div>
      </div>

      {showForm && (
        <RenderInput
          setShowForm={setShowForm}
          handleSubmit={handleSubmit}
          // myEmployees={myEmployees}
          handleChange={handleChange}
          formData={formData}
          editingId={editingId}
          editValues={editValues}
        />
      )}
      <RenderNames
        addedEmployee={addedEmployee}
        handleRemove={handleRemove}
        handleEdit={handleEdit}
        setEditValues={setEditValues}
        editingId={editingId}
        editValues={editValues}
        handleSave={handleSave}
        setShowButtons={setShowButtons}
        showButtons={showButtons}
      />
      <RenderButtons setShowForm={setShowForm} />
    </>
  );
};

const RenderInput = ({
  handleSubmit,
  myEmployees,
  handleChange,
  formData,
  editingId,
  editValues,
}) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="employee-container">
          <div>
            <label htmlFor="name" className="sr-only">
              Employee
            </label>
            <input
              id="name"
              type="text"
              // value={myEmployees}
              value={editingId ? editValues.name : formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="hourlyPay" type="number" className="sr-only">
              Pay
            </label>
            <input
              id="hourlyPay"
              onChange={handleChange}
              value={editingId ? editValues.hourlyPay : formData.hourlyPay}
              type="number"
            />
          </div>
          <div>
            <label htmlFor="hireDate" className="sr-only">
              Hire Date
            </label>
            <input
              id="hireDate"
              type="date"
              value={editingId ? editValues.hireDate : formData.hireDate}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="position" className="sr-only">
              Position
            </label>
            <input
              id="position"
              type="text"
              value={editingId ? editValues.position : formData.position}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="submit-buttons">
          <button type="submit">Submit</button>
        </div>
      </form>
    </>
  );
};

const RenderButtons = ({ setShowForm }) => {
  return (
    <>
      <button className="add-btn" onClick={() => setShowForm(true)}>
        Add
      </button>
    </>
  );
};

const RenderEditButtons = ({
  handleRemove,
  handleEdit,
  employee,
  handleSave,
}) => {
  return (
    <>
      <>
        <button
          className="delete-btn"
          onClick={() => handleRemove(employee.id)}
        >
          Delete
        </button>
        <button className="edit-btn" onClick={() => handleEdit(employee)}>
          Edit
        </button>
        <button className="save-btn" onClick={() => handleSave(employee.id)}>
          Save
        </button>
      </>
    </>
  );
};

const RenderNames = ({
  addedEmployee,
  handleRemove,
  handleEdit,
  setEditValues,
  editingId,
  editValues,
  handleSave,
  showButtons,
  setShowButtons,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };
  console.log("addedEmployee:", addedEmployee);

  return (
    <>
      {addedEmployee.map((employee) => {
        const isEditing = editingId === employee.id;
        return (
          <div key={employee.id} className="employee-container">
            {isEditing ? (
              <>
                <input
                  name="name"
                  id="name"
                  value={editValues.name}
                  onChange={handleChange}
                />
                <input
                  id="hourlyPay"
                  name="hourlyPay"
                  value={editValues.hourlyPay}
                  onChange={handleChange}
                />
                <input
                  id="hireDate"
                  name="hireDate"
                  value={editValues.hireDate}
                  onChange={handleChange}
                  type="date"
                />
                <input
                  id="position"
                  name="position"
                  value={editValues.position}
                  onChange={handleChange}
                />
                {showButtons === employee.id && (
                  <div className="edit-btn-container">
                    <RenderEditButtons
                      handleRemove={handleRemove}
                      handleEdit={handleEdit}
                      employee={employee}
                      handleSave={handleSave}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <div
                  className="inputs"
                  onClick={() => setShowButtons(employee.id)}
                >
                  <div>{employee.name}</div>

                  {showButtons === employee.id && (
                    <RenderEditButtons
                      handleRemove={handleRemove}
                      handleEdit={handleEdit}
                      employee={employee}
                      handleSave={handleSave}
                    />
                  )}
                </div>

                <div className="inputs">{employee.hourlyPay}</div>
                <div className="inputs">{employee.hireDate}</div>
                <div className="inputs"> {employee.position}</div>
              </>
            )}
          </div>
        );
      })}
    </>
  );
};

export default RenderEmployees;
