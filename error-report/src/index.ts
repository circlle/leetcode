export interface ErrorMessage {
  message: string;
  stack: Array<{
    line: number;
    column: number;
    filename: string;
  }>;
}

/**
 * 将错误的各种信息序列化为日志中心可以处理的 JSON 形式。
 * 不同浏览器的 error stack 格式会有区别。
 * @param err Error。 浏览器的错误对象。
 */
export function parseError(err: Error): ErrorMessage {
  const message = err.message;
  const errorStack = err.stack;
  const stack = getStackArray(errorStack);
  const errorMessage = {
    message,
    stack: stack,
  };
  return errorMessage;
}

/**
 * 获取 stack array 的方法。内部会自动判断浏览器类型
 * @param errorStack
 */
function getStackArray(errorStack?: string): ErrorMessage['stack'] {
  if (errorStack === undefined) return [];
  const browserType = getBrowserType();
  let stackArray: ErrorMessage['stack'];
  switch (browserType) {
    case 'Chrome':
      stackArray = getChromeStackArray(errorStack);
      break;
    case 'Firefox':
      stackArray = getFirefoxStackArray(errorStack);
      break;
    default:
      stackArray = [];
      break;
  }
  return stackArray;
}

/**
 * 用来匹配一行 chrome error stack 的正则。使用捕获组自动匹配关键信息
 * eg.`at bar http://192.168.31.8:8000/c.js:2:9`
 */
const chromeRegex = /at (\w+) (.+?):(\d+):(\d+)/;
function getChromeStackArray(errorStack: string): ErrorMessage['stack'] {
  let stack: ErrorMessage['stack'] = [];
  try {
    errorStack.split('\n').forEach((stackItem) => {
      const result = chromeRegex.exec(stackItem);
      if (result === null) return;
      const [, , filename, line, column] = result;
      stack.push({
        line: Number(line) || -1,
        column: Number(column) || -1,
        filename,
      });
    });
    return stack;
  } catch (error) {
    return [];
  }
}

/**
 * 用来匹配一行 firefox error stack 的正则。使用捕获组自动匹配关键信息
 * eg.`bar@http://192.168.31.8:8000/c.js:2:9`
 */
const firefoxRegex = /(\w+)@(.+?):(\d):(\d+)/;
function getFirefoxStackArray(errorStack: string): ErrorMessage['stack'] {
  let stack: ErrorMessage['stack'] = [];
  try {
    errorStack.split('\n').forEach((stackItem) => {
      const result = firefoxRegex.exec(stackItem);
      if (result === null) return;
      const [, , filename, line, column] = result;
      stack.push({
        line: Number(line) || -1,
        column: Number(column) || -1,
        filename,
      });
    });
    return stack;
  } catch (error) {
    return [];
  }
}

/**
 * 要处理的浏览器类型。包括 Chrome, Firefox。
 * 此外，额外使用一个 unknown 表示 未知/不需要处理 的浏览器类型
 */
export type BrowserType = 'Chrome' | 'Firefox' | 'unknown';
/**
 * * 在 chrome 环境中， window 上会有 chrome 变量
 */
export type ChromeWindow = { chrome: any } & Window;
/**
 * * 在 firefox 环境中， window 上会有 InstallTrigger 变量
 */
export type FirefoxWindow = { InstallTrigger: any } & Window;

export function checkIsChrome(window: Window) {
  return (window as ChromeWindow).chrome !== undefined;
}
export function checkIsFirefox(window: Window) {
  return (window as FirefoxWindow).InstallTrigger !== undefined;
}
/**
 * * 有副作用。从 useragent 中获取浏览器信息
 */
function getBrowserType(): BrowserType {
  if (typeof window === 'undefined') return 'unknown';
  const isChrome = checkIsChrome(window);
  const isFirefox = checkIsFirefox(window);
  if (isChrome) return 'Chrome';
  if (isFirefox) return 'Firefox';
  return 'unknown';
}
