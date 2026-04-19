import { CreditCard, Download, Calendar, CheckCircle2, User, ExternalLink } from 'lucide-react';

export function ParentBillingView() {
  const invoices = [
    { id: 'INV-2026-003', date: 'Mar 1, 2026', amount: '$160.00', status: 'Paid', downloadUrl: '#' },
    { id: 'INV-2026-002', date: 'Feb 1, 2026', amount: '$160.00', status: 'Paid', downloadUrl: '#' },
    { id: 'INV-2026-001', date: 'Jan 1, 2026', amount: '$160.00', status: 'Paid', downloadUrl: '#' }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Billing</h1>
        <p className="text-gray-600">Manage your child's lesson subscription and payment details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Plan Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 border-b border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold text-lg">
                    ES
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Emma Smith</h2>
                    <p className="text-gray-600 text-sm">Piano • Age 9</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Active
                </span>
              </div>
              
              <div className="space-y-2">
                <p className="text-gray-700">Weekly Piano Lessons</p>
                <p className="text-sm text-gray-600">Individual instruction • 30-minute sessions</p>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-4xl font-bold text-gray-900">$160</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Next Payment Date</p>
                  <p className="font-semibold text-gray-900">April 1, 2026</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Billing Cycle</p>
                  <p className="font-semibold text-gray-900">Monthly</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Teacher</p>
                  <p className="font-semibold text-gray-900">Sarah Johnson</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Lessons per Week</p>
                  <p className="font-semibold text-gray-900">1 lesson</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Manage Subscription
                </button>
                <button className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  View Schedule
                </button>
              </div>
            </div>
          </div>

          {/* Invoice History */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Invoice History</h2>
              <p className="text-sm text-gray-600 mt-1">Download receipts and view past payments</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Invoice</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Student</th>
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
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs font-semibold">
                            ES
                          </div>
                          <span className="text-gray-900">Emma</span>
                        </div>
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
                <div className="text-sm font-semibold">MASTERCARD</div>
              </div>
              <div className="mb-4">
                <div className="text-lg tracking-wider">•••• •••• •••• 8765</div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="opacity-75">Expires 09/27</div>
              </div>
            </div>

            <button className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              Update Payment Method
            </button>
          </div>

          {/* Billing Contact */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold mb-4">Billing Contact</h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Name</p>
                <p className="font-medium text-gray-900">Jennifer Smith</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="font-medium text-gray-900">jennifer@email.com</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone</p>
                <p className="font-medium text-gray-900">(555) 123-4567</p>
              </div>
            </div>

            <button className="w-full mt-4 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              Update Contact Info
            </button>
          </div>

          {/* Next Payment */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold mb-4">Next Payment</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Monthly Tuition</span>
                <span className="font-semibold text-gray-900">$160.00</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total Due</span>
                  <span className="text-2xl font-bold text-gray-900">$160.00</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm">
              <Calendar className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-blue-900 font-medium">Charges on April 1, 2026</p>
                <p className="text-blue-700 text-xs mt-0.5">Auto-payment via card ending in 8765</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
