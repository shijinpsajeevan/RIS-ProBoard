import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    str_filter_val:[],
    sbs_filter_val:[],
    selected_store:null,
    store_details:[],
    selected_sbs:null
}

export const storeFilter = createSlice({
    name:'counter',
    initialState,
    reducers:{
        set_str_filter_value: (state,action) =>{
            console.log(action.payload,"set_str_filter_value from StoreFilter.js");
            state.str_filter_val = action.payload;
        },
        set_sbs_filter_value: (state,action) =>{
            console.log(action.payload,"set_sbs_filter_value from StoreFilter.js");
            state.sbs_filter_val = action.payload;
        },
        set_selected_store: (state,action) =>{
            console.log(action.payload,"Payload from storeFileter.js");
            state.selected_store = action.payload;
        },
        set_store_details: (state,action) =>{
            console.log(action.payload,"Set store details");
            state.store_details = action.payload;
        },
        set_selected_sbs: (state,action) =>{
            console.log(action.payload,"Payload from storeFileter.js");
            state.selected_sbs = action.payload;
        }
    }
})


//export actions
export const {set_str_filter_value,set_sbs_filter_value,set_selected_store,set_store_details,set_selected_sbs} = storeFilter.actions;

//export reducers
export const abc =  storeFilter.reducer;