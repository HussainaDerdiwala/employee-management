import React, { useState, useEffect } from 'react';

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state for creating or updating employee
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    salary: ''
  });

  // Track if we are editing an employee and store their ID
  const [editingId, setEditingId] = useState(null);

  // Fetch employees on load
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    fetch('http://127.0.0.1:8000/api/employees')
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission for both CREATE and UPDATE
  const handleSubmit = (e) => {
    e.preventDefault();

    const url = editingId 
      ? `http://127.0.0.1:8000/api/employees/${editingId}` 
      : 'http://127.0.0.1:8000/api/employees';

    const method = editingId ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || (editingId ? 'Employee updated successfully!' : 'Employee added successfully!'));
        // Reset form & state
        setFormData({ name: '', email: '', department: '', salary: '' });
        setEditingId(null);
        fetchEmployees(); // Refresh list
      })
      .catch((err) => {
        console.error('Error saving employee:', err);
        alert('Operation failed. Please check your inputs.');
      });
  };

  // Handle Edit button click (populate form with employee data)
  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setFormData({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      salary: emp.salary
    });
  };

  // Handle Delete button click
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      fetch(`http://127.0.0.1:8000/api/employees/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json'
        }
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message || 'Employee deleted successfully!');
          fetchEmployees(); // Refresh list
        })
        .catch((err) => {
          console.error('Error deleting employee:', err);
          alert('Failed to delete employee.');
        });
    }
  };

  // Cancel Edit mode
  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', department: '', salary: '' });
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Employee Management System</h2>

      {/* Form for Add / Update */}
      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #ddd' }}>
        <h3>{editingId ? 'Edit Employee' : 'Add New Employee'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px' }}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ padding: '8px', fontSize: '14px' }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ padding: '8px', fontSize: '14px' }}
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            required
            style={{ padding: '8px', fontSize: '14px' }}
          />
          <input
            type="number"
            name="salary"
            placeholder="Salary"
            value={formData.salary}
            onChange={handleChange}
            required
            style={{ padding: '8px', fontSize: '14px' }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ background: editingId ? '#28a745' : '#007BFF', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              {editingId ? 'Update Employee' : 'Add Employee'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel} style={{ background: '#6c757d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Employee List Table */}
      <h3>Employee List</h3>
      {loading ? (
        <p>Loading...</p>
      ) : employees.length === 0 ? (
        <p>No employees found in database.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ background: '#f4f4f4' }}>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>₹{emp.salary}</td>
                <td>
                  <button onClick={() => handleEdit(emp)} style={{ background: '#ffc107', border: 'none', padding: '5px 10px', marginRight: '5px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(emp.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;