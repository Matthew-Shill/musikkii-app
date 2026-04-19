import { Search, Paperclip, Send, MessageSquare, Filter, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface Message {
  id: number;
  from: string;
  avatar: string;
  role: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  category: string;
  hasAttachment?: boolean;
  content?: string;
}

interface UnifiedMessagesViewProps {
  categories: { id: string; label: string }[];
  messages: Message[];
}

export function UnifiedMessagesView({ categories, messages }: UnifiedMessagesViewProps) {
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  const filteredMessages = messages.filter((msg) => {
    const matchesCategory = activeCategory === 'all' || msg.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      msg.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.preview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const currentMessage = messages.find((m) => m.id === selectedMessage);

  const handleSelectMessage = (id: number) => {
    setSelectedMessage(id);
    setShowMobileDetail(true);
  };

  const handleBackToList = () => {
    setShowMobileDetail(false);
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Conversation List Sidebar */}
      <div className={`${showMobileDetail ? 'hidden' : 'flex'} md:flex w-full md:w-96 bg-white border-r border-gray-200 flex-col`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-semibold mb-4">Messages</h1>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message History List */}
        <div className="flex-1 overflow-y-auto">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                onClick={() => handleSelectMessage(message.id)}
                className={`p-4 border-b border-gray-200 cursor-pointer transition-colors active:bg-gray-100 ${
                  selectedMessage === message.id
                    ? 'bg-blue-50 border-l-4 border-l-blue-600'
                    : 'hover:bg-gray-50'
                } ${message.unread ? 'bg-blue-50/30' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {message.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-semibold truncate ${
                            message.unread ? 'text-gray-900' : 'text-gray-700'
                          }`}
                        >
                          {message.from}
                        </p>
                        <p className="text-xs text-gray-500">{message.role}</p>
                      </div>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {message.time}
                      </span>
                    </div>
                    <p
                      className={`text-sm mb-1 truncate ${
                        message.unread ? 'font-semibold text-gray-900' : 'text-gray-600'
                      }`}
                    >
                      {message.subject}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{message.preview}</p>
                    {message.hasAttachment && (
                      <div className="flex items-center gap-1 mt-2">
                        <Paperclip className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">Attachment</span>
                      </div>
                    )}
                  </div>
                  {message.unread && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">No messages found</p>
            </div>
          )}
        </div>
      </div>

      {/* Conversation Window */}
      <div className={`${!showMobileDetail && 'hidden'} md:flex flex-1 flex-col`}>
        {currentMessage ? (
          <>
            {/* Message Header */}
            <div className="p-4 md:p-6 bg-white border-b border-gray-200">
              <div className="flex items-start gap-3 md:gap-4">
                {/* Back button for mobile */}
                <button
                  onClick={handleBackToList}
                  className="md:hidden p-2 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors -ml-2"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                  {currentMessage.avatar}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-1">{currentMessage.subject}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">{currentMessage.from}</span>
                    <span>•</span>
                    <span>{currentMessage.role}</span>
                    <span>•</span>
                    <span>{currentMessage.time}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="prose max-w-none">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {currentMessage.content || currentMessage.preview}
                    </p>
                  </div>

                  {currentMessage.hasAttachment && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-3">Attachments</p>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <Paperclip className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Document.pdf</p>
                          <p className="text-xs text-gray-500">PDF • 2.4 MB</p>
                        </div>
                        <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                          Download
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reply Section */}
                <div className="mt-6">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <textarea
                      placeholder="Type your reply..."
                      rows={5}
                      className="w-full p-4 border-0 rounded-t-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                      <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <Paperclip className="w-5 h-5" />
                        <span className="text-sm font-medium">Attach File</span>
                      </button>
                      <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
                        <Send className="w-4 h-4" />
                        Send Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-600 mb-2">No message selected</p>
              <p className="text-sm text-gray-500">Choose a conversation to view messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
