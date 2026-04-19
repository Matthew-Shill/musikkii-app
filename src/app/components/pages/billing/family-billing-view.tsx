import { CreditCard, Download, Calendar, CheckCircle2, Tag, ExternalLink } from 'lucide-react';

export function FamilyBillingView() {
  const students = [
    { id: 1, name: 'Emma Smith', initials: 'ES', color: 'from-purple-400 to-pink-500', instrument: 'Piano', plan: 'Weekly Lessons', price: 160 },
    { id: 2, name: 'Oliver Smith', initials: 'OS', color: 'from-blue-400 to-cyan-500', instrument: 'Guitar', plan: 'Weekly Lessons', price: 160 },
    { id: 3, name: 'Sophia Smith', initials: 'SS', color: 'from-green-400 to-emerald-500', instrument: 'Violin', plan: 'Bi-weekly Lessons', price: 90 }
  ];

  const subtotal = students.reduce((sum, student) => sum + student.price, 0);
  const discount = 40; // Family discount
  const total = subtotal - discount;

  const invoices = [
    { id: 'INV-2026-003', date: 'Mar 1, 2026', students: 3, amount: '$370.00', status: 'Paid' },
    { id: 'INV-2026-002', date: 'Feb 1, 2026', students: 3, amount: '$370.00', status: 'Paid' },
    { id: 'INV-2026-001', date: 'Jan 1, 2026', students: 3, amount: '$370.00', status: 'Paid' }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Family Billing Center</h1>
            <p className="text-gray-600">Manage lessons and billing for all household members</p>
          </div>
          <div className="px-4 py-2 bg-purple-100 rounded-lg">
            <p className="text-sm text-purple-700 font-medium">Family Discount Applied</p>
            <p className="text-xs text-purple-600 mt-0.5">Save 10% on multiple students</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Household Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-6">
            <h2 className="text-xl font-semibold mb-4">Household Summary</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Active Students</p>
                <p className="text-3xl font-bold text-blue-600">{students.length}</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Monthly Subtotal</p>
                <p className="text-3xl font-bold text-gray-900">${subtotal}</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Family Discount</p>
                <p className="text-3xl font-bold text-green-600">-${discount}</p>
              </div>
            </div>
          </div>

          {/* Student Plans */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Student Plans</h2>
            {students.map((student) => (
              <div key={student.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${student.color} flex items-center justify-center text-white font-semibold text-lg`}>
                        {student.initials}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{student.name}</h3>
                        <p className="text-gray-600 text-sm">{student.instrument} • {student.plan}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">${student.price}</p>
                      <p className="text-sm text-gray-600">/month</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                      View Schedule
                    </button>
                    <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                      Manage Plan
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Invoice History */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Invoice History</h2>
              <p className="text-sm text-gray-600 mt-1">Download receipts for all household charges</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Invoice</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Students</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Amount</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-right py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-900">{invoice.id}</span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{invoice.date}</td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          {invoice.students} students
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-gray-900">{invoice.amount}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Download Invoice">
                            <Download className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View Details">
                            <ExternalLink className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Payment Method Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gray-600" />
              Payment Method
            </h3>
            
            <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg p-4 text-white mb-4">
              <div className="flex items-start justify-between mb-8">
                <div className="text-xs opacity-75">Credit Card</div>
                <div className="text-sm font-semibold">VISA</div>
              </div>
              <div className="mb-4">
                <div className="text-lg tracking-wider">•••• •••• •••• 5678</div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="opacity-75">Expires 06/29</div>
              </div>
            </div>

            <button className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              Update Payment Method
            </button>
          </div>

          {/* Monthly Total */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold mb-4">Monthly Total</h3>
            
            <div className="space-y-3 mb-4">
              {students.map((student) => (
                <div key={student.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${student.color} flex items-center justify-center text-white text-xs font-semibold`}>
                      {student.initials}
                    </div>
                    <span className="text-gray-600">{student.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">${student.price}</span>
                </div>
              ))}
              
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">${subtotal}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-green-700">
                  <Tag className="w-4 h-4" />
                  <span>Family Discount (10%)</span>
                </div>
                <span className="font-semibold text-green-700">-${discount}</span>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">${total}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Billed monthly</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm">
              <Calendar className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-blue-900 font-medium">Next charge on April 1</p>
                <p className="text-blue-700 text-xs mt-0.5">All students billed together</p>
              </div>
            </div>
          </div>

          {/* Add Student */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-6">
            <h3 className="font-semibold mb-2">Add Another Student</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enroll more children and save with our family discount.
            </p>
            <button className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Enroll New Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
