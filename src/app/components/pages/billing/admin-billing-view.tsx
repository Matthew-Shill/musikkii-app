import { Search, AlertCircle, CheckCircle2, Clock, TrendingUp, Users, DollarSign, Filter, Download } from 'lucide-react';
import { useState } from 'react';

export function AdminBillingView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'failed' | 'upcoming'>('all');

  const customers = [
    { 
      id: 1, 
      name: 'Jennifer Smith', 
      type: 'Family',
      students: 3, 
      amount: 370, 
      status: 'Active', 
      nextBilling: 'Apr 1',
      lastPayment: 'Mar 1',
      statusColor: 'green'
    },
    { 
      id: 2, 
      name: 'Michael Chen', 
      type: 'Adult Student',
      students: 1, 
      amount: 180, 
      status: 'Active', 
      nextBilling: 'Apr 5',
      lastPayment: 'Mar 5',
      statusColor: 'green'
    },
    { 
      id: 3, 
      name: 'Sarah Williams', 
      type: 'Parent',
      students: 1, 
      amount: 160, 
      status: 'Failed Payment', 
      nextBilling: 'Overdue',
      lastPayment: 'Feb 1',
      statusColor: 'red'
    },
    { 
      id: 4, 
      name: 'David Park', 
      type: 'Adult Student',
      students: 1, 
      amount: 180, 
      status: 'Active', 
      nextBilling: 'Apr 12',
      lastPayment: 'Mar 12',
      statusColor: 'green'
    },
    { 
      id: 5, 
      name: 'Lisa Anderson', 
      type: 'Family',
      students: 2, 
      amount: 280, 
      status: 'Renewal Due', 
      nextBilling: 'Mar 20',
      lastPayment: 'Feb 20',
      statusColor: 'amber'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Billing Management</h1>
        <p className="text-gray-600">Monitor customer subscriptions, payments, and billing operations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">Active Subscriptions</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">847</p>
          <p className="text-xs text-green-600 mt-1">+23 this month</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Monthly Revenue</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">$142K</p>
          <p className="text-xs text-green-600 mt-1">+12% vs last month</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-gray-600">Failed Payments</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">12</p>
          <p className="text-xs text-red-600 mt-1">Needs attention</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-gray-600">Upcoming Renewals</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">156</p>
          <p className="text-xs text-gray-500 mt-1">Next 7 days</p>
        </div>
      </div>

      {/* Billing Alerts */}
      <div className="mb-6 space-y-3">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-red-900">12 Failed Payments Require Attention</p>
            <p className="text-sm text-red-700 mt-1">These customers have outstanding payment issues that need resolution.</p>
          </div>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
            Review
          </button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-amber-900">156 Renewals in Next 7 Days</p>
            <p className="text-sm text-amber-700 mt-1">Monitor upcoming billing cycles and ensure smooth processing.</p>
          </div>
          <button className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
            View List
          </button>
        </div>
      </div>

      {/* Customer Billing Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Table Header with Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Customer Billing</h2>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, email, or student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
              {['all', 'active', 'failed', 'upcoming'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                    filterStatus === status
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Customer</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Type</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Students</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Monthly Amount</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Next Billing</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Last Payment</th>
                <th className="text-right py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-500">Customer #{customer.id.toString().padStart(4, '0')}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                      {customer.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-900">{customer.students}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-gray-900">${customer.amount}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      customer.statusColor === 'green' ? 'bg-green-100 text-green-700' :
                      customer.statusColor === 'red' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={customer.status === 'Failed Payment' ? 'text-red-600 font-medium' : 'text-gray-600'}>
                      {customer.nextBilling}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{customer.lastPayment}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">Showing 1-5 of 847 customers</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium">
              1
            </button>
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              3
            </button>
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
