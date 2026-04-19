import { Shield, TrendingUp, AlertTriangle, CheckCircle, Clock, Link, Eye, FileText, ChevronRight, Target, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function ExecutiveOperationsView() {
  // Operational health KPIs
  const operationalKPIs = {
    policyCompliance: 98,
    automationUptime: 96.5,
    integrationHealth: 100,
    communicationDelivery: 99.2,
    onboardingCompletion: 87,
    activeWorkflows: 24,
    criticalIssues: 1,
    pendingApprovals: 3
  };

  // Policy status
  const policies = [
    { name: 'Make-up Credit Policy', version: 'v2.1', status: 'active', lastUpdated: 'Feb 1, 2026', compliance: 99 },
    { name: 'Cancellation Policy', version: 'v1.5', status: 'active', lastUpdated: 'Jan 15, 2026', compliance: 98 },
    { name: 'Trial Lesson Policy', version: 'v1.3', status: 'active', lastUpdated: 'Dec 10, 2025', compliance: 100 },
    { name: 'Refund Policy', version: 'v3.0', status: 'pending-approval', lastUpdated: 'Mar 10, 2026', compliance: 97 },
  ];

  // Integration health
  const integrationHealth = [
    { name: 'Stripe', status: 'healthy', uptime: 100, criticalToRevenue: true },
    { name: 'HubSpot', status: 'healthy', uptime: 99.8, criticalToRevenue: true },
    { name: 'Zapier', status: 'degraded', uptime: 94.2, criticalToRevenue: false },
    { name: 'Zoom', status: 'healthy', uptime: 99.9, criticalToRevenue: true },
    { name: 'Slack', status: 'healthy', uptime: 100, criticalToRevenue: false },
    { name: 'Gusto', status: 'healthy', uptime: 99.5, criticalToRevenue: true },
    { name: 'Noteflight', status: 'healthy', uptime: 98.8, criticalToRevenue: false },
  ];

  // Workflow performance
  const workflowPerformance = [
    { workflow: 'Trial to Paid', successRate: 92, runs: 156, avgTime: '2.3 days' },
    { workflow: 'Onboarding Sequence', successRate: 87, runs: 234, avgTime: '5.1 days' },
    { workflow: 'Payment Reminder', successRate: 99, runs: 842, avgTime: 'Instant' },
    { workflow: 'Lesson Reminder', successRate: 98, runs: 1245, avgTime: 'Instant' },
  ];

  // Operational risk areas
  const riskAreas = [
    { area: 'Automation Failures', level: 'low', count: 3, trend: 'stable', impact: 'Minimal service disruption' },
    { area: 'Integration Degradation', level: 'medium', count: 1, trend: 'improving', impact: 'Zapier workflow delays' },
    { area: 'Policy Compliance Gaps', level: 'low', count: 2, trend: 'stable', impact: 'Minor edge cases' },
  ];

  // Activity trends
  const activityTrends = [
    { month: 'Sep', workflows: 820, issues: 8 },
    { month: 'Oct', workflows: 945, issues: 6 },
    { month: 'Nov', workflows: 1032, issues: 5 },
    { month: 'Dec', workflows: 1156, issues: 4 },
    { month: 'Jan', workflows: 1289, issues: 3 },
    { month: 'Feb', workflows: 1421, issues: 2 },
  ];

  // Governance insights
  const governanceData = {
    policiesActive: 12,
    policiesDraft: 2,
    policiesPendingApproval: 1,
    lastAuditDate: 'Feb 15, 2026',
    complianceScore: 98,
    auditFrequency: 'Quarterly'
  };

  return (
    <div className="bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Operations Oversight</h1>
          <p className="text-sm md:text-base text-gray-600">Strategic visibility into operational health, governance, and system performance</p>
        </div>

        {/* Executive KPI Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-700" />
              <p className="text-xs md:text-sm font-medium text-green-700">Integration Health</p>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-green-900">{operationalKPIs.integrationHealth}%</p>
            <p className="text-xs text-green-600 mt-1">All systems operational</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-700" />
              <p className="text-xs md:text-sm font-medium text-blue-700">Automation Uptime</p>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-blue-900">{operationalKPIs.automationUptime}%</p>
            <p className="text-xs text-blue-600 mt-1">{operationalKPIs.activeWorkflows} workflows active</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-purple-700" />
              <p className="text-xs md:text-sm font-medium text-purple-700">Policy Compliance</p>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-purple-900">{operationalKPIs.policyCompliance}%</p>
            <p className="text-xs text-purple-600 mt-1">{governanceData.policiesActive} active policies</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-sm border border-amber-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-amber-700" />
              <p className="text-xs md:text-sm font-medium text-amber-700">Pending Approvals</p>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-amber-900">{operationalKPIs.pendingApprovals}</p>
            <p className="text-xs text-amber-600 mt-1">Action required</p>
          </div>
        </div>

        {/* Critical Alerts */}
        {operationalKPIs.criticalIssues > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 md:p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-red-900 mb-2">Critical Operational Issues ({operationalKPIs.criticalIssues})</h3>
                <div className="space-y-2">
                  <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Zapier Workflow Degradation</p>
                      <p className="text-xs text-gray-600">Integration experiencing delays - non-critical workflows affected</p>
                    </div>
                    <button className="text-sm text-red-600 hover:text-red-700 font-medium">Review →</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pending Approvals */}
        {operationalKPIs.pendingApprovals > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg md:text-xl font-bold text-gray-900">Pending Executive Approvals</h2>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">{operationalKPIs.pendingApprovals} pending</span>
            </div>
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Refund Policy Update (v3.0)</h4>
                    <p className="text-sm text-gray-600 mb-2">Extends refund window from 14 to 30 days for registration fees</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>Submitted: Mar 10, 2026</span>
                      <span>•</span>
                      <span>By: Sarah Mitchell (Admin)</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                      Approve
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                      Review
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">New Integration: Calendly</h4>
                    <p className="text-sm text-gray-600 mb-2">Proposed integration for automated trial lesson scheduling</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>Submitted: Mar 12, 2026</span>
                      <span>•</span>
                      <span>By: David Chen (Operations)</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                      Approve
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                      Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Policy Governance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Policy Governance</h2>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All Policies →</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-green-700 font-medium mb-1">Active Policies</p>
              <p className="text-2xl font-bold text-green-900">{governanceData.policiesActive}</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <p className="text-sm text-amber-700 font-medium mb-1">Pending Approval</p>
              <p className="text-2xl font-bold text-amber-900">{governanceData.policiesPendingApproval}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-700 font-medium mb-1">Draft Policies</p>
              <p className="text-2xl font-bold text-blue-900">{governanceData.policiesDraft}</p>
            </div>
          </div>

          <div className="space-y-2">
            {policies.map((policy) => (
              <div key={policy.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 text-sm">{policy.name}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      policy.status === 'active' ? 'bg-green-100 text-green-700' :
                      policy.status === 'pending-approval' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {policy.status === 'pending-approval' ? 'Pending Approval' : policy.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                    <span>{policy.version}</span>
                    <span>•</span>
                    <span>Updated: {policy.lastUpdated}</span>
                    <span>•</span>
                    <span>Compliance: {policy.compliance}%</span>
                  </div>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View</button>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Health & Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Link className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Integration Health</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrationHealth.map((integration) => (
              <div
                key={integration.name}
                className={`rounded-lg p-4 border-2 ${
                  integration.status === 'healthy' ? 'bg-green-50 border-green-200' :
                  integration.status === 'degraded' ? 'bg-amber-50 border-amber-200' :
                  'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{integration.name}</h4>
                  {integration.criticalToRevenue && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">Critical</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {integration.status === 'healthy' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    integration.status === 'healthy' ? 'text-green-700' : 'text-amber-700'
                  }`}>
                    {integration.status === 'healthy' ? 'Operational' : 'Degraded'}
                  </span>
                </div>
                <p className="text-xs text-gray-600">Uptime: {integration.uptime}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Workflow Performance</h2>
            </div>
          </div>

          <div className="space-y-3">
            {workflowPerformance.map((workflow) => (
              <div key={workflow.workflow} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{workflow.workflow}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    workflow.successRate >= 95 ? 'bg-green-100 text-green-700' :
                    workflow.successRate >= 85 ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {workflow.successRate}% success
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span>{workflow.runs} runs this month</span>
                  <span>•</span>
                  <span>Avg time: {workflow.avgTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Operational Activity Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="workflows" fill="#3b82f6" name="Workflow Executions" radius={[8, 8, 0, 0]} />
              <Bar dataKey="issues" fill="#f59e0b" name="Issues Resolved" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-gray-900">Operational Risk Areas</h3>
            </div>
            <div className="space-y-3">
              {riskAreas.map((risk) => (
                <div key={risk.area} className={`rounded-lg p-3 border ${
                  risk.level === 'low' ? 'bg-green-50 border-green-200' :
                  risk.level === 'medium' ? 'bg-amber-50 border-amber-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{risk.area}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      risk.level === 'low' ? 'bg-green-100 text-green-700' :
                      risk.level === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {risk.level} risk
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{risk.impact}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>{risk.count} incidents</span>
                    <span>•</span>
                    <span>Trend: {risk.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-700" />
              <h3 className="font-bold text-blue-900">Strategic Operational Insights</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-blue-800">
                <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span><strong>Automation scaling:</strong> Workflow executions up 73% over 6 months</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-blue-800">
                <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span><strong>System stability:</strong> 99%+ uptime across revenue-critical integrations</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-blue-800">
                <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span><strong>Policy compliance:</strong> 98% adherence across all active policies</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-blue-800">
                <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span><strong>Risk posture:</strong> Only 1 medium-risk issue, trend improving</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
