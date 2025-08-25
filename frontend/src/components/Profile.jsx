import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:8080/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
            } catch (err) {
                console.error(err);
                alert('Failed to fetch profile. Please login again.');
                navigate('/login');
            }
        };

        fetchProfile();
    }, []);

    if (!user) return <p>Loading...</p>;

    return (
        <div>
            <h1>Profile</h1>
            <p><strong>Full Name:</strong> {user.fullName}</p>
            <p><strong>Username:</strong> {user.userName}</p>
            <button onClick={() => navigate('/edit-profile')}>Edit Profile</button>
        </div>
    );
}
