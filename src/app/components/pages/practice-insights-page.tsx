import { TrendingUp, Clock, Target, Award, ChevronRight, Calendar, Flame } from 'lucide-react';
import { useState } from 'react';
import { useRole } from '../../context/role-context';
import { ParentPracticeInsights } from './practice-insights/parent-practice-insights';
import { FamilyPracticeInsights } from './practice-insights/family-practice-insights';
import { TeacherPracticeInsights } from './practice-insights/teacher-practice-insights';
import { TeacherManagerPracticeInsights } from './practice-insights/teacher-manager-practice-insights';
import { RestrictedAccess } from '../restricted-access';

export function PracticeInsightsPage() {
  const { role, roleFamily } = useRole();

  if (roleFamily !== 'household' && roleFamily !== 'instructor') {
    return <RestrictedAccess pageName="Practice Insights" allowedRoles="families, teachers" />;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Practice Insights</h1>
        <p className="text-gray-600">
          {role === 'parent' && 'Track your child\'s practice progress and achievements'}
          {role === 'family' && 'Monitor practice activity across all your children'}
          {role === 'teacher' && 'View practice insights for all your students'}
          {role === 'teacher-manager' && 'Oversee practice insights across your teaching team'}
        </p>
      </div>

      {/* Role-specific content */}
      {role === 'parent' && <ParentPracticeInsights />}
      {role === 'family' && <FamilyPracticeInsights />}
      {role === 'teacher' && <TeacherPracticeInsights />}
      {role === 'teacher-manager' && <TeacherManagerPracticeInsights />}
    </div>
  );
}
