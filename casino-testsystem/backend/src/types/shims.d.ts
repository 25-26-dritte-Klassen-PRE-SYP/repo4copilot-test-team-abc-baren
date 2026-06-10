declare module 'express' {
  const express: any
  export default express
  export const Router: any
}

declare module 'cors' {
  const cors: any
  export default cors
}

declare module 'dotenv' {
  const dotenv: any
  export default dotenv
}

declare module 'pg' {
  export class Pool {
    constructor(config?: any)
    query(...args: any[]): Promise<any>
  }
}

declare module 'node:test' {
  export const describe: any
  export const it: any
}

declare module 'node:assert/strict' {
  const assert: any
  export default assert
}

declare const process: any
declare const console: any