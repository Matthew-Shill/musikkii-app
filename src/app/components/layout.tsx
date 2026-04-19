import { Outlet, Link, useLocation } from 'react-router';
import {
  Bell,
  User,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { useRole, UserRole } from '../context/role-context';
import { useState } from 'react';
import { Logo } from './shared/logo';
import { getNavigationForRole } from '../config/role-config';
import { usePermissions } from '../hooks/usePermissions';
import { getMockUserForRole } from '../data/mockData';

const roleOptions: Array<{ value: UserRole; label: string }> = [
  { value: 'adult-student', label: 'Adult Student' },
  { value: 'child-student', label: 'Child Student' },
  { value: 'parent', label: 'Parent / Guardian' },
  { value: 'family', label: 'Family / Multi-Student' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'teacher-manager', label: 'Teacher Manager' },
  { value: 'admin', label: 'Admin' },
  { value: 'executive', label: 'Executive' },
];

export function Layout() {
  const location = useLocation();
  const { role, setRole, roleLabel, roleFamily } = useRole();
  const { hasPermission } = usePermissions();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Get mock user profile for current role
  const currentUser = getMockUserForRole(role);

  // Get navigation for current role from role family config
  const allNavigationItems = getNavigationForRole(role);

  // Filter navigation based on permissions
  const navigation = allNavigationItems.filter(item => {
    // If item has no permission requirement, show it
    if (!item.permission) return true;

    // Otherwise, check if user has the required permission
    return hasPermission(item.permission);
  });

  // Mobile bottom nav - show top 4 most important routes
  const mobileBottomNav = navigation.slice(0, 4);

  return (
    <div className="h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={isActive ? { backgroundColor: 'var(--musikkii-blue)' } : {}}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col z-50 md:hidden">
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
              <Link to="/" onClick={() => setShowMobileMenu(false)}>
                <Logo />
              </Link>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    style={isActive ? { backgroundColor: 'var(--musikkii-blue)' } : {}}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
                  <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 md:min-h-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 flex-shrink-0">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(true)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors active:bg-gray-200"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>

          {/* Logo - Mobile Only */}
          <Link to="/" className="md:hidden">
            <Logo className="h-8" />
          </Link>

          {/* Role Selector - Hidden text on small mobile */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <User className="w-4 h-4 text-gray-600" />
              <span className="hidden sm:inline text-sm font-medium text-gray-700">
                <span className="hidden md:inline">Viewing as: </span>
                <span className="font-semibold">{roleLabel}</span>
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* Role Dropdown */}
            {showRoleDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowRoleDropdown(false)}
                />
                <div className="absolute top-full right-0 md:left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase">Switch Role</p>
                  </div>
                  {roleOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setRole(option.value);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                        role === option.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                      {role === option.value && (
                        <span className="ml-2 text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--musikkii-blue)' }} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-30">
          <div className="flex items-center justify-around px-2 py-2">
            {mobileBottomNav.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[64px] ${
                    isActive ? 'text-white' : 'text-gray-600'
                  }`}
                  style={isActive ? { backgroundColor: 'var(--musikkii-blue)' } : {}}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-xs font-medium truncate max-w-full">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}