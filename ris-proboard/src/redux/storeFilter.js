import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    str_filter_val:[],
    sbs_filter_val:[],
    selected_store:null,
    store_details:[],
    selected_sbs:null,
    str_Intel_hr_zoom:false,
    str_adv_filter:false,
    str_sDate:null,
    str_eDate:null
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
        },
        set_str_Intel_hr_zoom:(state,action)=>{
            console.log(action.payload,"ZoomLevel");
            state.str_Intel_hr_zoom = action.payload;
        },
        set_str_adv_filter:(state,action)=>{
            console.log(action.payload,"Start Adv filter");
            state.str_adv_filter = action.payload;
        },
        set_str_sDate:(state,action)=>{
            console.log(action.payload,"Start Date Filter");
            state.str_sDate = action.payload;
        },
        set_str_eDate:(state,action)=>{
            console.log(action.payload,"End Date Filter");
            state.str_eDate = action.payload;
        }
    }
})


//export actions
export const {set_str_filter_value,set_sbs_filter_value,set_selected_store,set_store_details,set_selected_sbs,set_str_Intel_hr_zoom,set_empstatData,set_str_adv_filter,set_str_sDate,set_str_eDate} = storeFilter.actions;

//export reducers
export const abc =  storeFilter.reducer;