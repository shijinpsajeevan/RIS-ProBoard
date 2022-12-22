import {configureStore} from "@reduxjs/toolkit";
import {abc} from './storeFilter';

export const store = configureStore({
    reducer:{
        counter1:abc
    }
})