export type AnalysisResult = {
  overallScore: number;
  summary: string;
  actionableNextSteps?: string[];
};

export type Analysis = {
  id: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  cvId: string;
  result: AnalysisResult;
};

export type RawAnalysis = {
  id: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  cvId: string;
  result: unknown;
};
