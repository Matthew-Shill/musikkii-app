import { Settings, Shield, Calendar, DollarSign, Mail, Zap, Link, Users, BookOpen, AlertCircle, CheckCircle, Clock, Edit, Save, Play, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function AdminOperationsView() {
  const [activeTab, setActiveTab] = useState('policy');

  // Mock operational health data
  const operationalHealth = {
    automationFailures: 3,
    brokenIntegrations: 0,
    unsentReminders: 1,
    overdueOnboarding: 12,
    unassignedStudents: 5,
    paymentExceptions: 8,
    schedulingConflicts: 2,
    communicationFailures: 1,
    flaggedAccounts: 7
  };

  const totalIssues = Object.values(operationalHealth).reduce((sum, val) => sum + val, 0);

  // Integration status
  const integrations = [
    { name: 'Stripe', status: 'connected', lastSync: '2 min ago', health: 'healthy', icon: '💳' },
    { name: 'HubSpot', status: 'connected', lastSync: '15 min ago', health: 'healthy', icon: '🎯' },
    { name: 'Zapier', status: 'warning', lastSync: '3 hours ago', health: 'degraded', icon: '⚡' },
    { name: 'Zoom', status: 'connected', lastSync: '5 min ago', health: 'healthy', icon: '📹' },
    { name: 'Slack', status: 'connected', lastSync: '1 min ago', health: 'healthy', icon: '💬' },
    { name: 'Noteflight', status: 'connected', lastSync: '30 min ago', health: 'healthy', icon: '🎵' },
    { name: 'Gusto', status: 'connected', lastSync: '1 hour ago', health: 'healthy', icon: '💰' },
    { name: 'Rewardful', status: 'connected', lastSync: '10 min ago', health: 'healthy', icon: '🎁' },
  ];

  const tabs = [
    { id: 'policy', label: 'Policy Controls', icon: Shield },
    { id: 'scheduling', label: 'Scheduling', icon: Calendar },
    { id: 'billing', label: 'Billing & Finance', icon: DollarSign },
    { id: 'communication', label: 'Communications', icon: Mail },
    { id: 'automation', label: 'Automations', icon: Zap },
    { id: 'integrations', label: 'Integrations', icon: Link },
    { id: 'users', label: 'User Lifecycle', icon: Users },
    { id: 'resources', label: 'Curriculum', icon: BookOpen },
  ];

  return (
    <div className="bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Operations Control Center</h1>
          <p className="text-sm md:text-base text-gray-600">Configure policies, workflows, integrations, and operational settings</p>
        </div>

        {/* Operational Health Alert */}
        {totalIssues > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900 mb-3">Operational Exceptions Requiring Attention ({totalIssues})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {operationalHealth.automationFailures > 0 && (
                    <div className="flex items-center justify-between text-sm bg-white rounded-lg p-3">
                      <span className="text-amber-800">Automation failures</span>
                      <span className="font-bold text-amber-900">{operationalHealth.automationFailures}</span>
                    </div>
                  )}
                  {operationalHealth.overdueOnboarding > 0 && (
                    <div className="flex items-center justify-between text-sm bg-white rounded-lg p-3">
                      <span className="text-amber-800">Overdue onboarding</span>
                      <span className="font-bold text-amber-900">{operationalHealth.overdueOnboarding}</span>
                    </div>
                  )}
                  {operationalHealth.paymentExceptions > 0 && (
                    <div className="flex items-center justify-between text-sm bg-white rounded-lg p-3">
                      <span className="text-amber-800">Payment exceptions</span>
                      <span className="font-bold text-amber-900">{operationalHealth.paymentExceptions}</span>
                    </div>
                  )}
                  {operationalHealth.flaggedAccounts > 0 && (
                    <div className="flex items-center justify-between text-sm bg-white rounded-lg p-3">
                      <span className="text-amber-800">Flagged accounts</span>
                      <span className="font-bold text-amber-900">{operationalHealth.flaggedAccounts}</span>
                    </div>
                  )}
                  {operationalHealth.unassignedStudents > 0 && (
                    <div className="flex items-center justify-between text-sm bg-white rounded-lg p-3">
                      <span className="text-amber-800">Unassigned students</span>
                      <span className="font-bold text-amber-900">{operationalHealth.unassignedStudents}</span>
                    </div>
                  )}
                  {operationalHealth.schedulingConflicts > 0 && (
                    <div className="flex items-center justify-between text-sm bg-white rounded-lg p-3">
                      <span className="text-amber-800">Scheduling conflicts</span>
                      <span className="font-bold text-amber-900">{operationalHealth.schedulingConflicts}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Integration Health Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Link className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Integration Status</h2>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Manage All →</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className={`rounded-lg p-3 border-2 ${
                  integration.health === 'healthy' ? 'bg-green-50 border-green-200' :
                  integration.health === 'degraded' ? 'bg-amber-50 border-amber-200' :
                  'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{integration.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{integration.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {integration.health === 'healthy' ? (
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                  )}
                  <span className="text-xs text-gray-600">{integration.lastSync}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 md:px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          {activeTab === 'policy' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Policy Controls</h3>
              <div className="space-y-6">
                {/* Make-up Credit Rules */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Make-up Credit Rules</h4>
                      <p className="text-sm text-gray-600">Configure how make-up credits are issued and managed</p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Credit Expiration</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>90 days</option>
                        <option>60 days</option>
                        <option>30 days</option>
                        <option>No expiration</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Cancellation Window</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>24 hours</option>
                        <option>48 hours</option>
                        <option>72 hours</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">No-Show Policy</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>No credit issued</option>
                        <option>Partial credit (50%)</option>
                        <option>Full credit (one-time)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">NML Policy</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Teacher initiated only</option>
                        <option>Automatic on absence</option>
                        <option>Requires approval</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Reset
                    </button>
                  </div>
                </div>

                {/* Trial Lesson Rules */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Trial Lesson Configuration</h4>
                      <p className="text-sm text-gray-600">Set rules for trial lesson eligibility and behavior</p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Trial Duration</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>30 minutes</option>
                        <option>45 minutes</option>
                        <option>60 minutes</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Trial Limit per Family</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>1 per family</option>
                        <option>1 per student</option>
                        <option>Unlimited</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Refund Policy */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Refund & Credit Policy</h4>
                      <p className="text-sm text-gray-600">Configure refund eligibility and processing rules</p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Allow registration fee refunds</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Automatic credit on cancellation (within window)</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scheduling' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Scheduling Operations</h3>
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Booking Rules</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Booking Buffer (Before)</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>5 minutes</option>
                        <option>10 minutes</option>
                        <option>15 minutes</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Booking Buffer (After)</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>5 minutes</option>
                        <option>10 minutes</option>
                        <option>15 minutes</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Blackout Dates & Closures</h4>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Spring Break 2026</p>
                        <p className="text-xs text-gray-600">March 15 - March 22, 2026</p>
                      </div>
                      <button className="text-sm text-red-600 hover:text-red-700 font-medium">Remove</button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Memorial Day</p>
                        <p className="text-xs text-gray-600">May 26, 2026</p>
                      </div>
                      <button className="text-sm text-red-600 hover:text-red-700 font-medium">Remove</button>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    + Add Blackout Date
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'communication' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Communication Operations</h3>
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Reminder Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Lesson Reminder (24h before)</p>
                        <p className="text-xs text-gray-600">Email + SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Payment Reminder (3 days before)</p>
                        <p className="text-xs text-gray-600">Email only</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'automation' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Workflow Automations</h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Trial to Paid Conversion</p>
                        <p className="text-sm text-gray-600">Triggers when trial lesson completed</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Play className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>Last run: 2 hours ago</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">Active</span>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Missed Lesson Follow-up</p>
                        <p className="text-sm text-gray-600">Sends follow-up 1 hour after no-show</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>Last run: 15 min ago</span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded">Warning: 2 failures</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Integration Management</h3>
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <div key={integration.name} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{integration.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">{integration.name}</h4>
                          <p className="text-sm text-gray-600">Last sync: {integration.lastSync}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {integration.health === 'healthy' ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Connected</span>
                        ) : (
                          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Degraded</span>
                        )}
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Settings className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                        Test Connection
                      </button>
                      <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                        View Logs
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
