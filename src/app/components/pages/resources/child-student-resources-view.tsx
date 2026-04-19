import { Music, FileText, Headphones, Star, Play, Download } from 'lucide-react';
import { useState } from 'react';

interface Resource {
  id: number;
  title: string;
  type: 'song' | 'practice' | 'warmup' | 'listening';
  emoji: string;
  teacher: string;
  isFavorite: boolean;
}

export function ChildStudentResourcesView() {
  const [activeTab, setActiveTab] = useState<'all' | 'songs' | 'practice' | 'listening'>('all');

  const resources: Resource[] = [
    {
      id: 1,
      title: 'Twinkle Twinkle Little Star',
      type: 'song',
      emoji: '⭐',
      teacher: 'Ms. Sarah',
      isFavorite: true
    },
    {
      id: 2,
      title: 'Practice Your Scales',
      type: 'practice',
      emoji: '🎵',
      teacher: 'Ms. Sarah',
      isFavorite: false
    },
    {
      id: 3,
      title: 'Morning Warmup Song',
      type: 'warmup',
      emoji: '☀️',
      teacher: 'Ms. Sarah',
      isFavorite: false
    },
    {
      id: 4,
      title: 'Listen: Happy Birthday',
      type: 'listening',
      emoji: '🎂',
      teacher: 'Ms. Sarah',
      isFavorite: true
    },
    {
      id: 5,
      title: 'Mary Had a Little Lamb',
      type: 'song',
      emoji: '🐑',
      teacher: 'Ms. Sarah',
      isFavorite: true
    },
    {
      id: 6,
      title: 'Finger Exercise Fun',
      type: 'practice',
      emoji: '✋',
      teacher: 'Ms. Sarah',
      isFavorite: false
    }
  ];

  const filteredResources = resources.filter(resource => {
    if (activeTab === 'all') return true;
    if (activeTab === 'songs') return resource.type === 'song';
    if (activeTab === 'practice') return resource.type === 'practice' || resource.type === 'warmup';
    if (activeTab === 'listening') return resource.type === 'listening';
    return true;
  });

  const getCardColor = (type: string) => {
    switch (type) {
      case 'song':
        return 'from-purple-100 to-pink-100 border-purple-200';
      case 'practice':
      case 'warmup':
        return 'from-blue-100 to-cyan-100 border-blue-200';
      case 'listening':
        return 'from-amber-100 to-yellow-100 border-amber-200';
      default:
        return 'from-gray-100 to-gray-200 border-gray-200';
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Music Stuff! 🎵</h1>
          <p className="text-lg text-gray-700">All your songs and practice pages</p>
        </div>

        {/* Category Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'all', label: 'All', emoji: '📚' },
              { id: 'songs', label: 'My Songs', emoji: '🎹' },
              { id: 'practice', label: 'Practice Pages', emoji: '📝' },
              { id: 'listening', label: 'Listening', emoji: '🎧' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-2xl">{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className={`bg-gradient-to-br ${getCardColor(resource.type)} rounded-2xl shadow-lg border-2 p-6 hover:shadow-xl transition-all hover:scale-[1.02]`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-6xl">{resource.emoji}</div>
                <button className="text-amber-400 hover:text-amber-500 transition-colors">
                  <Star className={`w-8 h-8 ${resource.isFavorite ? 'fill-amber-400' : ''}`} />
                </button>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">{resource.title}</h3>
              
              <p className="text-sm text-gray-700 mb-4">From {resource.teacher}</p>

              <div className="flex gap-3">
                {resource.type === 'listening' ? (
                  <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-md">
                    <Play className="w-5 h-5" />
                    Listen
                  </button>
                ) : (
                  <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-md">
                    <Download className="w-5 h-5" />
                    Open
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Favorites Section */}
        {activeTab === 'all' && (
          <div className="mt-12 bg-white rounded-2xl shadow-lg border-2 border-amber-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
              <h2 className="text-2xl font-bold text-gray-900">My Favorites</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {resources.filter(r => r.isFavorite).map((resource) => (
                <div key={resource.id} className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="text-3xl">{resource.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">{resource.title}</p>
                    <p className="text-xs text-gray-600">From {resource.teacher}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
