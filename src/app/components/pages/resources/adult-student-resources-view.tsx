import { Search, FileText, Music, Book, Headphones, Star, Download, Play, Filter } from 'lucide-react';
import { useState } from 'react';

interface Resource {
  id: number;
  title: string;
  type: 'repertoire' | 'theory' | 'exercise' | 'recording' | 'sheet-music';
  uploadedBy: string;
  uploadedDate: string;
  category: string;
  isFavorite: boolean;
  fileType: string;
}

export function AdultStudentResourcesView() {
  const [activeTab, setActiveTab] = useState<'all' | 'assigned' | 'repertoire' | 'theory' | 'exercises' | 'recordings'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const resources: Resource[] = [
    {
      id: 1,
      title: 'Chopin - Nocturne in E-flat Major',
      type: 'sheet-music',
      uploadedBy: 'Sarah Johnson',
      uploadedDate: '2 days ago',
      category: 'Repertoire',
      isFavorite: true,
      fileType: 'PDF'
    },
    {
      id: 2,
      title: 'Scale Practice - Major Scales',
      type: 'exercise',
      uploadedBy: 'Sarah Johnson',
      uploadedDate: '1 week ago',
      category: 'Exercises',
      isFavorite: false,
      fileType: 'PDF'
    },
    {
      id: 3,
      title: 'Music Theory - Chord Progressions',
      type: 'theory',
      uploadedBy: 'Sarah Johnson',
      uploadedDate: '1 week ago',
      category: 'Theory',
      isFavorite: true,
      fileType: 'PDF'
    },
    {
      id: 4,
      title: 'Nocturne Reference Performance',
      type: 'recording',
      uploadedBy: 'Sarah Johnson',
      uploadedDate: '2 days ago',
      category: 'Recordings',
      isFavorite: false,
      fileType: 'MP3'
    },
    {
      id: 5,
      title: 'Hanon Exercises - No. 1-5',
      type: 'exercise',
      uploadedBy: 'Sarah Johnson',
      uploadedDate: '2 weeks ago',
      category: 'Exercises',
      isFavorite: false,
      fileType: 'PDF'
    },
    {
      id: 6,
      title: 'Beethoven - Moonlight Sonata (Movement 1)',
      type: 'repertoire',
      uploadedBy: 'Sarah Johnson',
      uploadedDate: '3 weeks ago',
      category: 'Repertoire',
      isFavorite: true,
      fileType: 'PDF'
    }
  ];

  const filteredResources = resources.filter(resource => {
    if (searchQuery && !resource.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeTab === 'all') return true;
    if (activeTab === 'assigned') return ['Chopin - Nocturne in E-flat Major', 'Scale Practice - Major Scales', 'Music Theory - Chord Progressions'].includes(resource.title);
    if (activeTab === 'repertoire') return resource.type === 'repertoire' || resource.type === 'sheet-music';
    if (activeTab === 'theory') return resource.type === 'theory';
    if (activeTab === 'exercises') return resource.type === 'exercise';
    if (activeTab === 'recordings') return resource.type === 'recording';
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sheet-music':
      case 'repertoire':
        return Music;
      case 'theory':
        return Book;
      case 'exercise':
        return FileText;
      case 'recording':
        return Headphones;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sheet-music':
      case 'repertoire':
        return 'from-purple-400 to-pink-500';
      case 'theory':
        return 'from-blue-400 to-cyan-500';
      case 'exercise':
        return 'from-green-400 to-emerald-500';
      case 'recording':
        return 'from-amber-400 to-orange-500';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Resources</h1>
          <p className="text-gray-600">Access your lesson materials, sheet music, and recordings</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex gap-4 items-center mb-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Resources', icon: Filter },
              { id: 'assigned', label: 'Assigned This Week', icon: Star },
              { id: 'repertoire', label: 'Repertoire', icon: Music },
              { id: 'theory', label: 'Theory', icon: Book },
              { id: 'exercises', label: 'Exercises', icon: FileText },
              { id: 'recordings', label: 'Recordings', icon: Headphones }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const TypeIcon = getTypeIcon(resource.type);
            return (
              <div
                key={resource.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getTypeColor(resource.type)} flex items-center justify-center`}>
                    <TypeIcon className="w-6 h-6 text-white" />
                  </div>
                  <button className="text-gray-400 hover:text-amber-500 transition-colors">
                    <Star className={`w-5 h-5 ${resource.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
                
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {resource.category}
                  </span>
                </div>

                <div className="mb-4 text-sm text-gray-500">
                  <p>Uploaded by {resource.uploadedBy}</p>
                  <p>{resource.uploadedDate}</p>
                </div>

                <div className="flex gap-2">
                  {resource.type === 'recording' ? (
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      <Play className="w-4 h-4" />
                      Play
                    </button>
                  ) : (
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
