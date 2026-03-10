import axios from '../js/base_axios'
const Qs = require('qs');

export default {
    getTableData(query) {
        return axios.get(`report/designDeliverablesListUxjl?${Qs.stringify(query)}`)
    },
    getTable2Data(query) {
        return axios.get(`report/designDeliverablesListUxddli1?${Qs.stringify(query)}`)
    },
    getTable3Data(query) {
        return axios.get(`report/designDeliverablesDataStatistics?${Qs.stringify(query)}`)
    },
    getOptionsList() {
        return axios.get(`report/designDeliverablesDataDictionary`)
    },
}