import axios from '../js/base_axios'
const Qs = require('qs');

export default {
    getTableData(query) {
        return axios.get(`report/inputsList?${Qs.stringify(query)}`)
    },
    getOptionsList() {
        return axios.get(`report/inputsDataDictionary`)
    },
    // 未用到
    getEcharsData() {
        return axios.get(`report/inputsBarChart`)
    },
}