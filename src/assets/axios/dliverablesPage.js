import axios from '../js/base_axios'
const Qs = require('qs');

export default {
    getTableData() {
        // return axios.get(`report/designDeliverablesListUxjl?${Qs.stringify(query)}`)
        return axios.get(`report/getPscPictureData?viewName=V_CRHK_JL_LCBJD`)
    },
    getTable2Data() {
        // return axios.get(`report/designDeliverablesListUxddli1?${Qs.stringify(query)}`)
        return axios.get(`report/getPscPictureData?viewName=V_CRHK_DDLI_JFWQD`)
    },
    getTable3Data(query) {
        return axios.get(`report/designDeliverablesDataStatistics?${Qs.stringify(query)}`)
        // return axios.get(`report/getPscPictureData?viewName=V_CRHK_DDLI_BBTJ`)
    },
    getOptionsList() {
        // return axios.get(`report/designDeliverablesDataDictionary`)
        return axios.get(`report/generalDataDictionary`)
    },
}