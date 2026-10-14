import React from 'react';
import { AboutView } from './AboutView';
import { PageTab } from '../types';

interface TeamViewProps {
  onTabChange?: (tab: PageTab) => void;
}

export const TeamView: React.FC<TeamViewProps> = ({ onTabChange }) => {
  return <AboutView onTabChange={onTabChange} />;
};
