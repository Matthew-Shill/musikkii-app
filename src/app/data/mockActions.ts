/**
 * Mock action stubs for prototype
 * Replace these with real API calls during backend integration
 */

import type { AssignmentState, NoteCheckAttempt } from '../types/domain';

export const mockActions = {
  logPracticeSession: (assignmentId: string, durationMinutes: number) => {
    console.log('[MOCK] Log practice session:', { assignmentId, durationMinutes });
  },

  updateAssignmentState: (assignmentId: string, newState: AssignmentState) => {
    console.log('[MOCK] Update assignment state:', { assignmentId, newState });
  },

  submitNoteCheckAttempt: (assignmentId: string, attempt: Omit<NoteCheckAttempt, 'id' | 'timestamp'>) => {
    console.log('[MOCK] Submit NoteCheck attempt:', { assignmentId, attempt });
  },

  awardStars: (assignmentId: string, stars: number) => {
    console.log('[MOCK] Award stars:', { assignmentId, stars });
  },

  awardXP: (studentId: string, xp: number, source: string) => {
    console.log('[MOCK] Award XP:', { studentId, xp, source });
  },

  addTeacherNote: (assignmentId: string, note: string) => {
    console.log('[MOCK] Add teacher note:', { assignmentId, note });
  }
};
