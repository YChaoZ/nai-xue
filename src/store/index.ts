import { createStore } from 'vuex';
import type { State, CartItem } from '@/types';

const store = createStore<State>({
  state: {
    cart: {
      list: []
    },
    config: {
      minDeliveryAmount: 20
    },
    user: {
      address: null
    }
  },
  getters: {
    'cart/total': (state) => {
      return state.cart.list.reduce((total, item) => total + item.price * item.number, 0);
    },
    'cart/count': (state) => {
      return state.cart.list.reduce((total, item) => total + item.number, 0);
    }
  },
  mutations: {
    'cart/add': (state, item: Partial<CartItem>) => {
      const index = state.cart.list.findIndex(i => i.id === item.id);
      if (index > -1) {
        state.cart.list[index].number += item.number || 1;
      } else {
        state.cart.list.push(item as CartItem);
      }
    },
    'cart/reduce': (state, { id }: { id: number }) => {
      const index = state.cart.list.findIndex(i => i.id === id);
      if (index > -1) {
        if (state.cart.list[index].number > 1) {
          state.cart.list[index].number--;
        } else {
          state.cart.list.splice(index, 1);
        }
      }
    },
    'cart/clear': (state) => {
      state.cart.list = [];
    },
    'config/update': (state, config: Partial<State['config']>) => {
      state.config = { ...state.config, ...config };
    },
    'user/update': (state, user: Partial<State['user']>) => {
      state.user = { ...state.user, ...user };
    }
  },
  actions: {
    'cart/add': ({ commit }, item) => {
      commit('cart/add', item);
    },
    'cart/reduce': ({ commit }, id) => {
      commit('cart/reduce', id);
    },
    'cart/clear': ({ commit }) => {
      commit('cart/clear');
    },
    'config/load': async ({ commit }) => {
      // TODO: 从服务器加载配置
      commit('config/update', { minDeliveryAmount: 20 });
    },
    'user/load': async ({ commit }) => {
      // TODO: 从服务器加载用户信息
      const address = uni.getStorageSync('address');
      if (address) {
        commit('user/update', { address });
      }
    }
  }
});

export function useStore() {
  return store;
}

export default store;
