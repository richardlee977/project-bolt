export type BusinessStage = 
  | 'ideation'
  | 'planning'
  | 'established'
  | 'social';

export interface BusinessProfile {
  stage: BusinessStage;
  type: string;
  goals: string[];
  experience: string;
}

export const stageDescriptions = {
  ideation: "Exploring restaurant business ideas",
  planning: "Planning to open a restaurant",
  established: "Currently running a restaurant",
  social: "Running a food business on social media"
};