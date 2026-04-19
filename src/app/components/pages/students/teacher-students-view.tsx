import { Search, Mail, Calendar, FileText, Send, Phone, MapPin, Clock, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface Student {
  id: number;
  name: string;
  avatar: string;
  instrument: string;
  email: string;
  phone: string;
  location: string;
  timezone: string;
  lessonDuration: string;
  lessonFrequency: string;
  makeupCreditsAvailable: number;
  makeupCreditsBooked: number;
  makeupCreditsUsed: number;
  attendanceRate: number;
  upcomingLesson: string;
  recentLesson: string;
  parentName?: string;
  status: 'active' | 'trial' | 'needs-followup' | 'attendance-risk';
  notes?: string;
}

export function TeacherStudentsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'trial' | 'needs-followup' | 'attendance-risk'>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const students: Student[] = [
    {
      id: 1,
      name: 'Emma Thompson',
      avatar: 'E',
      instrument: 'Piano',
      email: 'emma.thompson@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      timezone: 'PST (UTC-8)',
      lessonDuration: '60 min',
      lessonFrequency: 'Weekly',
      makeupCreditsAvailable: 2,
      makeupCreditsBooked: 1,
      makeupCreditsUsed: 3,
      attendanceRate: 95,
      upcomingLesson: 'Today, 3:00 PM',
      recentLesson: 'March 11, 2026',
      parentName: 'Jennifer Thompson',
      status: 'active',
      notes: 'Working on Chopin Nocturne. Excellent progress.'
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: 'M',
      instrument: 'Piano',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 234-5678',
      location: 'Los Angeles, CA',
      timezone: 'PST (UTC-8)',
      lessonDuration: '45 min',
      lessonFrequency: 'Weekly',
      makeupCreditsAvailable: 1,
      makeupCreditsBooked: 0,
      makeupCreditsUsed: 2,
      attendanceRate: 88,
      upcomingLesson: 'Tomorrow, 4:00 PM',
      recentLesson: 'March 10, 2026',
      status: 'active'
    },
    {
      id: 3,
      name: 'Sophia Martinez',
      avatar: 'S',
      instrument: 'Piano',
      email: 'sophia.martinez@email.com',
      phone: '+1 (555) 345-6789',
      location: 'Austin, TX',
      timezone: 'CST (UTC-6)',
      lessonDuration: '30 min',
      lessonFrequency: 'Weekly',
      makeupCreditsAvailable: 0,
      makeupCreditsBooked: 0,
      makeupCreditsUsed: 1,
      attendanceRate: 72,
      upcomingLesson: 'March 20, 2026, 5:00 PM',
      recentLesson: 'March 6, 2026',
      parentName: 'Maria Martinez',
      status: 'attendance-risk',
      notes: 'Parent requested follow-up about practice schedule.'
    },
    {
      id: 4,
      name: 'David Wilson',
      avatar: 'D',
      instrument: 'Piano',
      email: 'david.wilson@email.com',
      phone: '+1 (555) 456-7890',
      location: 'Seattle, WA',
      timezone: 'PST (UTC-8)',
      lessonDuration: '60 min',
      lessonFrequency: 'Bi-weekly',
      makeupCreditsAvailable: 3,
      makeupCreditsBooked: 0,
      makeupCreditsUsed: 0,
      attendanceRate: 100,
      upcomingLesson: 'March 22, 2026, 2:00 PM',
      recentLesson: 'March 8, 2026',
      status: 'active'
    },
    {
      id: 5,
      name: 'Olivia Brown (Trial)',
      avatar: 'O',
      instrument: 'Piano',
      email: 'olivia.brown@email.com',
      phone: '+1 (555) 567-8901',
      location: 'Portland, OR',
      timezone: 'PST (UTC-8)',
      lessonDuration: '30 min',
      lessonFrequency: 'Trial',
      makeupCreditsAvailable: 0,
      makeupCreditsBooked: 0,
      makeupCreditsUsed: 0,
      attendanceRate: 100,
      upcomingLesson: 'March 19, 2026, 10:00 AM',
      recentLesson: 'March 12, 2026',
      parentName: 'Sarah Brown',
      status: 'trial',
      notes: 'Trial student - 3rd lesson coming up. Show interest in continuing.'
    },
    {
      id: 6,
      name: 'Ethan Davis',
      avatar: 'E',
      instrument: 'Piano',
      email: 'ethan.davis@email.com',
      phone: '+1 (555) 678-9012',
      location: 'Denver, CO',
      timezone: 'MST (UTC-7)',
      lessonDuration: '45 min',
      lessonFrequency: 'Weekly',
      makeupCreditsAvailable: 1,
      makeupCreditsBooked: 1,
      makeupCreditsUsed: 4,
      attendanceRate: 82,
      upcomingLesson: 'Today, 6:00 PM',
      recentLesson: 'March 11, 2026',
      status: 'needs-followup',
      notes: 'Needs encouragement with scale practice.'
    }
  ];

  const filteredStudents = students.filter(student => {
    if (searchQuery && !student.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && student.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const activeStudents = students.filter(s => s.status === 'active').length;
  const lessonsToday = students.filter(s => s.upcomingLesson.includes('Today')).length;
  const avgAttendance = Math.round(students.reduce((sum, s) => sum + s.attendanceRate, 0) / students.length);
  const totalMakeupCredits = students.reduce((sum, s) => sum + s.makeupCreditsAvailable, 0);
  const needsFollowup = students.filter(s => s.status === 'needs-followup' || s.status === 'attendance-risk').length;

  const getStatusBadge = (status: Student['status']) => {
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

  return (
    <div className="bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Students</h1>
          <p className="text-sm md:text-base text-gray-600">Manage your students and track their progress</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              <h3 className="text-xs md:text-sm font-medium text-gray-600">Active Students</h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">{activeStudents}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <Calendar className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              <h3 className="text-xs md:text-sm font-medium text-gray-600">Lessons Today</h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">{lessonsToday}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
              <h3 className="text-xs md:text-sm font-medium text-gray-600">Attendance Rate</h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">{avgAttendance}%</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
              <h3 className="text-xs md:text-sm font-medium text-gray-600">Makeup Credits</h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">{totalMakeupCredits}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
              <h3 className="text-xs md:text-sm font-medium text-gray-600">Needs Follow-Up</h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">{needsFollowup}</p>
          </div>
        </div>

        {/* Search and Filters */}
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
              { id: 'all', label: 'All Students' },
              { id: 'active', label: 'Active' },
              { id: 'trial', label: 'Trial' },
              { id: 'needs-followup', label: 'Needs Follow-Up' },
              { id: 'attendance-risk', label: 'Attendance Risk' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setStatusFilter(filter.id as any)}
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

        {/* Students List */}
        <div className="space-y-4">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {student.avatar}
                </div>

                {/* Main Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{student.name}</h3>
                        {getStatusBadge(student.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{student.instrument} • {student.lessonDuration} • {student.lessonFrequency}</p>
                      {student.parentName && (
                        <p className="text-sm text-gray-500">Parent: {student.parentName}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact & Location Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{student.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{student.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{student.location}</span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-green-700 font-medium mb-1">Attendance</p>
                      <p className="text-lg font-bold text-green-900">{student.attendanceRate}%</p>
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

                  {/* Notes */}
                  {student.notes && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-blue-900">
                        <strong>Notes:</strong> {student.notes}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      <Mail className="w-4 h-4" />
                      Message
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                      <Calendar className="w-4 h-4" />
                      View Attendance
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                      <FileText className="w-4 h-4" />
                      View Notes
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                      <Send className="w-4 h-4" />
                      Assign Resource
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredStudents.length === 0 && (
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