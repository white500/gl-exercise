/*
 * @Author: yejinliang
 * @Date: 2022-03-29 14:52:15
 * @LastEditTime: 2022-03-29 17:07:08
 * @LastEditors: yejinliang
 * @Description:
 */
/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
