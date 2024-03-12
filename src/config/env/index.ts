import common from './common'
import devConfig from './dev'
import prodConfig from './prod'

export default {
  ...common,
  ...(common.isDev ? devConfig : prodConfig)
}
