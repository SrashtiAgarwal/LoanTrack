import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Register page se jo email aayi hai usey automatically le lenge
  const [email] = useState(location.state?.email || '');
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          email_otp: emailOtp,
          phone_otp: phoneOtp
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('🎉 Account verified successfully! Please login.');
        navigate('/login'); // Verify hone ke baad Login page par bhej denge
      } else {
        alert(data.detail || 'Invalid OTP! Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Sorry, can not connenct to server!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '25px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#4F46E5' }}>Verify Your OTP</h2>
      <p style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
        We have sent OTP to your email and phone number for <b>{email}</b>
      </p>

      <form onSubmit={handleVerify}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email OTP:</label><br />
          <input
            type="text"
            value={emailOtp}
            onChange={(e) => setEmailOtp(e.target.value)}
            required
            placeholder="Enter 6-digit email OTP"
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Phone SMS OTP:</label><br />
          <input
            type="text"
            value={phoneOtp}
            onChange={(e) => setPhoneOtp(e.target.value)}
            required
            placeholder="Enter 6-digit phone OTP"
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '12px', width: '100%', backgroundColor: '#4F46E5', color: '#white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
    </div>
  );
}

export default VerifyOtp;