import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    count: 0,
}

const initialState1= {
    count1: 0,
}

export const storeInfoSlice = createSlice({
    name:'counter',
    initialState,
    reducers:{
        increment: (state) =>{
            state.count += 1;
        },
        decrement: (state) =>{
            state.count -= 1;
        }
    }
})

export const storeInfoSlice1 = createSlice({
    name:'counter1',
    initialState1,
    reducers:{
        increment1: (state,action) =>{
            state.count1 += 1;
        },
        decrement1: (state,action) =>{
            state.count1 -= 1;
        }
    }
})

//export actions
export const {increment, decrement} = storeInfoSlice.actions;
export const {increment1,decrement1} = storeInfoSlice1.actions;

//export reducers
export const abc =  storeInfoSlice.reducer;
export const def =  storeInfoSlice1.reducer;