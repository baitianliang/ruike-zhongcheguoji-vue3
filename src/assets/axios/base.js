import axios from '../js/base_axios'
const Qs = require('qs');

export default {
    getTableData(viewName) {
        return axios.get(`report/getPscPictureData?viewName=${viewName}`)
    },
}