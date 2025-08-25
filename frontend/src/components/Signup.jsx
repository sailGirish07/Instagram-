import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function Signup() {

    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    userName: ''
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const res = await axios.post('http://localhost:8080/signup', formData);
        alert(res.data.message);
        setFormData({
            email: '',
            password: '',
            fullName: '',
            userName: ''
        });

         setTimeout(() => {
        navigate('/login');
     },1000);
    }catch(err){
        console.error('Signup failed:', err.response?.data || err);
    alert(err.response?.data?.error || 'Signup failed');
    }
    console.log('Form Submitted!', formData);
    // alert('Form submitted! Check the console for the form data.');
  };

  return (
    <div >
      <div >
        <h1 >Instagram</h1>
        <p >Sign up to see photos and videos from your friends.</p>
      </div>
      <form onSubmit={handleSubmit} >
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required/><br/><br/>
        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange}/><br/><br/>
        <input type="text" name="userName" placeholder="UserName" value={formData.userName} onChange={handleChange}/><br/><br/>
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required/>
        <p >
          People who use our service may have uploaded your contact information to Instagram.
        </p>
        <p >
          By signing up, you agree to our <a href="#">Terms</a>, <a href="#">Privacy Policy</a> and <a href="#">Cookies Policy</a>.
        </p>
        <button type="submit">
          Sign up
        </button>
      </form>
      <div >
        <p>
            Have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
}
