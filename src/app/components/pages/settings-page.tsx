import { Settings, User, Bell, Lock, Globe, HelpCircle, Users, CreditCard, Target, DollarSign, Building2, LogOut } from 'lucide-react';
import { useRole } from '../../context/role-context';
import { useAuthSession } from '../../context/auth-session-context';

export function SettingsPage() {
  const { roleFamily } = useRole();
  const { isConfigured, user, profile, profileError, signOut } = useAuthSession();

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      {/* Account Settings - Common to all */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--musikkii-blue)' }}>
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Account</h2>
            <p className="text-sm text-gray-600">Manage your profile and security</p>
          </div>
        </div>

        <div className="space-y-3">
          {isConfigured && user && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
              <p className="font-medium text-gray-900">Signed in</p>
              <p className="mt-1">{user.email}</p>
              {profile?.full_name && <p className="mt-0.5">{profile.full_name}</p>}
              {profile?.app_role && (
                <p className="mt-1 text-xs text-gray-500">App role (database): {profile.app_role}</p>
              )}
              {profileError && <p className="mt-2 text-xs text-amber-700">Profile could not be loaded: {profileError}</p>}
              <button
                type="button"
                onClick={() => void signOut()}
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-red-700 hover:text-red-800"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
          <button className="w-full py-3 px-4 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
            <p className="font-medium">Profile Information</p>
            <p className="text-sm text-gray-600 mt-1">Update your name, email, and profile picture</p>
          </button>
          <button className="w-full py-3 px-4 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
            <p className="font-medium">Password & Security</p>
            <p className="text-sm text-gray-600 mt-1">Change password and manage security settings</p>
          </button>
        </div>
      </div>

      {/* Notification Settings - Common to all */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Notifications</h2>
            <p className="text-sm text-gray-600">Control how you receive updates</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="font-medium">Lesson Reminders</p>
              <p className="text-sm text-gray-600">Get notified before lessons</p>
            </div>
            <div className="w-12 h-6 rounded-full relative cursor-pointer" style={{ backgroundColor: 'var(--musikkii-blue)' }}>
              <div className="w-5 h-5 rounded-full bg-white absolute right-0.5 top-0.5"></div>
            </div>
          </div>

          {(roleFamily === 'learner') && (
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-medium">Practice Reminders</p>
                <p className="text-sm text-gray-600">Daily practice notifications</p>
              </div>
              <div className="w-12 h-6 rounded-full relative cursor-pointer" style={{ backgroundColor: 'var(--musikkii-blue)' }}>
                <div className="w-5 h-5 rounded-full bg-white absolute right-0.5 top-0.5"></div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Message Notifications</p>
              <p className="text-sm text-gray-600">Email notifications for new messages</p>
            </div>
            <div className="w-12 h-6 rounded-full bg-gray-300 relative cursor-pointer">
              <div className="w-5 h-5 rounded-full bg-white absolute left-0.5 top-0.5"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Role-Specific Settings */}
      {roleFamily === 'learner' && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Practice Preferences</h2>
              <p className="text-sm text-gray-600">Customize your practice experience</p>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full py-3 px-4 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
              <p className="font-medium">Daily Practice Goal</p>
              <p className="text-sm text-gray-600 mt-1">Set your target practice duration</p>
            </button>
            <button className="w-full py-3 px-4 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
              <p className="font-medium">Gamification Settings</p>
              <p className="text-sm text-gray-600 mt-1">Manage XP, streaks, and league preferences</p>
            </button>
          </div>
        </div>
      )}

      {roleFamily === 'household' && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Family Management</h2>
              <p className="text-sm text-gray-600">Manage students and household settings</p>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full py-3 px-4 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
              <p className="font-medium">Manage Students</p>
              <p className="text-sm text-gray-600 mt-1">Add or remove students from your household</p>
            </button>
            <button className="w-full py-3 px-4 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
              <p className="font-medium">Parental Controls</p>
              <p className="text-sm text-gray-600 mt-1">Set permissions and visibility preferences</p>
            </button>
          </div>
        </div>
      )}

      {roleFamily === 'instructor' && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Teaching Preferences</h2>
              <p className="text-sm text-gray-600">Manage your teaching settings</p>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full py-3 px-4 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
              <p className="font-medium">Availability & Scheduling</p>
              <p className="text-sm text-gray-600 mt-1">Set your teaching hours and availability</p>
            </button>
            <button className="w-full py-3 px-4 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
              <p className="font-medium">Lesson Preferences</p>
              <p className="text-sm text-gray-600 mt-1">Default lesson settings and templates</p>
            </button>
          </div>
        </div>
      )}

      {(roleFamily === 'operations' || roleFamily === 'leadership') && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Platform Settings</h2>
              <p className="text-sm text-gray-600">Organization-wide configuration</p>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full py-3 px-4 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
              <p className="font-medium">Organization Profile</p>
              <p className="text-sm text-gray-600 mt-1">Update organization information</p>
            </button>
            <button className="w-full py-3 px-4 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
              <p className="font-medium">Platform Policies</p>
              <p className="text-sm text-gray-600 mt-1">Manage cancellation, billing, and teaching policies</p>
            </button>
          </div>
        </div>
      )}

      {/* Billing Settings - For learner, household, operations, leadership */}
      {(roleFamily === 'learner' || roleFamily === 'household' || roleFamily === 'operations' || roleFamily === 'leadership') && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Billing</h2>
              <p className="text-sm text-gray-600">Manage payment methods and billing</p>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full py-3 px-4 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
              <p className="font-medium">Payment Methods</p>
              <p className="text-sm text-gray-600 mt-1">Add or update payment information</p>
            </button>
            <button className="w-full py-3 px-4 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
              <p className="font-medium">Billing History</p>
              <p className="text-sm text-gray-600 mt-1">View invoices and payment history</p>
            </button>
          </div>
        </div>
      )}

      {/* Payout Settings - For instructor */}
      {roleFamily === 'instructor' && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Payout Settings</h2>
              <p className="text-sm text-gray-600">Manage your payment information</p>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full py-3 px-4 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
              <p className="font-medium">Bank Account</p>
              <p className="text-sm text-gray-600 mt-1">Update payout bank information</p>
            </button>
            <button className="w-full py-3 px-4 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
              <p className="font-medium">Payout Schedule</p>
              <p className="text-sm text-gray-600 mt-1">View payout history and schedule</p>
            </button>
          </div>
        </div>
      )}

      {/* Additional Settings - Common to all */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold">Language & Region</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">English (United States)</p>
          <button className="text-sm font-medium hover:underline" style={{ color: 'var(--musikkii-blue)' }}>
            Change Language
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold">Privacy</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">Data and privacy settings</p>
          <button className="text-sm font-medium hover:underline" style={{ color: 'var(--musikkii-blue)' }}>
            Manage Privacy
          </button>
        </div>
      </div>

      {/* Help & Support - Common to all */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gray-500 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Help & Support</h2>
            <p className="text-sm text-gray-600">Get assistance and resources</p>
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full py-3 px-4 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
            <p className="font-medium">Help Center</p>
            <p className="text-sm text-gray-600 mt-1">Browse guides and documentation</p>
          </button>
          <button className="w-full py-3 px-4 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
            <p className="font-medium">Contact Support</p>
            <p className="text-sm text-gray-600 mt-1">Get help from our team</p>
          </button>
        </div>
      </div>
    </div>
  );
}
