declare module "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.mjs" {
  interface PyodideInterface {
    runPythonAsync(code: string): Promise<unknown>;
    loadPackage(name: string): Promise<void>;
  }

  interface LoadPyodideOptions {
    indexURL: string;
  }

  export function loadPyodide(
    options: LoadPyodideOptions,
  ): Promise<PyodideInterface>;
}
