import envConfig from './env'

export default () => {
  return envConfig as Record<string, any>
}
