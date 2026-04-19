import { Link } from 'react-router';
import { User, Users, Baby, Building2, GraduationCap, School, Shield, UserCog } from 'lucide-react';

const roles = [
  {
    id: 'adult-student',
    name: 'Adult Student',
    description: 'Individual learner dashboard with practice plans and progress tracking',
    icon: GraduationCap,
    path: '/adult-student',
    category: 'student'
  },
  {
    id: 'parent',
    name: 'Parent/Guardian',
    description: 'Oversee your child\'s music education journey',
    icon: User,
    path: '/parent',
    category: 'student'
  },
  {
    id: 'family',
    name: 'Family (Multiple Children)',
    description: 'Manage lessons and progress for multiple children',
    icon: Users,
    path: '/family',
    category: 'student'
  },
  {
    id: 'child',
    name: 'Child Student',
    description: 'Simple, motivating dashboard for young learners',
    icon: Baby,
    path: '/child',
    category: 'student'
  },
  {
    id: 'teacher',
    name: 'Teacher',
    description: 'Manage daily teaching workflow, students, and lesson notes',
    icon: School,
    path: '/teacher',
    category: 'staff'
  },
  {
    id: 'teacher-manager',
    name: 'Teacher Manager',
    description: 'Oversee teacher performance, utilization, and team metrics',
    icon: UserCog,
    path: '/teacher-manager',
    category: 'admin'
  },
  {
    id: 'admin',
    name: 'General Admin',
    description: 'Platform operations, user management, and system health',
    icon: Shield,
    path: '/admin',
    category: 'admin'
  },
  {
    id: 'organization',
    name: 'Organization Admin',
    description: 'Business analytics, roster management, and program oversight',
    icon: Building2,
    path: '/organization',
    category: 'admin'
  }
];

export function RoleSelector() {
  const studentRoles = roles.filter(r => r.category === 'student');
  const staffRoles = roles.filter(r => r.category === 'staff');
  const adminRoles = roles.filter(r => r.category === 'admin');

  return (
    <div className="min-h-full bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold mb-4">Welcome to Musikkii Portal</h1>
          <p className="text-lg text-gray-600">Select your role to view the corresponding dashboard experience</p>
        </div>

        {/* Student & Parent Roles */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Student & Parent Dashboards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {studentRoles.map((role) => (
              <Link
                key={role.id}
                to={role.path}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[var(--musikkii-blue)] hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" 
                     style={{ backgroundColor: 'var(--musikkii-blue)' }}>
                  <role.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{role.name}</h3>
                <p className="text-sm text-gray-600">{role.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Teacher Roles */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Teacher Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {staffRoles.map((role) => (
              <Link
                key={role.id}
                to={role.path}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[var(--musikkii-blue)] hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform bg-purple-500">
                  <role.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{role.name}</h3>
                <p className="text-sm text-gray-600">{role.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Admin Roles */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Administration Dashboards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {adminRoles.map((role) => (
              <Link
                key={role.id}
                to={role.path}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[var(--musikkii-blue)] hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform bg-orange-500">
                  <role.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{role.name}</h3>
                <p className="text-sm text-gray-600">{role.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">About This Portal</h2>
          <p className="text-gray-600 mb-4">
            Musikkii Portal is a unified platform designed to serve different user roles with tailored experiences. 
            All roles share the same design system, navigation structure, and core components, but display different 
            information and features based on the user's needs.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--musikkii-blue)' }} />
              <span><strong>Shared Design System:</strong> Consistent UI components, colors, and styling across all roles</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--musikkii-blue)' }} />
              <span><strong>Role-Based Access:</strong> Each user sees only the features and data relevant to them</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--musikkii-blue)' }} />
              <span><strong>Theme Preferences:</strong> Switch between Clean and Vibrant modes to match your style</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--musikkii-blue)' }} />
              <span><strong>Scalable Architecture:</strong> Built for growth and future enhancements</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}