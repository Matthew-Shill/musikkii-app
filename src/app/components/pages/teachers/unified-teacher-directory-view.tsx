import { Search, Star, Play, RefreshCw, MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface Teacher {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  bio: string;
  instruments: string[];
  specialties: string[];
  languages: string[];
  experience: string;
  hasVideo: boolean;
  isMyTeacher?: boolean;
  assignedTo?: string[];
}

export function UnifiedTeacherDirectoryView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [instrumentFilter, setInstrumentFilter] = useState<string>('all');

  const teachers: Teacher[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'SJ',
      rating: 4.9,
      reviewCount: 127,
      bio: 'Passionate piano teacher with 15 years of experience. Specializing in classical and contemporary styles for all ages. Known for patient teaching style and ability to make complex concepts accessible.',
      instruments: ['Piano'],
      specialties: ['Classical', 'Contemporary', 'Beginner-Friendly', 'Advanced Theory', 'Kids'],
      languages: ['English', 'Spanish'],
      experience: '15 years',
      hasVideo: true,
      isMyTeacher: true,
      assignedTo: ['Emma', 'Sophia']
    },
    {
      id: 2,
      name: 'Michael Davis',
      avatar: 'MD',
      rating: 4.8,
      reviewCount: 98,
      bio: 'Professional guitarist and music educator with a passion for rock, blues, and contemporary styles. Energetic teaching approach that helps students discover their unique musical voice.',
      instruments: ['Guitar', 'Bass'],
      specialties: ['Rock', 'Blues', 'Pop', 'Beginner-Friendly', 'Kids'],
      languages: ['English'],
      experience: '12 years',
      hasVideo: true,
      isMyTeacher: true,
      assignedTo: ['Liam']
    },
    {
      id: 3,
      name: 'Katie Wilson',
      avatar: 'KW',
      rating: 5.0,
      reviewCount: 143,
      bio: 'Suzuki-certified violin instructor with a warm, encouraging teaching style. Specializes in young learners and building strong foundational technique with confidence and joy.',
      instruments: ['Violin'],
      specialties: ['Suzuki Method', 'Classical', 'Kids', 'Beginner-Friendly'],
      languages: ['English', 'French'],
      experience: '18 years',
      hasVideo: true
    },
    {
      id: 4,
      name: 'David Chen',
      avatar: 'DC',
      rating: 4.7,
      reviewCount: 76,
      bio: 'Piano and music theory specialist with a structured, methodical approach. Perfect for students seeking deeper understanding of music theory alongside performance skills.',
      instruments: ['Piano'],
      specialties: ['Music Theory', 'Classical', 'Advanced', 'Adults'],
      languages: ['English', 'Mandarin'],
      experience: '10 years',
      hasVideo: true
    },
    {
      id: 5,
      name: 'Emma Rodriguez',
      avatar: 'ER',
      rating: 4.9,
      reviewCount: 112,
      bio: 'Voice teacher and vocal coach specializing in contemporary and musical theater styles. Fun, encouraging approach that builds confidence in performers of all ages.',
      instruments: ['Voice'],
      specialties: ['Contemporary', 'Musical Theater', 'Pop', 'Kids', 'Adults'],
      languages: ['English', 'Spanish'],
      experience: '14 years',
      hasVideo: true
    },
    {
      id: 6,
      name: 'James Thompson',
      avatar: 'JT',
      rating: 4.8,
      reviewCount: 89,
      bio: 'Bass and guitar instructor focusing on jazz, funk, and improvisation. Great for students interested in contemporary styles and developing their creative voice.',
      instruments: ['Bass', 'Guitar'],
      specialties: ['Jazz', 'Funk', 'Improvisation', 'Adults', 'Teens'],
      languages: ['English'],
      experience: '16 years',
      hasVideo: true
    },
    {
      id: 7,
      name: 'Rachel Kim',
      avatar: 'RK',
      rating: 4.9,
      reviewCount: 134,
      bio: 'Drum instructor with infectious enthusiasm and a talent for making rhythm accessible and fun. Specializes in rock, pop, and jazz styles for all skill levels.',
      instruments: ['Drums'],
      specialties: ['Rock', 'Pop', 'Jazz', 'Kids', 'Beginner-Friendly'],
      languages: ['English', 'Korean'],
      experience: '11 years',
      hasVideo: true
    },
    {
      id: 8,
      name: 'Thomas Martinez',
      avatar: 'TM',
      rating: 4.7,
      reviewCount: 91,
      bio: 'Classical guitar and ukulele teacher with a gentle, patient approach. Excellent at building confidence in beginners and creating a supportive learning environment.',
      instruments: ['Guitar', 'Ukulele'],
      specialties: ['Classical', 'Folk', 'Beginner-Friendly', 'Kids'],
      languages: ['English', 'Spanish'],
      experience: '9 years',
      hasVideo: true
    }
  ];

  const allInstruments = ['all', ...Array.from(new Set(teachers.flatMap(t => t.instruments)))];
  const myTeachers = teachers.filter(t => t.isMyTeacher);
  const otherTeachers = teachers.filter(t => !t.isMyTeacher);

  const filteredTeachers = otherTeachers.filter(teacher => {
    if (searchQuery && !teacher.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (instrumentFilter !== 'all' && !teacher.instruments.includes(instrumentFilter)) {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Our Teachers</h1>
          <p className="text-sm md:text-base text-gray-600">Discover talented instructors and find your perfect fit</p>
        </div>

        {/* Current Teacher(s) Section */}
        {myTeachers.length > 0 && (
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Your Current Teacher{myTeachers.length > 1 ? 's' : ''}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {myTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-300 p-4 md:p-6"
                >
                  <div className="flex items-start gap-3 md:gap-4 mb-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-xl md:text-2xl flex-shrink-0">
                      {teacher.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 md:px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-medium">
                          Your Teacher
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 truncate">{teacher.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-gray-900 text-sm md:text-base">{teacher.rating}</span>
                        </div>
                        <span className="text-xs md:text-sm text-gray-600">({teacher.reviewCount} reviews)</span>
                      </div>
                      <p className="text-xs md:text-sm text-gray-700">{teacher.instruments.join(', ')} • {teacher.experience} experience</p>
                    </div>
                  </div>

                  {/* Assigned To Tags */}
                  {teacher.assignedTo && teacher.assignedTo.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {teacher.assignedTo.map((student) => (
                        <span key={student} className="px-2 md:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          Teaching {student}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions for Current Teacher */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm md:text-base">
                      <MessageSquare className="w-4 h-4" />
                      Message
                    </button>
                    {teacher.hasVideo && (
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm md:text-base">
                        <Play className="w-4 h-4" />
                        Watch Video
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6 md:mb-8">
          <div className="mb-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search teachers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              />
            </div>
          </div>

          <div>
            <p className="text-xs md:text-sm font-medium text-gray-700 mb-3">Filter by Instrument</p>
            <div className="flex flex-wrap gap-2">
              {allInstruments.map((instrument) => (
                <button
                  key={instrument}
                  onClick={() => setInstrumentFilter(instrument)}
                  className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-sm font-medium transition-colors ${
                    instrumentFilter === instrument
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {instrument === 'all' ? 'All Instruments' : instrument}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* All Available Teachers */}
        <div className="mb-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">All Available Teachers</h2>
          <p className="text-sm md:text-base text-gray-600">Browse our full roster and request a teacher change</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Avatar and Basic Info */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {teacher.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{teacher.name}</h3>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-gray-900">{teacher.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({teacher.reviewCount})</span>
                  </div>
                  <p className="text-sm text-gray-600">{teacher.experience}</p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-gray-700 mb-4 line-clamp-3">{teacher.bio}</p>

              {/* Instruments */}
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-600 mb-2">Instruments</p>
                <div className="flex flex-wrap gap-2">
                  {teacher.instruments.map((instrument) => (
                    <span key={instrument} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      {instrument}
                    </span>
                  ))}
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-600 mb-2">Specialties</p>
                <div className="flex flex-wrap gap-2">
                  {teacher.specialties.slice(0, 4).map((specialty) => (
                    <span key={specialty} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {specialty}
                    </span>
                  ))}
                  {teacher.specialties.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      +{teacher.specialties.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Languages */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-600">
                  Languages: <span className="font-normal text-gray-700">{teacher.languages.join(', ')}</span>
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                {teacher.hasVideo && (
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                    <Play className="w-4 h-4" />
                    Watch Video
                  </button>
                )}
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  Request This Teacher
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTeachers.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No teachers found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}