import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiHome, FiBox, FiShoppingBag, FiBarChart2, FiMessageCircle, FiUser, FiLogOut, FiTag
} from 'react-icons/fi';
import { BiStore } from 'react-icons/bi';

export default function Sidebar({ role }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const artisanLinks = [
    { name: 'Dashboard', path: '/artisan/dashboard', icon: <FiHome /> },
    { name: 'My Products', path: '/artisan/products', icon: <FiBox /> },
    { name: 'Orders', path: '/artisan/orders', icon: <FiShoppingBag /> },
    { name: 'Coupons', path: '/artisan/coupons', icon: <FiTag /> },
    { name: 'Analytics', path: '/artisan/analytics', icon: <FiBarChart2 /> },
    { name: 'Messages', path: '/artisan/chat', icon: <FiMessageCircle /> },
    { name: 'Profile', path: '/profile', icon: <FiUser /> },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FiHome /> },
    { name: 'Users', path: '/admin/users', icon: <FiUser /> },
    { name: 'Products', path: '/admin/products', icon: <FiBox /> },
    { name: 'Orders', path: '/admin/orders', icon: <FiShoppingBag /> },
    { name: 'Revenue', path: '/admin/revenue', icon: <FiBarChart2 /> },
    { name: 'Moderation', path: '/admin/moderation', icon: <FiMessageCircle /> },
  ];

  const links = role === 'admin' ? adminLinks : artisanLinks;

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 pt-16 z-40">
      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {React.cloneElement(link.icon, { className: 'w-5 h-5' })}
            {link.name}
          </NavLink>
        ))}
        {role === 'artisan' && (
           <NavLink to="/products" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 mt-auto border border-gray-200">
             <BiStore className="w-5 h-5" /> View Marketplace
           </NavLink>
        )}
      </div>
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
        >
          <FiLogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </div>
  );
}
