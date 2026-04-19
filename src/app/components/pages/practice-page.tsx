import {
  Play,
  Pause,
  Clock,
  Target,
  FileText,
  CheckCircle2,
  Plus,
  Minus,
  Zap,
  Star,
  AlertCircle,
  HelpCircle,
  Mic,
  Sparkles,
  Trophy,
  Flame,
  Info
} from 'lucide-react';
import { useRole } from '../../context/role-context';
import { useState, useRef, useEffect } from 'react';
import { Metronome } from '../shared/practice-tools/metronome';
import { Tuner } from '../shared/practice-tools/tuner';
import { IntervalTrainer } from '../shared/practice-tools/interval-trainer';
import { Drone } from '../shared/practice-tools/drone';
import { CircleOfFifths } from '../shared/practice-tools/circle-of-fifths';
import { KeyStudy } from '../shared/practice-tools/key-study';
import { PracticeStreakWidget } from '../shared/practice-streak-widget';
import type { Assignment, AssignmentState, ResourceType } from '../../types/domain';
import { mockAssignments } from '../../data/mockData';
import { mockActions } from '../../data/mockActions';

export function PracticePage() {
  const { role } = useRole();
  const isTeacher = role === 'teacher' || role === 'teacher-manager';

  if (isTeacher) {
    return <TeacherPracticeView />;
  }

  return <StudentPracticeView />;
}

function TeacherPracticeView() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Practice Overview</h1>
        <p className="text-gray-600">Monitor student practice activity and engagement</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Practice Analytics</h2>
          <p className="text-gray-600">
            View student practice sessions, assignment progress, and engagement metrics across your studio.
          </p>
        </div>
      </div>
    </div>
  );
}

function StudentPracticeView() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [activeToolTab, setActiveToolTab] = useState<'metronome' | 'tuner' | 'interval' | 'drone' | 'circle' | 'keys'>('metronome');
  const [showLogModal, setShowLogModal] = useState(false);
  const [practiceNotes, setPracticeNotes] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [showNoteCheckModal, setShowNoteCheckModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [xpEarnedToday, setXpEarnedToday] = useState(45); // XP from practice sessions today
  const toolsRef = useRef<HTMLDivElement>(null);

  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const addTime = (minutes: number) => {
    setTimerSeconds((s) => Math.max(0, s + minutes * 60));
  };

  const handleManualTimeChange = (value: string) => {
    const num = parseInt(value) || 0;
    setTimerSeconds(num * 60);
  };

  const scrollToTools = () => {
    toolsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleLogPractice = () => {
    if (timerSeconds > 0) {
      setShowLogModal(true);
    }
  };

  const handleSubmitLog = () => {
    mockActions.logPracticeSession('manual-log', Math.floor(timerSeconds / 60));
    setTimerSeconds(0);
    setPracticeNotes('');
    setShowLogModal(false);
    setIsTimerRunning(false);
  };

  const handleAssignmentClick = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowAssignmentModal(true);
  };

  const updateAssignmentState = (newState: AssignmentState) => {
    if (selectedAssignment) {
      mockActions.updateAssignmentState(selectedAssignment.id, newState);
      setAssignments(prev => prev.map(a =>
        a.id === selectedAssignment.id ? { ...a, state: newState } : a
      ));
      setShowAssignmentModal(false);
      setSelectedAssignment(null);
    }
  };

  const handleStartRecording = () => {
    setShowAssignmentModal(false);
    setShowRecordingModal(true);
  };

  const handleStartNoteCheck = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowAssignmentModal(false);
    setShowNoteCheckModal(true);
  };

  const getResourceIcon = (type: ResourceType) => {
    const icons: Record<ResourceType, string> = {
      piece: '🎵',
      scale: '🎹',
      exercise: '💪',
      theory: '📚',
      rhythm: '🥁',
      technique: '🎯',
    };
    return icons[type];
  };

  const getStateColor = (state: AssignmentState) => {
    const colors = {
      'not-started': 'gray',
      'practiced': 'blue',
      'needs-help': 'orange',
      'ready-for-review': 'purple'
    };
    return colors[state];
  };

  const getStateLabel = (state: AssignmentState) => {
    const labels = {
      'not-started': 'Not Started',
      'practiced': 'Practiced',
      'needs-help': 'Needs Help',
      'ready-for-review': 'Ready for Review'
    };
    return labels[state];
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-1 md:mb-2">Practice Session</h1>
          <p className="text-sm md:text-base text-gray-600">Practice, earn XP, and master your assignments</p>
        </div>
        <button
          onClick={() => setShowInfoModal(true)}
          className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
        >
          <Info className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Practice Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Progress */}
          <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/80 text-sm uppercase tracking-wide mb-1">Today's Progress</p>
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8" />
                  <span className="text-4xl font-bold">{xpEarnedToday} XP</span>
                </div>
              </div>
              <button
                onClick={scrollToTools}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 active:bg-white/40 backdrop-blur rounded-lg font-medium transition-colors text-sm md:text-base"
              >
                Practice Tools
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-300" />
                <div>
                  <p className="text-xs text-white/70">Streak</p>
                  <p className="font-semibold">12 days</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-300" />
                <div>
                  <p className="text-xs text-white/70">Stars Available</p>
                  <p className="font-semibold">4 assignments</p>
                </div>
              </div>
            </div>
          </div>

          {/* Practice Timer */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-green-100 text-sm uppercase tracking-wide mb-1">Practice Timer</p>
                <p className="text-4xl font-bold">{formatTime(timerSeconds)}</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <Clock className="w-7 h-7" />
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="w-full py-3 bg-white text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Pause Practice
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    {timerSeconds > 0 ? 'Resume Practice' : 'Start Practice'}
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-sm">
                <button
                  onClick={() => addTime(-5)}
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="0"
                  value={Math.floor(timerSeconds / 60)}
                  onChange={(e) => handleManualTimeChange(e.target.value)}
                  className="w-16 px-2 py-1.5 bg-white/20 backdrop-blur border border-white/30 rounded-lg text-center font-semibold text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <span className="text-green-100">min</span>
                <button
                  onClick={() => addTime(5)}
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {timerSeconds > 0 && (
                <button
                  onClick={handleLogPractice}
                  disabled={isTimerRunning}
                  className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-white/30"
                >
                  <FileText className="w-4 h-4" />
                  Log Practice (History Only)
                </button>
              )}

              {timerSeconds > 0 && (
                <p className="text-xs text-green-100 text-center">
                  ℹ️ Manual time logs your practice history only - no XP or streak credit. Earn XP through assignments and tools.
                </p>
              )}
            </div>
          </div>

          {/* This Week's Assignments */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">This Week's Assignments</h2>
                  <p className="text-sm text-gray-600">Click any assignment to update progress</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {assignments.map((assignment) => (
                <button
                  key={assignment.id}
                  onClick={() => handleAssignmentClick(assignment)}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left bg-white"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getResourceIcon(assignment.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {[...Array(3)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < assignment.currentStars
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium bg-${getStateColor(
                            assignment.state
                          )}-100 text-${getStateColor(assignment.state)}-700`}
                        >
                          {getStateLabel(assignment.state)}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          Difficulty: {assignment.difficulty}/5
                        </span>
                        {assignment.xpAvailable > 0 && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            +{assignment.xpAvailable} XP
                          </span>
                        )}
                        {assignment.hasAutoCheck && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            NoteCheck
                          </span>
                        )}
                      </div>

                      {assignment.teacherNotes && (
                        <p className="text-xs text-gray-600 mt-2 italic">📝 {assignment.teacherNotes}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Streak Widget */}
          <PracticeStreakWidget
            currentStreak={12}
            longestStreak={18}
            streakFreezes={1}
            daysThisWeek={[true, true, false, true, true, true, false]}
            variant="compact"
          />

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">This Week</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Practice Time</span>
                  <span className="font-semibold text-gray-900">155 / 200 min</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: '77%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Stars Earned</span>
                  <span className="font-semibold text-gray-900">8 / 12</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" style={{ width: '66%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Sessions (History Only) */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Practice History</h3>
            </div>
            <div className="space-y-2">
              {[
                { date: 'Today', note: 'Scales & Moonlight Sonata', time: '32 min' },
                { date: 'Yesterday', note: 'Technique exercises', time: '45 min' },
                { date: 'Apr 16', note: 'Sight reading', time: '28 min' }
              ].map((session, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">{session.date}</p>
                    <p className="text-xs font-semibold text-gray-600">{session.time}</p>
                  </div>
                  <p className="text-xs text-gray-600">{session.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Practice Tools Section */}
      <div ref={toolsRef} className="scroll-mt-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Practice Tools</h2>
            <p className="text-gray-600">Use these tools during practice to earn XP</p>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {(['metronome', 'tuner', 'interval', 'drone', 'circle', 'keys'] as const).map((tool) => (
              <button
                key={tool}
                onClick={() => setActiveToolTab(tool)}
                className={`px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeToolTab === tool
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tool.charAt(0).toUpperCase() + tool.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>

          <div>
            {activeToolTab === 'metronome' && <Metronome />}
            {activeToolTab === 'tuner' && <Tuner />}
            {activeToolTab === 'interval' && <IntervalTrainer />}
            {activeToolTab === 'drone' && <Drone />}
            {activeToolTab === 'circle' && <CircleOfFifths />}
            {activeToolTab === 'keys' && <KeyStudy />}
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignmentModal && selectedAssignment && (
        <AssignmentModal
          assignment={selectedAssignment}
          onClose={() => {
            setShowAssignmentModal(false);
            setSelectedAssignment(null);
          }}
          onUpdateState={updateAssignmentState}
          onStartRecording={handleStartRecording}
          onStartNoteCheck={() => handleStartNoteCheck(selectedAssignment)}
        />
      )}

      {/* Recording Modal */}
      {showRecordingModal && selectedAssignment && (
        <RecordingModal
          assignment={selectedAssignment}
          onClose={() => {
            setShowRecordingModal(false);
            setSelectedAssignment(null);
          }}
        />
      )}

      {/* NoteCheck Modal */}
      {showNoteCheckModal && selectedAssignment && (
        <NoteCheckModal
          assignment={selectedAssignment}
          onClose={() => {
            setShowNoteCheckModal(false);
            setSelectedAssignment(null);
          }}
        />
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <InfoModal onClose={() => setShowInfoModal(false)} />
      )}

      {/* Log Practice Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Log Practice Session</h2>
                <p className="text-sm text-gray-600">Duration: {formatTime(timerSeconds)}</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What did you practice today?
              </label>
              <textarea
                value={practiceNotes}
                onChange={(e) => setPracticeNotes(e.target.value)}
                placeholder="E.g., Scales in C major, first movement of Moonlight Sonata..."
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-gray-900"
              />
              <p className="text-xs text-gray-500 mt-2">
                ℹ️ This logs your practice history. To earn XP and stars, update your assignments above.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setPracticeNotes('');
                  setShowLogModal(false);
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitLog}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Submit Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Supporting Modal Components
function AssignmentModal({
  assignment,
  onClose,
  onUpdateState,
  onStartRecording,
  onStartNoteCheck
}: {
  assignment: Assignment;
  onClose: () => void;
  onUpdateState: (state: AssignmentState) => void;
  onStartRecording: () => void;
  onStartNoteCheck: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
        <div className="flex items-start gap-3 mb-6">
          <span className="text-3xl">{assignment.type === 'piece' ? '🎵' : assignment.type === 'scale' ? '🎹' : '💪'}</span>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">{assignment.title}</h2>
            <div className="flex items-center gap-2">
              {[...Array(3)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < assignment.currentStars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-2">
                {assignment.currentStars}/3 stars
              </span>
            </div>
          </div>
        </div>

        {assignment.teacherNotes && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm font-medium text-blue-900 mb-1">Teacher Notes</p>
            <p className="text-sm text-blue-800">{assignment.teacherNotes}</p>
          </div>
        )}

        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-gray-900 text-sm">Update Status</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onUpdateState('practiced')}
              className="p-3 rounded-lg border-2 border-blue-200 bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition-colors"
            >
              Mark Practiced
            </button>
            <button
              onClick={() => onUpdateState('needs-help')}
              className="p-3 rounded-lg border-2 border-orange-200 bg-orange-50 text-orange-700 font-medium hover:bg-orange-100 transition-colors"
            >
              Needs Help
            </button>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-gray-900 text-sm">Ready to Submit?</h3>
          {assignment.hasAutoCheck ? (
            <button
              onClick={onStartNoteCheck}
              className="w-full p-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Start NoteCheck
              {assignment.xpAvailable > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs">+{assignment.xpAvailable} XP</span>
              )}
            </button>
          ) : (
            <button
              onClick={onStartRecording}
              className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Mic className="w-5 h-5" />
              Submit Recording
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function RecordingModal({ assignment, onClose }: { assignment: Assignment; onClose: () => void }) {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-4">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Submit Recording</h2>
          <p className="text-gray-600">{assignment.title}</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 mb-6">
          <div className="text-center">
            {!isRecording ? (
              <button
                onClick={() => setIsRecording(true)}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg"
              >
                Start Recording
              </button>
            ) : (
              <div>
                <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <div className="w-6 h-6 rounded-full bg-white" />
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-2">Recording...</p>
                <p className="text-sm text-gray-600 mb-4">0:32</p>
                <button
                  onClick={() => setIsRecording(false)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Stop Recording
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
            disabled={isRecording}
          >
            Submit for Review
          </button>
        </div>
      </div>
    </div>
  );
}

function NoteCheckModal({ assignment, onClose }: { assignment: Assignment; onClose: () => void }) {
  const [checkComplete, setCheckComplete] = useState(false);
  const [score, setScore] = useState(0);

  const startCheck = () => {
    setTimeout(() => {
      const randomScore = Math.floor(Math.random() * 30) + 70; // 70-100
      setScore(randomScore);
      setCheckComplete(true);

      // Mock actions for backend integration
      const starsEarned = randomScore >= 95 ? 3 : randomScore >= 85 ? 2 : 1;
      mockActions.submitNoteCheckAttempt(assignment.id, {
        assignmentId: assignment.id,
        studentId: assignment.studentId || 'student-1',
        score: randomScore,
        starsAwarded: starsEarned,
        xpAwarded: assignment.xpAvailable,
      });
      mockActions.awardStars(assignment.id, starsEarned);
      mockActions.awardXP(assignment.studentId || 'student-1', assignment.xpAvailable, 'notecheck');
      mockActions.updateAssignmentState(assignment.id, 'ready-for-review');
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">NoteCheck</h2>
          <p className="text-gray-600">{assignment.title}</p>
        </div>

        {!checkComplete ? (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 mb-6">
            <div className="text-center">
              <p className="text-gray-700 mb-4">
                Play through the exercise. NoteCheck will automatically analyze your performance.
              </p>
              <button
                onClick={startCheck}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
              >
                Start NoteCheck
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 mb-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-green-600 mb-2">{score}%</div>
              <p className="text-lg font-semibold text-gray-900 mb-4">Great job!</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                <Zap className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-700">+{assignment.xpAvailable} XP Earned</span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          {checkComplete ? 'Done' : 'Close'}
        </button>
      </div>
    </div>
  );
}

function InfoModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Info className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">How Practice Works</h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              XP (Experience Points)
            </h3>
            <p className="text-sm text-gray-700">
              Weekly effort for league ranking. Earned from lessons, validated practice with tools, and completing assignments. Resets weekly for competition.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Stars
            </h3>
            <p className="text-sm text-gray-700">
              Mastery of assignments (0-3 stars each). Earn through NoteCheck, teacher review of recordings, or manual teacher assessment. Shows real musical progress.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-600" />
              Level
            </h3>
            <p className="text-sm text-gray-700">
              Long-term musical growth based on balanced development across technique, theory, and expression. Separate from weekly leagues.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Streak
            </h3>
            <p className="text-sm text-gray-700">
              Practice consistency tracker. Earn streak freezes by practicing 7 days in a row to protect your streak if you miss a day.
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>💡 Pro Tip:</strong> Manual time logs your practice history but doesn't earn XP or count toward streaks. To earn rewards, update your assignments and use practice tools!
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-6"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
