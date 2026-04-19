import { Search, FileText, Music, Book, Download, Star, Calendar } from 'lucide-react';
import { useState } from 'react';

interface Resource {
  id: number;
  title: string;
  type: 'repertoire' | 'theory' | 'practice-instructions' | 'teacher-notes';
  uploadedBy: string;
  uploadedDate: string;
  category: string;
  isAssigned: boolean;
  fileType: string;
}

export function ParentResourcesView() {
  const [activeTab, setActiveTab] = useState<'all' | 'assigned' | 'repertoire' | 'theory' | 'instructions'>('assigned');

  const resources: Resource[] = [
    {
      id: 1,
      title: 'Practice Instructions - This Week',
      type: 'practice-instructions',
      uploadedBy: 'Sarah Johnson',
      uploadedDate: '2 days ago',
      category: 'Practice Instructions',
      isAssigned: true,
      fileType: 'PDF'
    },
    {
      id: 2,
      title: 'Chopin - Nocturne (Emma\'s Current Piece)',
      type: 'repertoire',
      uploadedBy: 'Sarah Johnson',
      uploadedDate: '1 week ago',
      category: 'Repertoire',
      isAssigned: true,
      fileType: 'PDF'
    },
    {
      id: 3,
      title: 'Teacher Notes - Supporting Emma\'s Practice',
      type: 'teacher-notes',
      uploadedBy: 'Sarah Johnson',
      uploadedDate: '3 days ago',
      category: 'Teacher Notes',
      isAssigned: true,
      fileType: 'PDF'
    },
    {
      id: 4,
      title: 'Music Theory - Chord Progressions Guide',
      type: 'theory',
      uploadedBy: 'Sarah Johnson',
      uploadedDate: '1 week ago',
      category: 'Theory Notes',
      isAssigned: false,
      fileType: 'PDF'
    },
    {
      id: 5,
      title: 'Scale Practice Guide for Parents',
      type: 'practice-instructions',
      uploadedBy: 'Sarah Johnson',
      uploadedDate: '2 weeks ago',
      category: 'Practice Instructions',
      isAssigned: false,
      fileType: 'PDF'
    },
    {
      id: 6,
      title: 'Beethoven - Moonlight Sonata',
      type: 'repertoire',
      uploadedBy: 'Sarah Johnson',
      uploadedDate: '3 weeks ago',
      category: 'Repertoire',
      isAssigned: false,
      fileType: 'PDF'
    }
  ];

  const filteredResources = resources.filter(resource => {
    if (activeTab === 'all') return true;
    if (activeTab === 'assigned') return resource.isAssigned;
    if (activeTab === 'repertoire') return resource.type === 'repertoire';
    if (activeTab === 'theory') return resource.type === 'theory';
    if (activeTab === 'instructions') return resource.type === 'practice-instructions' || resource.type === 'teacher-notes';
    return true;
  });

  const assignedCount = resources.filter(r => r.isAssigned).length;

  return (
    <div className="bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
              E
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Emma's Resources</h1>
          </div>
          <p className="text-gray-600">Support Emma's learning with lesson materials and practice guides</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-blue-900">This Week</h3>
            </div>
            <p className="text-3xl font-bold text-blue-900">{assignedCount}</p>
            <p className="text-sm text-blue-700">Assigned materials</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <Music className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold text-purple-900">Current Piece</h3>
            </div>
            <p className="text-lg font-bold text-purple-900">Chopin Nocturne</p>
            <p className="text-sm text-purple-700">In progress</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-6 h-6 text-amber-600" />
              <h3 className="font-semibold text-amber-900">Teacher</h3>
            </div>
            <p className="text-lg font-bold text-amber-900">Sarah Johnson</p>
            <p className="text-sm text-amber-700">Piano Teacher</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'assigned', label: `Assigned This Week (${assignedCount})`, badge: assignedCount },
              { id: 'all', label: 'All Resources' },
              { id: 'repertoire', label: 'Repertoire' },
              { id: 'theory', label: 'Theory Notes' },
              { id: 'instructions', label: 'Practice Guides' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
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
                  resource.type === 'practice-instructions' ? 'bg-green-100' :
                  'bg-amber-100'
                }`}>
                  {resource.type === 'repertoire' ? <Music className="w-7 h-7 text-purple-600" /> :
                   resource.type === 'theory' ? <Book className="w-7 h-7 text-blue-600" /> :
                   <FileText className="w-7 h-7 text-green-600" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{resource.title}</h3>
                        {resource.isAssigned && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            This Week
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{resource.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span>Uploaded by {resource.uploadedBy}</span>
                    <span>•</span>
                    <span>{resource.uploadedDate}</span>
                    <span>•</span>
                    <span className="font-medium">{resource.fileType}</span>
                  </div>

                  {resource.type === 'practice-instructions' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-green-800">
                        <strong>For Parents:</strong> This guide will help you support Emma's practice at home. Review before practice sessions.
                      </p>
                    </div>
                  )}

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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources in this category</h3>
            <p className="text-gray-600">Check other tabs for more materials</p>
          </div>
        )}
      </div>
    </div>
  );
}
