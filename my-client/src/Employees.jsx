import { useState, useEffect } from "react";
import { employees } from "../employees.js";
import "./styles/employees.css";

const mapEmployeeFromAPI = (employee) => ({
  id: employee._id,
  name: employee.name,
  image: employee.image,
  hourlyPay: employee.hourly_pay,
  hireDate: employee.hire_date,
  position: employee.position,
});

const RenderEmployees = () => {
  // const [myEmployees, setMyEmployees] = useState("");
  const [formData, setFormData] = useState({
    image: "",
    name: "",
    hourlyPay: 0,
    hireDate: "",
    position: "",
  });

  const [addedEmployee, setAddedEmployee] = useState(() => {
    const saved = localStorage.getItem("addedEmployee");
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    localStorage.setItem("addedEmployee", JSON.stringify(addedEmployee));
  }, [addedEmployee]);

  const handleSubmit = (e) => {
    e.preventDefault();
    /*
    if (!myEmployees) {
      return alert("Please fill out all fields");
    }
*/

    if (
      !formData.name ||
      !formData.hourlyPay ||
      !formData.hireDate ||
      !formData.position
    ) {
      return alert("Please fill out all fields");
    }

    const fakeId = Date.now();
    const newEmployee = {
      id: fakeId,
      ...formData,
    };
    const updatedEmployee = [...addedEmployee, newEmployee];
    setAddedEmployee(updatedEmployee);
    setFormData({
      image: "",
      name: "",
      hourlyPay: "",
      hireDate: "",
      position: "",
    });
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

  const handleRemove = (id) => {
    setAddedEmployee((prev) => {
      return prev.filter((employee) => employee.id !== id);
    });
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

  const handleSave = (id) => {
    setAddedEmployee((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...editValues } : e)),
    );
    setEditingId(null);
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
        [id]: id === "hourly_pay" ? (value === "" ? "" : Number(value)) : value,
      }));
    }
  };

  return (
    <>
      <div className="employee-header">
        <div className="employee-title">
          <h4>Employee</h4>
        </div>
        <div className="employee-title">
          <h4>Name</h4>
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
            <label htmlFor="employee" className="sr-only">
              Employee
            </label>
            <input id="employee" className="image-container" />
          </div>
          <div>
            <label htmlFor="name" className="sr-only">
              Name
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
}) => {
  const [showButtons, setShowButtons] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <>
      {addedEmployee.map((employee) => {
        const isEditing = editingId === employee.id;
        return (
          <div key={employee.id} className="employee-container">
            {isEditing ? (
              <>
                <input />
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
              </>
            ) : (
              <>
                <div>
                  <div className="inputs" onClick={() => setShowButtons(true)}>
                    Image
                  </div>
                  {showButtons && (
                    <RenderEditButtons
                      handleRemove={handleRemove}
                      handleEdit={handleEdit}
                      employee={employee}
                      handleSave={handleSave}
                    />
                  )}
                </div>
                <div className="inputs">{employee.name}</div>
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
