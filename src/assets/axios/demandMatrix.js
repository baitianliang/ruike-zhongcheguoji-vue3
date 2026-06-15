import axios from '../js/base_axios'
const Qs = require('qs');

export default {
    getTableData() {
        // ?${Qs.stringify(query)}
        return axios.get(`report/getPscPictureData?viewName=UNIFIER_CRHK_XQJZ`)
    },
    getOptionsList() {
        return axios.get(`report/generalDataDictionary`)
    },
    // 未用到
    getEcharsData() {
        return axios.get(`report/inputsBarChart`)
    },
}