import axios from "axios";
import config from "./config/index.js"

export default (devicePath, state, params) => {
    const requestPath = `http://${config.device}:${config.port}/${devicePath}`;
    return axios.post(requestPath, {
        state: state,
        params: params
    });
}