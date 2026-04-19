import { Users, Search, Filter, Mail, Edit, UserCheck, UserX, Link2, Flag, MoreVertical, CheckCircle, AlertCircle, Clock, UserPlus } from 'lucide-react';
import { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'trial' | 'pending';
  onboardingStatus: 'complete' | 'incomplete' | 'pending';
  assignedTeacher?: string;
  parentOf?: string[];
  childrenOf?: string;
  billingStatus: 'current' | 'overdue' | 'trial' | 'canceled';
  lastActive: string;
  flagged: boolean;
  tags?: string[];
}

export function AdminUsersView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock user data
  const users: User[] = [
    {
      id: 1,
      name: 'Emma Thompson',
      email: 'emma.t@email.com',
      role: 'Student',
      status: 'active',
      onboardingStatus: 'complete',
      assignedTeacher: 'Sarah Johnson',
      childrenOf: 'Michael Thompson',
      billingStatus: 'current',
      lastActive: '2 hours ago',
      flagged: false,
      tags: ['Piano', 'Intermediate']
    },
    {
      id: 2,
      name: 'Michael Thompson',
      email: 'michael.t@email.com',
      role: 'Parent',
      status: 'active',
      onboardingStatus: 'complete',
      parentOf: ['Emma Thompson', 'Sophia Thompson'],
      billingStatus: 'current',
      lastActive: '1 day ago',
      flagged: false
    },
    {
      id: 3,
      name: 'Alex Martinez',
      email: 'alex.m@email.com',
      role: 'Student',
      status: 'trial',
      onboardingStatus: 'incomplete',
      billingStatus: 'trial',
      lastActive: '3 days ago',
      flagged: true,
      tags: ['Guitar', 'Beginner']
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      role: 'Teacher',
      status: 'active',
      onboardingStatus: 'complete',
      billingStatus: 'current',
      lastActive: '30 min ago',
      flagged: false,
      tags: ['Piano', '24 Students']
    },
    {
      id: 5,
      name: 'David Chen',
      email: 'david.c@email.com',
      role: 'Student',
      status: 'active',
      onboardingStatus: 'complete',
      assignedTeacher: 'Michael Davis',
      billingStatus: 'current',
      lastActive: '5 hours ago',
      flagged: false,
      tags: ['Violin', 'Advanced']
    },
    {
      id: 6,
      name: 'Lisa Anderson',
      email: 'lisa.a@email.com',
      role: 'Parent',
      status: 'inactive',
      onboardingStatus: 'complete',
      parentOf: ['Jake Anderson'],
      billingStatus: 'canceled',
      lastActive: '2 weeks ago',
      flagged: true
    },
    {
      id: 7,
      name: 'New User Pending',
      email: 'newuser@email.com',
      role: 'Student',
      status: 'pending',
      onboardingStatus: 'pending',
      billingStatus: 'trial',
      lastActive: 'Never',
      flagged: true
    }
  ];

  // Summary stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const pendingOnboarding = users.filter(u => u.onboardingStatus !== 'complete').length;
  const trialUsers = users.filter(u => u.status === 'trial').length;
  const flaggedUsers = users.filter(u => u.flagged).length;
  const unassignedStudents = users.filter(u => u.role === 'Student' && !u.assignedTeacher).length;

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'trial': return 'bg-blue-100 text-blue-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getBillingColor = (status: string) => {
    switch (status) {
      case 'current': return 'text-green-600';
      case 'trial': return 'text-blue-600';
      case 'overdue': return 'text-red-600';
      case 'canceled': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-sm md:text-base text-gray-600">Manage accounts, relationships, and user access</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <p className="text-xs font-medium text-gray-600">Total Users</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <p className="text-xs font-medium text-gray-600">Active Users</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <p className="text-xs font-medium text-gray-600">Pending Onboarding</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{pendingOnboarding}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <UserPlus className="w-4 h-4 text-blue-600" />
              <p className="text-xs font-medium text-gray-600">Trial Users</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{trialUsers}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Flag className="w-4 h-4 text-red-600" />
              <p className="text-xs font-medium text-gray-600">Needs Action</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{flaggedUsers}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <p className="text-xs font-medium text-gray-600">Unassigned</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{unassignedStudents}</p>
          </div>
        </div>

        {/* Alerts / Exceptions */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 mb-2">Users Requiring Attention</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-amber-800">Incomplete onboarding: {pendingOnboarding} users</span>
                  <button className="text-amber-700 hover:text-amber-900 font-medium">Review →</button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-amber-800">Unassigned students: {unassignedStudents} students</span>
                  <button className="text-amber-700 hover:text-amber-900 font-medium">Assign →</button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-amber-800">Flagged accounts: {flaggedUsers} users</span>
                  <button className="text-amber-700 hover:text-amber-900 font-medium">Review →</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Role</label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="student">Students</option>
                    <option value="parent">Parents</option>
                    <option value="teacher">Teachers</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="trial">Trial</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setRoleFilter('all');
                      setStatusFilter('all');
                    }}
                    className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">Status</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden lg:table-cell">Relationships</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden lg:table-cell">Last Active</th>
                  <th className="px-4 md:px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {user.name[0]}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                            {user.flagged && <Flag className="w-4 h-4 text-red-500 flex-shrink-0" />}
                          </div>
                          <p className="text-sm text-gray-600 truncate">{user.email}</p>
                          {user.tags && (
                            <div className="flex gap-1 mt-1">
                              {user.tags.map((tag, i) => (
                                <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                      <div className="space-y-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                        <p className={`text-xs ${getBillingColor(user.billingStatus)}`}>
                          {user.billingStatus}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 hidden lg:table-cell">
                      <div className="text-sm text-gray-600 space-y-1">
                        {user.assignedTeacher && (
                          <p className="flex items-center gap-1">
                            <UserCheck className="w-3 h-3" />
                            Teacher: {user.assignedTeacher}
                          </p>
                        )}
                        {user.parentOf && (
                          <p className="flex items-center gap-1">
                            <Link2 className="w-3 h-3" />
                            Parent of {user.parentOf.length} student(s)
                          </p>
                        )}
                        {user.childrenOf && (
                          <p className="flex items-center gap-1">
                            <Link2 className="w-3 h-3" />
                            Child of {user.childrenOf}
                          </p>
                        )}
                        {!user.assignedTeacher && !user.parentOf && !user.childrenOf && (
                          <p className="text-gray-400">-</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 hidden lg:table-cell">
                      <p className="text-sm text-gray-600">{user.lastActive}</p>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit user">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="More actions">
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No users found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
