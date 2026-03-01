import type { Subject } from "@/types";

export const SUBJECTS: Subject[] = [
  {
    id: "math2",
    name: "수학 II",
    subtitle: "Mathematics II",
    description: "함수의 극한과 연속, 미분법, 적분법의 기초",
    icon: "📐",
    gradient: "from-violet-600 to-indigo-600",
    units: [
      {
        id: "limit-of-function",
        name: "함수의 극한",
        description: "함수의 극한값, 극한의 성질, 연속함수",
        icon: "∞",
        conceptCount: 0,
        color: "text-violet-400",
      },
      {
        id: "derivative",
        name: "미분계수와 도함수",
        description: "미분계수의 정의, 도함수, 미분법 공식",
        icon: "𝑓′",
        conceptCount: 0,
        color: "text-indigo-400",
      },
      {
        id: "extrema",
        name: "함수의 증감과 극대·극소",
        description: "증가/감소, 극값 판정, 그래프 개형",
        icon: "📈",
        conceptCount: 0,
        color: "text-blue-400",
      },
      {
        id: "definite-integral",
        name: "정적분과 넓이",
        description: "정적분의 정의, 넓이 계산, 급수와 적분",
        icon: "∫",
        conceptCount: 0,
        color: "text-cyan-400",
      },
    ],
  },
  {
    id: "calculus",
    name: "미적분",
    subtitle: "Calculus",
    description: "급수, 여러 가지 미분법, 적분법과 활용",
    icon: "∂",
    gradient: "from-emerald-600 to-teal-600",
    units: [
      {
        id: "series-convergence",
        name: "급수의 수렴/발산",
        description: "무한급수, 수렴 판정법, 등비급수",
        icon: "Σ",
        conceptCount: 0,
        color: "text-emerald-400",
      },
      {
        id: "differentiation-methods",
        name: "여러 가지 미분법",
        description: "합성함수, 매개변수, 음함수 미분",
        icon: "∂",
        conceptCount: 0,
        color: "text-green-400",
      },
      {
        id: "substitution-integral",
        name: "치환적분",
        description: "치환적분법, 부분적분법",
        icon: "∮",
        conceptCount: 0,
        color: "text-teal-400",
      },
      {
        id: "velocity-acceleration",
        name: "속도와 가속도",
        description: "위치·속도·가속도의 관계, 운동 해석",
        icon: "🚀",
        conceptCount: 0,
        color: "text-lime-400",
      },
      {
        id: "volume-of-revolution",
        name: "회전체의 부피",
        description: "x축/y축 회전, 디스크·와셔법",
        icon: "🔄",
        conceptCount: 0,
        color: "text-amber-400",
      },
    ],
  },
  {
    id: "geometry",
    name: "기하와 벡터",
    subtitle: "Geometry & Vectors",
    description: "이차곡선, 평면벡터, 공간도형",
    icon: "🔷",
    gradient: "from-rose-600 to-pink-600",
    units: [
      {
        id: "conic-sections",
        name: "이차곡선",
        description: "포물선, 타원, 쌍곡선의 방정식과 성질",
        icon: "⭕",
        conceptCount: 0,
        color: "text-rose-400",
      },
      {
        id: "vector-operations",
        name: "벡터의 연산과 내적",
        description: "벡터 덧셈, 스칼라배, 내적, 수직·평행",
        icon: "→",
        conceptCount: 0,
        color: "text-pink-400",
      },
      {
        id: "space-geometry",
        name: "공간도형과 좌표",
        description: "공간좌표, 구의 방정식, 평면의 방정식",
        icon: "🧊",
        conceptCount: 0,
        color: "text-fuchsia-400",
      },
    ],
  },
];

export function getSubject(id: string): Subject | undefined {
  return SUBJECTS.find((s) => s.id === id);
}

export function getUnit(subjectId: string, unitId: string) {
  const subject = getSubject(subjectId);
  return subject?.units.find((u) => u.id === unitId);
}
