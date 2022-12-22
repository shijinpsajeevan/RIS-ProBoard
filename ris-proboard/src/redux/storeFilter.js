import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    count: 0,
    str_filter_val:[],
    sbs_filter_val:null,
}

export const storeFilter = createSlice({
    name:'counter',
    initialState,
    reducers:{
        increment: (state,action) =>{
            console.log(action);
            state.count += 1;
        },
        decrement: (state,action) =>{
            state.count -= 1;
        },
        set_str: (state,action) =>{
            console.log(action.payload);
            state.str_filter_val = action.payload;
        }
    }
})


//export actions
export const {increment, decrement,set_str} = storeFilter.actions;

//export reducers
export const abc =  storeFilter.reducer;