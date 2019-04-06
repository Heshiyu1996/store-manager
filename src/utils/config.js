export const isDev = process.env.NODE_ENV === 'development'
export const isMock = false
export const rootURL = isDev ? (isMock ? 'http://localhost:8002' : 'http://localhost:8080') : '/'

/* 编辑模式，新增/编辑 */
export const MODIFY_MODAL_TYPE = {
    ADD: 1,
    EDIT: 0
}
