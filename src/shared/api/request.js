import { axiosInstance } from "./axiosInstance";

const get = (url) => axiosInstance.get(url).then(res => res.data)

const post = (url, data) => axiosInstance.post(url, data).then(res => res.data)

const del = (url, data) => axiosInstance.delete(url, { data: data }).then(res => res.data)

const put = (url, data) => axiosInstance.put(url, data).then(res => res.data)

export {
    get,
    post,
    del as delete,
    put
}