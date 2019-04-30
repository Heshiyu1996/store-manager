const state = {
    ifLogin: false, // 是否登录
    userInfoStore: {} // 用户信息
}

const getters = {
    // 登录状态
    getIflogin(state) {
        return state.ifLogin
    },
    // 用户信息
    getUserInfoStore(state) {
        return state.userInfoStore
    }
}

const mutations = {
    // 设置登录状态
    setIfLogin(state, payload) {
        return (state.ifLogin = payload)
    },
    // 设置用户信息
    setUserInfoStore(state, payload) {
        return (state.userInfoStore = payload)
    }
}

const actions = {
    // 设置登录状态
    actSetIfLogin({ commit }, payload) {
        commit('setIfLogin', payload)
    },
    // 设置用户信息
    actSetUserInfoStore({ commit }, payload) {
        commit('setUserInfoStore', payload)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
