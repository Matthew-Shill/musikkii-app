import { Search, Upload, Music, FileText, Book, Headphones, Star, Download, Send, Filter } from 'lucide-react';
import { useState } from 'react';

interface Resource {
  id: number;
  title: string;
  instrument: 'piano' | 'guitar' | 'bass' | 'voice';
  category: 'repertoire' | 'theory' | 'exercises' | 'technique' | 'warmups' | 'sight-reading' | 'ear-training' | 'lesson-plans' | 'worksheets' | 'recordings';
  level: string;
  uploadedDate: string;
  isFavorite: boolean;
  fileType: string;
}

export function TeacherResourcesView() {
  const [activeInstrument, setActiveInstrument] = useState<'all' | 'piano' | 'guitar' | 'bass' | 'voice'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const instruments = [
    { id: 'all', label: 'All Instruments', emoji: '🎵' },
    { id: 'piano', label: 'Piano', emoji: '🎹' },
    { id: 'guitar', label: 'Guitar', emoji: '🎸' },
    { id: 'bass', label: 'Bass', emoji: '🎸' },
    { id: 'voice', label: 'Voice', emoji: '🎤' }
  ];

  const categories = [
    { id: 'all', label: 'All Categories', icon: Filter },
    { id: 'repertoire', label: 'Repertoire', icon: Music },
    { id: 'theory', label: 'Theory', icon: Book },
    { id: 'exercises', label: 'Exercises', icon: FileText },
    { id: 'technique', label: 'Technique', icon: FileText },
    { id: 'warmups', label: 'Warmups', icon: FileText },
    { id: 'sight-reading', label: 'Sight Reading', icon: Book },
    { id: 'ear-training', label: 'Ear Training', icon: Headphones },
    { id: 'lesson-plans', label: 'Lesson Plans', icon: FileText },
    { id: 'worksheets', label: 'Worksheets', icon: FileText },
    { id: 'recordings', label: 'Recordings/Demos', icon: Headphones }
  ];

  const resources: Resource[] = [
    {
      id: 1,
      title: 'Chopin - Nocturne in E-flat Major',
      instrument: 'piano',
      category: 'repertoire',
      level: 'Intermediate',
      uploadedDate: '2 days ago',
      isFavorite: true,
      fileType: 'PDF'
    },
    {
      id: 2,
      title: 'Major Scale Exercises - All Keys',
      instrument: 'piano',
      category: 'exercises',
      level: 'Beginner-Advanced',
      uploadedDate: '1 week ago',
      isFavorite: true,
      fileType: 'PDF'
    },
    {
      id: 3,
      title: 'Music Theory - Chord Construction',
      instrument: 'piano',
      category: 'theory',
      level: 'Intermediate',
      uploadedDate: '1 week ago',
      isFavorite: false,
      fileType: 'PDF'
    },
    {
      id: 4,
      title: 'Open Chord Practice - Beginner Guitar',
      instrument: 'guitar',
      category: 'exercises',
      level: 'Beginner',
      uploadedDate: '3 days ago',
      isFavorite: true,
      fileType: 'PDF'
    },
    {
      id: 5,
      title: 'Finger Independence Exercises',
      instrument: 'piano',
      category: 'technique',
      level: 'Intermediate',
      uploadedDate: '1 week ago',
      isFavorite: false,
      fileType: 'PDF'
    },
    {
      id: 6,
      title: 'Sight Reading - Level 3',
      instrument: 'piano',
      category: 'sight-reading',
      level: 'Intermediate',
      uploadedDate: '2 weeks ago',
      isFavorite: false,
      fileType: 'PDF'
    },
    {
      id: 7,
      title: 'Vocal Warmup Routine',
      instrument: 'voice',
      category: 'warmups',
      level: 'All Levels',
      uploadedDate: '5 days ago',
      isFavorite: true,
      fileType: 'PDF'
    },
    {
      id: 8,
      title: 'Bass Line Construction Workshop',
      instrument: 'bass',
      category: 'lesson-plans',
      level: 'Intermediate',
      uploadedDate: '1 week ago',
      isFavorite: false,
      fileType: 'PDF'
    },
    {
      id: 9,
      title: 'Hanon Exercises - Complete',
      instrument: 'piano',
      category: 'technique',
      level: 'All Levels',
      uploadedDate: '3 weeks ago',
      isFavorite: true,
      fileType: 'PDF'
    },
    {
      id: 10,
      title: 'Strumming Patterns Worksheet',
      instrument: 'guitar',
      category: 'worksheets',
      level: 'Beginner',
      uploadedDate: '4 days ago',
      isFavorite: false,
      fileType: 'PDF'
    },
    {
      id: 11,
      title: 'Interval Recognition Training',
      instrument: 'voice',
      category: 'ear-training',
      level: 'Intermediate',
      uploadedDate: '1 week ago',
      isFavorite: false,
      fileType: 'PDF'
    },
    {
      id: 12,
      title: 'Beethoven Sonata Demo Recording',
      instrument: 'piano',
      category: 'recordings',
      level: 'Advanced',
      uploadedDate: '2 days ago',
      isFavorite: false,
      fileType: 'MP3'
    }
  ];

  const filteredResources = resources.filter(resource => {
    if (searchQuery && !resource.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeInstrument !== 'all' && resource.instrument !== activeInstrument) {
      return false;
    }
    if (activeCategory !== 'all' && resource.category !== activeCategory) {
      return false;
    }
    return true;
  });

  const favoriteResources = resources.filter(r => r.isFavorite);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'repertoire':
        return 'from-purple-400 to-pink-500';
      case 'theory':
        return 'from-blue-400 to-cyan-500';
      case 'exercises':
      case 'technique':
      case 'warmups':
        return 'from-green-400 to-emerald-500';
      case 'sight-reading':
      case 'ear-training':
        return 'from-amber-400 to-orange-500';
      case 'lesson-plans':
      case 'worksheets':
        return 'from-indigo-400 to-purple-500';
      case 'recordings':
        return 'from-red-400 to-pink-500';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Teaching Resource Library</h1>
          <p className="text-gray-600">Comprehensive materials organized by instrument and category</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm">
            <Upload className="w-5 h-5" />
            Upload New Resource
          </button>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Total Resources</p>
            <p className="text-2xl font-bold text-gray-900">{resources.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Favorites</p>
            <p className="text-2xl font-bold text-amber-600">{favoriteResources.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Instruments</p>
            <p className="text-2xl font-bold text-purple-600">4</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search resources by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Instrument Filter */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Filter by Instrument</p>
            <div className="flex flex-wrap gap-2">
              {instruments.map((instrument) => (
                <button
                  key={instrument.id}
                  onClick={() => setActiveInstrument(instrument.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeInstrument === instrument.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-lg">{instrument.emoji}</span>
                  {instrument.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Filter by Category</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {activeInstrument === 'all' ? 'All Resources' : `${instruments.find(i => i.id === activeInstrument)?.label} Resources`}
              {activeCategory !== 'all' && ` - ${categories.find(c => c.id === activeCategory)?.label}`}
              <span className="ml-2 text-gray-500">({filteredResources.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => {
              const CategoryIcon = categories.find(c => c.id === resource.category)?.icon || FileText;
              return (
                <div
                  key={resource.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getCategoryColor(resource.category)} flex items-center justify-center`}>
                      <CategoryIcon className="w-6 h-6 text-white" />
                    </div>
                    <button className="text-gray-400 hover:text-amber-500 transition-colors">
                      <Star className={`w-5 h-5 ${resource.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
                  
                  <div className="flex gap-2 mb-3">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
                      {resource.instrument}
                    </span>
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      {resource.level}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{categories.find(c => c.id === resource.category)?.label}</p>

                  <div className="text-xs text-gray-500 mb-4">
                    Uploaded {resource.uploadedDate}
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      <Send className="w-4 h-4" />
                      Assign
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query</p>
          </div>
        )}

        {/* Favorites Section */}
        {activeInstrument === 'all' && activeCategory === 'all' && !searchQuery && (
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
              <h2 className="text-2xl font-semibold text-gray-900">Frequently Used Resources</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {favoriteResources.slice(0, 4).map((resource) => (
                <div key={resource.id} className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
                  <p className="text-xs text-gray-600 capitalize">{resource.instrument} • {resource.category}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
