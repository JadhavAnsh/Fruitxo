import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);

  const [profile, setProfile] = useState({
    fullName: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('userToken');
          localStorage.removeItem('userData');
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch orders');

      const data = await response.json();
      setOrders(data);
      setShowOrders(true);
    } catch (err) {
      setError('Failed to fetch orders: ' + err.message);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword
        })
      });

      if (!response.ok) {
        throw new Error('Failed to change password');
      }

      setSuccess('Password changed successfully');
      setChangingPassword(false);
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const OrderCard = ({ order }) => (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">Order #{order._id.slice(-6)}</p>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <p className="font-bold text-red-500">${order.totalAmount.toFixed(2)}</p>
      </div>
      <div className="mt-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm py-1">
            <span>{item.name} x {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {showOrders ? 'My Orders' : 'Profile Information'}
          </h2>
          <button
            onClick={() => {
              if (!showOrders) {
                fetchOrders();
              } else {
                setShowOrders(false);
              }
            }}
            className="flex items-center px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <ShoppingBag className="mr-2" size={16} />
            {showOrders ? 'View Profile' : 'View Orders'}
          </button>
        </div>

        {showOrders ? (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No orders found
              </div>
            ) : (
              orders.map(order => (
                <OrderCard key={order._id} order={order} />
              ))
            )}
          </div>
        ) : (
          <>
            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
                {success}
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="mt-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-red-500 focus:border-red-500"
                  value={profile.fullName}
                  disabled={!isEditing}
                  onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-red-500 focus:border-red-500"
                  value={profile.phone}
                  disabled={!isEditing}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Street</label>
                <input
                  type="text"
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-red-500 focus:border-red-500"
                  value={profile.address.street}
                  disabled={!isEditing}
                  onChange={(e) => setProfile({
                    ...profile,
                    address: {...profile.address, street: e.target.value}
                  })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-red-500 focus:border-red-500"
                    value={profile.address.city}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({
                      ...profile,
                      address: {...profile.address, city: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-red-500 focus:border-red-500"
                    value={profile.address.state}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({
                      ...profile,
                      address: {...profile.address, state: e.target.value}
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                  <input
                    type="text"
                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-red-500 focus:border-red-500"
                    value={profile.address.zipCode}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({
                      ...profile,
                      address: {...profile.address, zipCode: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-red-500 focus:border-red-500"
                    value={profile.address.country}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({
                      ...profile,
                      address: {...profile.address, country: e.target.value}
                    })}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition duration-200"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition duration-200 shadow-lg"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="px-6 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition duration-200 shadow-lg"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>

            <div className="mt-8">
              <button
                type="button"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition duration-200"
                onClick={() => setChangingPassword(!changingPassword)}
              >
                Change Password
              </button>

              {changingPassword && (
                <form onSubmit={handlePasswordChange} className="mt-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                    <input
                      type="password"
                      className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-red-500 focus:border-red-500"
                      value={passwords.oldPassword}
                      onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                      type="password"
                      className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-red-500 focus:border-red-500"
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                      type="password"
                      className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-red-500 focus:border-red-500"
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition duration-200"
                      onClick={() => setChangingPassword(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition duration-200 shadow-lg"
                    >
                      Change Password
                    </button>
                  </div>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;