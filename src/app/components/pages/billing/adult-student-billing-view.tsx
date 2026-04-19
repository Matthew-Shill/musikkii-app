import { CreditCard, Download, Calendar, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

export function AdultStudentBillingView() {
  const invoices = [
    { id: 'INV-2026-003', date: 'Mar 1, 2026', amount: '$180.00', status: 'Paid', downloadUrl: '#' },
    { id: 'INV-2026-002', date: 'Feb 1, 2026', amount: '$180.00', status: 'Paid', downloadUrl: '#' },
    { id: 'INV-2026-001', date: 'Jan 1, 2026', amount: '$180.00', status: 'Paid', downloadUrl: '#' },
    { id: 'INV-2025-012', date: 'Dec 1, 2025', amount: '$180.00', status: 'Paid', downloadUrl: '#' }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Billing</h1>
        <p className="text-gray-600">Manage your subscription, payment methods, and invoices</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Plan Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Weekly Piano Lessons</h2>
                  <p className="text-gray-600">Individual instruction • 45-minute sessions</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Active
                </span>
              </div>
              
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">$180</span>
                <span className="text-gray-600">/month</span>
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
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Change Plan
                </button>
                <button className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  Pause Subscription
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
                <div className="text-lg tracking-wider">•••• •••• •••• 4242</div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="opacity-75">Expires 12/28</div>
              </div>
            </div>

            <button className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              Update Payment Method
            </button>
          </div>

          {/* Billing Summary */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold mb-4">Billing Summary</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Weekly Lessons</span>
                <span className="font-semibold text-gray-900">$180.00</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold text-gray-900">$0.00</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">$180.00</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Billed monthly</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm">
              <Calendar className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-blue-900 font-medium">Next charge on April 1</p>
                <p className="text-blue-700 text-xs mt-0.5">You'll receive an email receipt</p>
              </div>
            </div>
          </div>

          {/* Help Card */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-6">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Questions about your billing? Our support team is here to help.
            </p>
            <button className="w-full px-4 py-2.5 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors border border-gray-200">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
