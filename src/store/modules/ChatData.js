import { createAction, handleActions } from 'redux-actions'

// Dataset for evaluating of generated negatives
import direct_wo_ans from "./datasets/eval_direct_wo_ans.json";
import human from "./datasets/eval_human.json";
import maskandfill from "./datasets/eval_maskandfill.json";
import meta from "./datasets/eval_meta.json";

const dataset_lists = [human, direct_wo_ans, maskandfill, meta]

const ADD_IDX = 'chat/ADD_IDX' // 다음 대화로 이동
const SUB_IDX = 'chat/SUB_IDX' // 이전 대화로 이동
const PREV_STATUS = 'chat/PREV_STATUS' // 이전 대화로 이동
const NEXT_STATUS = 'chat/NEXT_STATUS' // 이전 대화로 이동
const CHANGE_DATASET = 'chat/CHANGE_DATASET'
const SET_RTYPE = 'chat/SET_RTYPE' // Response Type 설정

export const changePrev= createAction(PREV_STATUS)
export const changeNext= createAction(NEXT_STATUS)
export const addIdx= createAction(ADD_IDX)
export const subIdx= createAction(SUB_IDX)
export const changeDataset = createAction(CHANGE_DATASET, data_num => ({ data_num }))
export const setRtype = createAction(SET_RTYPE, object => ({ object }))

const initialState = {
    chatData: dataset_lists[0],
    chatData_length: Object.keys(dataset_lists[0]).length - 1,
    data_idx: 0,
    prev_status: false,
    next_status: true,
    stateOptions: [
        {
            key: 0,
            text: 'Human',
            value: 0
        },
        {
            key: 1,
            text: 'GPT(direct_wo_ans)',
            value: 1
        },
        {
            key: 2,
            text: 'Maskandfill',
            value: 2
        },
        {
            key: 3,
            text: 'GPT(meta)',
            value: 3
        },
    ],
    r_type: Array(Object.keys(dataset_lists[0]).length).fill(new Array(5).fill(-10)),
}

export default handleActions(
    {
        [ADD_IDX]: (state) => ({
            ...state,
            data_idx: state.data_idx + 1
        }),
        [SUB_IDX]: (state) => ({
            ...state,
            data_idx: state.data_idx - 1
        }),
        [PREV_STATUS]: (state) => ({
            ...state,
            prev_status: !state.prev_status
        }),
        [NEXT_STATUS]: (state) => ({
            ...state,
            next_status: !state.next_status
        }),
        [CHANGE_DATASET]: (state, action) => ({
            ...state,
            chatData: dataset_lists[action.payload.data_num],
            chatData_length: Object.keys(dataset_lists[action.payload.data_num]).length - 1,
            data_idx: 0,
            prev_status: false,
            next_status: true,
            r_type: Array(Object.keys(dataset_lists[0]).length).fill(new Array(5).fill(-10)),
        }),
        [SET_RTYPE]: (state, action) => ({
            ...state,
            r_type: state.r_type.map(
                (arr, d_idx) => (d_idx === action.payload.object.d_idx) 
                    ?   arr.map(
                            (type, r_idx) => (r_idx === action.payload.object.r_idx)
                                ?   action.payload.object.type
                                :   type
                            )
                    :   arr
                )
        }),
    },
    initialState
)