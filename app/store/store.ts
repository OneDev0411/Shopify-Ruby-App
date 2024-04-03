import { configureStore } from '@reduxjs/toolkit';
import shopAndHost, { IShopAndHostState } from './reducers/shopAndHost';


export interface IRootState {
	shopAndHost: IShopAndHostState
}

export const store = configureStore({
	reducer: {
		shopAndHost: shopAndHost,
	},
});

export default store;