const stub = {
  readdirSync: (): string[] => [],
  existsSync: (): boolean => false,
  readFileSync: (): string => "",
}

export default stub
export const readdirSync = stub.readdirSync
export const existsSync = stub.existsSync
export const readFileSync = stub.readFileSync
