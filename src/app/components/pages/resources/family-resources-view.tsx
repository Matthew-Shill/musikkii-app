import { Search, FileText, Music, Book, Download, Filter } from 'lucide-react';
import { useState } from 'react';

interface Resource {
  id: number;
  title: string;
  type: 'repertoire' | 'theory' | 'practice-instructions' | 'teacher-notes';
  uploadedBy: string;
  uploadedDate: string;
  childId: number;
  childName: string;
  childInitial: string;
  childColor: string;
  isAssigned: boolean;
}

export function FamilyResourcesView() {
  const [childFilter, setChildFilter] = useState<'all' | number>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'assigned' | 'repertoire' | 'theory' | 'instructions'>('all');

  const children = [
    { id: 1, name: 'Emma', initial: 'E', color: 'from-purple-400 to-pink-500', instrument: 'Piano' },
    { id: 2, name: 'Oliver', initial: 'O', color: 'from-blue-400 to-cyan-500', instrument: 'Guitar' },
    { id: 3, name: 'Sophia', initial: 'S', color: 'from-green-400 to-emerald-500', instrument: 'Violin' }
  ];

  const resources: Resource[] = [
    {
      id: 1,
      title: 'Chopin - Nocturne in E-flat Major',
      type: 'repertoire',
      uploadedBy: 'Sarah Johnson',
      uploadedDate: '2 days ago',
      childId: 1,
      childName: 'Emma',
      childInitial: 'E',
      childColor: 'from-purple-400 to-pink-500',
      isAssigned: true
    },
    {
      id: 2,
      title: 'Guitar Chord Progressions',
      type: 'theory',
      uploadedBy: 'Michael Davis',
      uploadedDate: '1 day ago',
      childId: 2,
      childName: 'Oliver',
      childInitial: 'O',
      childColor: 'from-blue-400 to-cyan-500',
      isAssigned: true
    },
    {
      id: 3,
      title: 'Violin Practice Guide - Week 12',
      type: 'practice-instructions',
      uploadedBy: 'Katie Wilson',
      uploadedDate: '3 days ago',
      childId: 3,
      childName: 'Sophia',
      childInitial: 'S',
      childColor: 'from-green-400 to-emerald-500',
      isAssigned: true
    },
    {
      id: 4,
      title: 'Scale Practice - Major Scales',
      type: 'practice-instructions',
      uploadedBy: 'Sarah Johnson',
      uploadedDate: '1 week ago',
      childId: 1,
      childName: 'Emma',
      childInitial: 'E',
      childColor: 'from-purple-400 to-pink-500',
      isAssigned: false
    },
    {
      id: 5,
      title: 'Suzuki Book 2 - Minuet',
      type: 'repertoire',
      uploadedBy: 'Katie Wilson',
      uploadedDate: '5 days ago',
      childId: 3,
      childName: 'Sophia',
      childInitial: 'S',
      childColor: 'from-green-400 to-emerald-500',
      isAssigned: true
    },
    {
      id: 6,
      title: 'Strumming Patterns Practice',
      type: 'practice-instructions',
      uploadedBy: 'Michael Davis',
      uploadedDate: '1 week ago',
      childId: 2,
      childName: 'Oliver',
      childInitial: 'O',
      childColor: 'from-blue-400 to-cyan-500',
      isAssigned: false
    }
  ];

  const filteredResources = resources.filter(resource => {
    if (childFilter !== 'all' && resource.childId !== childFilter) return false;
    if (typeFilter === 'assigned') return resource.isAssigned;
    if (typeFilter === 'repertoire') return resource.type === 'repertoire';
    if (typeFilter === 'theory') return resource.type === 'theory';
    if (typeFilter === 'instructions') return resource.type === 'practice-instructions' || resource.type === 'teacher-notes';
    return true;
  });

  const assignedByChild = children.map(child => ({
    ...child,
    assignedCount: resources.filter(r => r.childId === child.id && r.isAssigned).length
  }));

  return (
    <div className="bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Family Resources</h1>
          <p className="text-gray-600">Learning materials for all your children</p>
        </div>

        {/* Children Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {assignedByChild.map((child) => (
            <div key={child.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${child.color} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                  {child.initial}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{child.name}</h3>
                  <p className="text-sm text-gray-600">{child.instrument}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-gray-900">{child.assignedCount}</p>
                <p className="text-sm text-gray-600">Assigned this week</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Filter by Student</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setChildFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  childFilter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Students
              </button>
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setChildFilter(child.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    childFilter === child.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${child.color} flex items-center justify-center text-white text-xs font-bold`}>
                    {child.initial}
                  </div>
                  {child.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Filter by Type</p>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Resources' },
                { id: 'assigned', label: 'Assigned This Week' },
                { id: 'repertoire', label: 'Repertoire' },
                { id: 'theory', label: 'Theory' },
                { id: 'instructions', label: 'Practice Guides' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setTypeFilter(filter.id as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    typeFilter === filter.id ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resources List */}
        <div className="space-y-4">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow ${
                resource.isAssigned ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                  resource.type === 'repertoire' ? 'bg-purple-100' :
                  resource.type === 'theory' ? 'bg-blue-100' :
                  'bg-green-100'
                }`}>
                  {resource.type === 'repertoire' ? <Music className="w-7 h-7 text-purple-600" /> :
                   resource.type === 'theory' ? <Book className="w-7 h-7 text-blue-600" /> :
                   <FileText className="w-7 h-7 text-green-600" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-opacity-20 bg-purple-600 text-purple-700 border border-purple-200`}>
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${resource.childColor} flex items-center justify-center text-white text-xs font-bold`}>
                            {resource.childInitial}
                          </div>
                          {resource.childName}
                        </span>
                        {resource.isAssigned && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            Assigned This Week
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{resource.title}</h3>
                      <p className="text-sm text-gray-600">{resource.type === 'repertoire' ? 'Repertoire' : resource.type === 'theory' ? 'Theory Notes' : 'Practice Instructions'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span>Teacher: {resource.uploadedBy}</span>
                    <span>•</span>
                    <span>{resource.uploadedDate}</span>
                  </div>

                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
