import axios from "axios";

const fetcher = (url: string) => axios.get(url, {
    headers: {
        Authorization: localStorage.getItem("interiorjung-token")
    },
    withCredentials: true,
}).then((response) => {

    console.log("token = ", localStorage.getItem("interiorjung-token"));

    return response.data;
});

export default fetcher;