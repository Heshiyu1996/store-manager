import './svg' /* 导入所有svg图片 */
import './filters' /* 导入所有过滤器 */
import './components' /* 自注册common下所有组件 */

/* 第三方插件 */

// Promise Catch不报错
window.addEventListener('unhandledrejection', event => event.preventDefault())
