import {configureStore} from "@reduxjs/toolkit";
import {abc,def} from './components/StoreInfo/storeInfoSlice';

export const store = configureStore({
    reducer:{
        counter1:abc
    }
})