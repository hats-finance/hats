export interface AnalysisResponse {
  estimations: {
    low: number;
    medium: number;
    high: number;
  };
  analysis: {
    summary: {
      total_lines: number;
      source_lines: number;
      comment_lines: number;
      comment_ratio: number;
      complexity_score: number;
      num_contracts: number;
      num_interfaces: number;
      num_abstract: number;
      num_libraries: number;
      num_public_functions: number;
      num_payable_functions: number;
      deployable_contracts: string[];
    };
    capabilities: {
      can_receive_funds: boolean;
      has_destroy_function: boolean;
      uses_assembly: boolean;
      uses_hash_functions: boolean;
      uses_unchecked_blocks: boolean;
      uses_try_catch: boolean;
    };
  };
}

export interface ExcludePatterns {
  directories?: string[];
  files?: string[];
} 