import type { SolveResult, ProblemType } from "./sympy-bridge";

export interface VerificationResult {
  passed: boolean;
  method: string;
  description: string;
}

export function getVerificationSummary(
  result: SolveResult,
  problemType: ProblemType,
): VerificationResult {
  const passed = result.verified;

  switch (problemType) {
    case "solve":
      return {
        passed,
        method: "역대입",
        description: passed
          ? "해를 원래 식에 대입하여 검증 완료"
          : "역대입 검증에 실패했습니다",
      };
    case "diff":
      return {
        passed,
        method: "수치 검증",
        description: passed
          ? "수치 미분으로 검증 완료"
          : "수치 검증에서 불일치 발견",
      };
    case "integrate":
      return {
        passed,
        method: "미분 검증",
        description: passed
          ? "결과를 미분하여 원래 식과 일치 확인"
          : "미분 검증에 실패했습니다",
      };
    case "limit":
      return {
        passed,
        method: "기호 연산",
        description: passed
          ? "SymPy 기호 연산으로 정확한 극한값 계산"
          : "극한값 계산에 문제가 있을 수 있습니다",
      };
    case "simplify":
      return {
        passed,
        method: "동치성 확인",
        description: passed
          ? "원래 식과 결과의 동치성 확인 완료"
          : "동치 확인에 실패했습니다",
      };
  }
}
