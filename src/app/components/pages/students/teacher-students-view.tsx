import { Search, Mail, Calendar, FileText, Send, Phone, MapPin, Clock, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useRole } from '@/app/context/role-context';
import type { RoleFamily } from '@/app/config/role-config';
import {
  useStudentsPageRoster,
  type StudentRosterRow,
  type StudentsRosterMode,
} from '@/app/dashboard/hooks/useStudentsPageRoster';
import { useDashboardLessons } from '@/app/dashboard/hooks/useDashboardLessons';
import { filterTodayLessons } from '@/app/dashboard/lessonDerived';
import { initialsFromDisplayName } from '@/lib/lesson-ui-helpers';

type UiStatus = 'active' | 'trial' | 'needs-followup' | 'attendance-risk';

type DisplayStudent = {
  id: string;
  name: string;
  avatar: string;
  instrument: string;
  email: string;
  phone: string;
  location: string;
  timezone: string;
  lessonDuration: string;
  lessonFrequency: string;
  makeupCreditsAvailable: string;
  makeupCreditsBooked: string;
  makeupCreditsUsed: string;
  attendanceRate: string;
  upcomingLesson: string;
  recentLesson: string;
  parentName?: string;
  status: UiStatus;
  notes?: string;
};

function rosterModeForFamily(family: RoleFamily): StudentsRosterMode | null {
  if (family === 'household') return 'household';
  if (family === 'instructor') return 'instructor';
  if (family === 'operations' || family === 'leadership') return 'operations';
  return null;
}

function pageHeader(roleFamily: RoleFamily): { title: string; subtitle: string } {
  switch (roleFamily) {
    case 'household':
      return {
        title: 'Students',
        subtitle: 'Learners linked to your household. Names come from profiles when RLS allows.',
      };
    case 'instructor':
      return {
        title: 'My Students',
        subtitle: 'Students assigned to you (active teacher–student links).',
      };
    case 'operations':
      return {
        title: 'Student roster',
        subtitle: 'Students visible for your admin scope (RLS-limited list).',
      };
    case 'leadership':
      return {
        title: 'Student roster',
        subtitle: 'Organization-wide student visibility where your role allows.',
      };
    default:
      return { title: 'Students', subtitle: '' };
  }
}

function rosterRowToDisplay(row: StudentRosterRow): DisplayStudent {
  const name = row.displayName;
  const dash = '—';
  return {
    id: row.studentId,
    name,
    avatar: initialsFromDisplayName(name),
    instrument: dash,
    email: dash,
    phone: dash,
    location: dash,
    timezone: dash,
    lessonDuration: dash,
    lessonFrequency: dash,
    makeupCreditsAvailable: dash,
    makeupCreditsBooked: dash,
    makeupCreditsUsed: dash,
    attendanceRate: dash,
    upcomingLesson: dash,
    recentLesson: dash,
    status: 'active',
  };
}

function emptyRosterMessage(roleFamily: RoleFamily): { title: string; body: string } {
  switch (roleFamily) {
    case 'household':
      return {
        title: 'No linked students',
        body: 'We did not find any students tied to your household for this account. If something looks wrong, confirm household membership and RLS in Supabase.',
      };
    case 'instructor':
      return {
        title: 'No assigned students',
        body: 'There are no active teacher–student assignments for you yet. Assignments must be active in teacher_student_assignments.',
      };
    case 'operations':
    case 'leadership':
      return {
        title: 'No students in scope',
        body: 'No student rows were returned for your role. This can happen with an empty database or stricter RLS than expected.',
      };
    default:
      return { title: 'No students', body: '' };
  }
}

export function TeacherStudentsView() {
  const { roleFamily } = useRole();
  const mode = useMemo(() => rosterModeForFamily(roleFamily), [roleFamily]);
  const { students: rosterStudents, loading: rosterLoading, error: rosterError } = useStudentsPageRoster(mode);
  const { lessons, loading: lessonsLoading } = useDashboardLessons();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | UiStatus>('all');

  const displayStudents = useMemo(() => rosterStudents.map(rosterRowToDisplay), [rosterStudents]);

  const filteredStudents = displayStudents.filter((student) => {
    if (searchQuery && !student.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && student.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const header = pageHeader(roleFamily);
  const lessonsToday = filterTodayLessons(lessons).length;
  const activeStudents = rosterStudents.length;
  const dashSummary = '—';

  const getStatusBadge = (status: UiStatus) => {
    switch (status) {
      case 'active':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</span>;
      case 'trial':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Trial</span>;
      case 'needs-followup':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Needs Follow-Up</span>;
      case 'attendance-risk':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Attendance Risk</span>;
    }
  };

  const rosterEmpty = !rosterLoading && rosterStudents.length === 0 && !rosterError;
  const emptyHint = emptyRosterMessage(roleFamily);

  return (
    <div className="bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{header.title}</h1>
          <p className="text-sm md:text-base text-gray-600">{header.subtitle}</p>
          {rosterLoading && <p className="mt-2 text-sm text-gray-500">Loading students…</p>}
          {rosterError && (
            <p className="mt-2 text-sm text-red-600 rounded-lg bg-red-50 border border-red-100 px-3 py-2">{rosterError}</p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              <h3 className="text-xs md:text-sm font-medium text-gray-600">Active Students</h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">
              {rosterLoading ? '…' : activeStudents}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <Calendar className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              <h3 className="text-xs md:text-sm font-medium text-gray-600">Lessons Today</h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">
              {lessonsLoading ? '…' : lessonsToday}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
              <h3 className="text-xs md:text-sm font-medium text-gray-600">Attendance Rate</h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">{dashSummary}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
              <h3 className="text-xs md:text-sm font-medium text-gray-600">Makeup Credits</h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">{dashSummary}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
              <h3 className="text-xs md:text-sm font-medium text-gray-600">Needs Follow-Up</h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">{dashSummary}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex gap-4 items-center mb-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all' as const, label: 'All Students' },
              { id: 'active' as const, label: 'Active' },
              { id: 'trial' as const, label: 'Trial' },
              { id: 'needs-followup' as const, label: 'Needs Follow-Up' },
              { id: 'attendance-risk' as const, label: 'Attendance Risk' },
            ].map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setStatusFilter(filter.id)}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === filter.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {!rosterEmpty && (
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {student.avatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{student.name}</h3>
                          {getStatusBadge(student.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {student.instrument} • {student.lessonDuration} • {student.lessonFrequency}
                        </p>
                        {student.parentName && <p className="text-sm text-gray-500">Parent: {student.parentName}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{student.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span>{student.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{student.location}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-xs text-green-700 font-medium mb-1">Attendance</p>
                        <p className="text-lg font-bold text-green-900">{student.attendanceRate}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs text-blue-700 font-medium mb-1">Available</p>
                        <p className="text-lg font-bold text-blue-900">{student.makeupCreditsAvailable}</p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3">
                        <p className="text-xs text-amber-700 font-medium mb-1">Booked</p>
                        <p className="text-lg font-bold text-amber-900">{student.makeupCreditsBooked}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3">
                        <p className="text-xs text-purple-700 font-medium mb-1">Used</p>
                        <p className="text-lg font-bold text-purple-900">{student.makeupCreditsUsed}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-700 font-medium mb-1">Upcoming</p>
                        <p className="text-sm font-bold text-gray-900">{student.upcomingLesson}</p>
                      </div>
                    </div>

                    {student.notes && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-900">
                          <strong>Notes:</strong> {student.notes}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        Message
                      </button>
                      <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                      >
                        <Calendar className="w-4 h-4" />
                        View Attendance
                      </button>
                      <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        View Notes
                      </button>
                      <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        Assign Resource
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {rosterEmpty && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{emptyHint.title}</h3>
            <p className="text-gray-600 max-w-lg mx-auto">{emptyHint.body}</p>
          </div>
        )}

        {!rosterEmpty && filteredStudents.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
