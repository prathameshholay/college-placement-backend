import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5000/api/students/profile', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setProfile(res.data);
      setForm(res.data);
    }).catch(console.error);
  }, []);

  const handleUpdate = () => {
    axios.put('http://localhost:5000/api/students/profile', form, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      alert('Updated!');
      setEditMode(false);
    }).catch(console.error);
  };

  return (
    <div>
      {editMode ? (
        <>
          <input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
          {/* Add other fields similarly */}
          <button onClick={handleUpdate}>Save</button>
        </>
      ) : (
        <>
          <p>Name: {profile.name}</p>
          {/* Add other fields */}
          <button onClick={() => setEditMode(true)}>Edit</button>
        </>
      )}
    </div>
  );
};

export default Profile;
