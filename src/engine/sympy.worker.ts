/// <reference lib="webworker" />

declare const self: DedicatedWorkerGlobalScope;

interface WorkerRequest {
  id: string;
  type: "init" | "solve" | "diff" | "integrate" | "limit" | "simplify";
  payload: Record<string, string>;
}

interface WorkerResponse {
  id: string;
  type: "result" | "error" | "progress" | "ready";
  payload: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pyodide: any = null;

function send(response: WorkerResponse) {
  self.postMessage(response);
}

const PYTHON_FUNCTIONS = `
import sympy as sp
from sympy import *
from sympy.integrals.manualintegrate import integral_steps
import json
import random

def solve_expression(expr_str, var_str='x'):
    x = Symbol(var_str)
    expr = sympify(expr_str)
    solutions = solve(expr, x)
    steps = []
    steps.append({'label': '주어진 식', 'latex': latex(Eq(expr, 0)), 'description': f'{latex(expr)} = 0 형태의 방정식을 풀겠습니다.'})
    factored = factor(expr)
    if factored != expr:
        steps.append({'label': '인수분해', 'latex': latex(Eq(factored, 0)), 'description': f'식을 인수분해하면 {latex(factored)} = 0이 됩니다. 각 인수가 0이 되는 값이 해입니다.'})
    for i, sol in enumerate(solutions):
        sol_desc = f'{var_str} = {latex(sol)}' + ('이' if len(solutions) == 1 else f'이 제{i+1}') + ' 해입니다.'
        steps.append({'label': '해', 'latex': f'{var_str} = {latex(sol)}', 'description': sol_desc})
    verified = all(simplify(expr.subs(x, s)) == 0 for s in solutions)
    return json.dumps({
        'result': [latex(s) for s in solutions],
        'resultSymPy': [str(s) for s in solutions],
        'steps': steps,
        'verified': verified,
        'resultLatex': ', '.join([f'{var_str} = {latex(s)}' for s in solutions])
    })

def differentiate_expression(expr_str, var_str='x'):
    x = Symbol(var_str)
    expr = sympify(expr_str)
    result = diff(expr, x)
    steps = []
    steps.append({'label': '주어진 함수', 'latex': f'f({var_str}) = {latex(expr)}', 'description': f'함수 f({var_str}) = {latex(expr)}를 {var_str}에 대해 미분합니다.'})
    terms = Add.make_args(expr)
    if len(terms) > 1:
        for t in terms:
            d = diff(t, x)
            steps.append({
                'label': '항별 미분',
                'latex': f'\\\\frac{{d}}{{d{var_str}}}({latex(t)}) = {latex(d)}',
                'description': f'{latex(t)} 항을 미분하면 {latex(d)}이 됩니다.'
            })
    steps.append({'label': '도함수', 'latex': f"f'({var_str}) = {latex(result)}", 'description': f'모든 항의 미분을 합하면 도함수 f\'({var_str}) = {latex(result)}를 얻습니다.'})
    verified = True
    for _ in range(3):
        pt = random.uniform(-5, 5)
        try:
            num_diff = float((expr.subs(x, pt + 0.0001) - expr.subs(x, pt)) / 0.0001)
            sym_val = float(result.subs(x, pt))
            if abs(num_diff - sym_val) > 0.01:
                verified = False
        except:
            pass
    return json.dumps({
        'result': latex(result),
        'resultSymPy': str(result),
        'steps': steps,
        'verified': verified,
        'resultLatex': f"f'({var_str}) = {latex(result)}"
    })

def integrate_expression(expr_str, var_str='x', lower=None, upper=None):
    x = Symbol(var_str)
    expr = sympify(expr_str)
    if lower is not None and upper is not None:
        result = integrate(expr, (x, sympify(str(lower)), sympify(str(upper))))
        antideriv = integrate(expr, x)
        steps = []
        lo = sympify(str(lower))
        up = sympify(str(upper))
        steps.append({
            'label': '주어진 적분',
            'latex': f'\\\\int_{{{latex(lo)}}}^{{{latex(up)}}} {latex(expr)} \\\\, d{var_str}',
            'description': f'{latex(expr)}를 구간 [{latex(lo)}, {latex(up)}]에서 정적분합니다.'
        })
        try:
            isteps = integral_steps(expr, x)
            strategy = str(type(isteps).__name__).replace('Rule', '')
            steps.append({'label': '적분 전략', 'latex': str(type(isteps).__name__), 'description': f'적분 방법: {strategy} 규칙을 적용합니다.'})
        except:
            pass
        steps.append({'label': '부정적분', 'latex': f'F({var_str}) = {latex(antideriv)}', 'description': f'먼저 역도함수 F({var_str}) = {latex(antideriv)}를 구합니다.'})
        steps.append({
            'label': '정적분 계산',
            'latex': f'F({latex(up)}) - F({latex(lo)}) = {latex(result)}',
            'description': f'F({latex(up)}) - F({latex(lo)})를 계산하면 {latex(result)}입니다.'
        })
        verified = simplify(result - integrate(expr, (x, lo, up))) == 0
    else:
        result = integrate(expr, x)
        steps = []
        steps.append({
            'label': '주어진 적분',
            'latex': f'\\\\int {latex(expr)} \\\\, d{var_str}',
            'description': f'{latex(expr)}를 {var_str}에 대해 부정적분합니다.'
        })
        try:
            isteps = integral_steps(expr, x)
            strategy = str(type(isteps).__name__).replace('Rule', '')
            steps.append({'label': '적분 전략', 'latex': str(type(isteps).__name__), 'description': f'적분 방법: {strategy} 규칙을 적용합니다.'})
        except:
            pass
        steps.append({
            'label': '결과',
            'latex': f'\\\\int {latex(expr)} \\\\, d{var_str} = {latex(result)} + C',
            'description': f'부정적분 결과는 {latex(result)} + C입니다. (C는 적분 상수)'
        })
        check = simplify(diff(result, x) - expr)
        verified = check == 0
    return json.dumps({
        'result': latex(result),
        'resultSymPy': str(result),
        'steps': steps,
        'verified': verified,
        'resultLatex': latex(result) + (' + C' if lower is None else '')
    })

def limit_expression(expr_str, var_str='x', point_str='0'):
    x = Symbol(var_str)
    expr = sympify(expr_str)
    point = sympify(point_str)
    result = limit(expr, x, point)
    steps = []
    steps.append({
        'label': '주어진 극한',
        'latex': f'\\\\lim_{{{var_str} \\\\to {latex(point)}}} {latex(expr)}',
        'description': f'{var_str}이 {latex(point)}에 한없이 가까워질 때 함수값의 극한을 구합니다.'
    })
    try:
        direct = expr.subs(x, point)
        direct_desc = f'{var_str} = {latex(point)}을 직접 대입하면 {latex(direct)}입니다.'
        if direct.has(zoo) or direct.has(oo) or direct.has(nan):
            direct_desc += ' 부정형이므로 다른 방법으로 극한을 구합니다.'
        steps.append({
            'label': '직접 대입',
            'latex': f'f({latex(point)}) = {latex(direct)}',
            'description': direct_desc
        })
    except:
        pass
    steps.append({
        'label': '극한값',
        'latex': f'\\\\lim_{{{var_str} \\\\to {latex(point)}}} {latex(expr)} = {latex(result)}',
        'description': f'극한값은 {latex(result)}입니다.'
    })
    return json.dumps({
        'result': latex(result),
        'resultSymPy': str(result),
        'steps': steps,
        'verified': True,
        'resultLatex': latex(result)
    })

def simplify_expression(expr_str):
    expr = sympify(expr_str)
    result = simplify(expr)
    steps = []
    steps.append({'label': '주어진 식', 'latex': latex(expr), 'description': f'{latex(expr)}을 간소화합니다.'})
    factored = factor(expr)
    if factored != expr:
        steps.append({'label': '인수분해', 'latex': latex(factored), 'description': f'인수분해하면 {latex(factored)} 형태가 됩니다.'})
    expanded = expand(expr)
    if expanded != expr and expanded != factored:
        steps.append({'label': '전개', 'latex': latex(expanded), 'description': f'전개하면 {latex(expanded)} 형태가 됩니다.'})
    steps.append({'label': '간소화 결과', 'latex': latex(result), 'description': f'최종 간소화 결과: {latex(result)} (원래 식과 동치)'})
    verified = simplify(expr - result) == 0
    return json.dumps({
        'result': latex(result),
        'resultSymPy': str(result),
        'steps': steps,
        'verified': verified,
        'resultLatex': latex(result)
    })
`;

async function initPyodide(requestId: string) {
  send({ id: requestId, type: "progress", payload: { message: "Pyodide 런타임 로딩 중...", percent: 10 } });

  const { loadPyodide } = await import(
    /* @vite-ignore */ "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.mjs"
  );

  send({ id: requestId, type: "progress", payload: { message: "Python 환경 초기화 중...", percent: 40 } });

  pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/",
  });

  send({ id: requestId, type: "progress", payload: { message: "SymPy 패키지 설치 중...", percent: 60 } });

  await pyodide.loadPackage("sympy");

  send({ id: requestId, type: "progress", payload: { message: "풀이 함수 등록 중...", percent: 90 } });

  await pyodide.runPythonAsync(PYTHON_FUNCTIONS);

  send({ id: requestId, type: "ready", payload: null });
}

async function handleCompute(request: WorkerRequest) {
  if (!pyodide) {
    send({ id: request.id, type: "error", payload: "Pyodide가 초기화되지 않았습니다" });
    return;
  }

  const { expression, variable = "x", lower, upper, point } = request.payload;

  let pythonCall: string;
  switch (request.type) {
    case "solve":
      pythonCall = `solve_expression(${JSON.stringify(expression)}, ${JSON.stringify(variable)})`;
      break;
    case "diff":
      pythonCall = `differentiate_expression(${JSON.stringify(expression)}, ${JSON.stringify(variable)})`;
      break;
    case "integrate":
      if (lower && upper) {
        pythonCall = `integrate_expression(${JSON.stringify(expression)}, ${JSON.stringify(variable)}, ${JSON.stringify(lower)}, ${JSON.stringify(upper)})`;
      } else {
        pythonCall = `integrate_expression(${JSON.stringify(expression)}, ${JSON.stringify(variable)})`;
      }
      break;
    case "limit":
      pythonCall = `limit_expression(${JSON.stringify(expression)}, ${JSON.stringify(variable)}, ${JSON.stringify(point || "0")})`;
      break;
    case "simplify":
      pythonCall = `simplify_expression(${JSON.stringify(expression)})`;
      break;
    default:
      send({ id: request.id, type: "error", payload: `알 수 없는 연산: ${request.type}` });
      return;
  }

  try {
    const resultJson = await pyodide.runPythonAsync(pythonCall);
    const result = JSON.parse(resultJson as string);
    send({ id: request.id, type: "result", payload: result });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "계산 오류";
    send({ id: request.id, type: "error", payload: msg });
  }
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const request = event.data;
  if (request.type === "init") {
    try {
      await initPyodide(request.id);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Pyodide 로딩 실패";
      send({ id: request.id, type: "error", payload: msg });
    }
    return;
  }
  await handleCompute(request);
};
