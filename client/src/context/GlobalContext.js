import React, {createContext, useContext, useReducer, useEffect} from 'react';
import axios from 'axios';

//estado inicial

const initialState = {
    user:null,
    fetchingUser: true,
    completeToDos: [],
    incpompleteToDos:[],
}

//reducer

const globalReducer = (state, action) => {

    switch(action.type) {
        case "SET_USER":
        return{
            ...state,
            user: action.payload,
            fetchingUser: false,
        };
        case "SET_COMPLETE_TODOS":
            return {
                ...state,
                completeToDos: action.payload
            };
            case "SET_IMCOMPLETE_TODOS":
                return {
                    ...state,
                    incompleteToDos: action.payload
                };
        case "RESET_USER":
            return {
                ...state,
                user:null,
                completeToDos:[],
                incompleteToDos: false,
                fetchingUser: false,
            }

        default:
            return state;
    }
}


//create context


export const GlobalContext = createContext(initialState);

//provider

export const GlobalProvider = (props) =>{
    const [state, dispatch] = useReducer(globalReducer, initialState);

    useEffect(() =>{
        getCurrentUser();
    }, []);

    //get current usuario
    const getCurrentUser = async () => {
        try{
            const res = await axios.get("/api/auth/current");
            
            if(res.data) {
                const ToDosRes = await axios.get("/api/auth/current");
                if(ToDosRes.data) {
                    dispatch({type:"SET_USER", payload: res.data });
                    dispatch({type:"SET_COMPLETE_TODOS", payload: ToDosRes.data.complete,});
                    dispatch({type:"SET_INCOMPLETE_TODOS", payload: ToDosRes.data.incomplete,});
                };

            } else {
                dispatch({type: "RESET_USER"});
            }
        } catch (err) {
            console.log(err);
            dispatch({type: "RESET_USER"});
        }
    };

    const logout = async () => {
        try{
            await axios.put("/api/auth/logout");

            dispatch({type: "RESET_USER"});
        } catch (err){
            console.log(err);
            dispatch({type: "RESET_USER"});
        }
    };

    const value = {
        ...state,
        getCurrentUser,
        logout,
    };

    return (
        <GlobalContext.Provider value={value}>
            {props.children}
        </GlobalContext.Provider>
    );
 };


 export function useGlobalContext() {
    return useContext(GlobalContext);
 };