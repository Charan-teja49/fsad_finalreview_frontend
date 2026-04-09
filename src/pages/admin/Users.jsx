import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiUserX, FiUserCheck, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => { fetchUsers(); }, [roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter) params.set('role', roleFilter);
      if (search) params.set('search', search);
      const { data } = await api.get(`/admin/users?${params}`);
      setUsers(data);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const toggleBlock = async (id) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/block`);
      toast.success(data.message);
      fetchUsers();
    } catch { toast.error('Failed to update user'); }
  };

  const roleBadge = (role) => {
    const map = {
      customer: 'bg-blue-100 text-blue-700',
      artisan: 'bg-amber-100 text-amber-700',
      admin: 'bg-purple-100 text-purple-700',
    };
    return map[role] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="ml-64 p-8 w-full">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">User Management</h1>
              <p className="text-gray-500 mt-1">{users.length} users registered</p>
            </div>

            <div className="flex gap-3 items-center flex-wrap">
              {/* Role filter */}
              <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
                {['', 'customer', 'artisan', 'admin'].map(r => (
                  <button key={r} onClick={() => setRoleFilter(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${roleFilter === r ? 'bg-primary-800 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                  >{r || 'All'}</button>
                ))}
              </div>

              {/* Search */}
              <form onSubmit={handleSearch} className="flex">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                  <input
                    className="input-field pl-9 pr-4 py-2 text-sm w-60"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </form>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin"></div></div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-left text-xs uppercase tracking-wider font-semibold text-gray-500">
                      <th className="px-6 py-4">User</th>
                      <th className="px-4 py-4">Role</th>
                      <th className="px-4 py-4">Phone</th>
                      <th className="px-4 py-4">Joined</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map(user => (
                      <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-gray-500 text-xs">{user.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${roleBadge(user.role)}`}>{user.role}</span>
                        </td>
                        <td className="px-4 py-4 text-gray-600">{user.phone || '—'}</td>
                        <td className="px-4 py-4 text-gray-500 text-xs">{new Date(user.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-4">
                          {user.is_blocked ? (
                            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Blocked</span>
                          ) : (
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Active</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            onClick={() => toggleBlock(user.id)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                              user.is_blocked
                                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                : 'bg-red-50 text-red-700 hover:bg-red-100'
                            }`}
                          >
                            {user.is_blocked ? <><FiUserCheck size={13} /> Unblock</> : <><FiUserX size={13} /> Block</>}
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {users.length === 0 && (
                <div className="py-12 text-center text-gray-400">No users found</div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
