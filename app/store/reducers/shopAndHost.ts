import {createSlice} from '@reduxjs/toolkit';


export interface IShopAndHostState {
	shop: string;
	host: string;
}

let params = new URLSearchParams('');
if (!(typeof document === "undefined")) {
	params = new URLSearchParams(window.location.search);
}
const initialState: IShopAndHostState = {
  shop: params.get('shop') || "",
  host: params.get('host') || "",
};


export const shopAndHostSlice = createSlice({
	name: 'StoreShopAndHost',
	initialState,

	reducers: {
		setShopAndHost: (state, action) => {
			state.shop = action.payload.shop
      		state.host = action.payload.host
		},
	},
});

export const {
	setShopAndHost,
} = shopAndHostSlice.actions;

export const getShop = (state: IShopAndHostState) => state.shop;
export const getHost = (state: IShopAndHostState) => state.host;

export default shopAndHostSlice.reducer;