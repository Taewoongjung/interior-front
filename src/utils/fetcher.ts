import axios from "axios";

const fetcher = async (url: string) => await axios.get(url, {
    headers: {
        Authorization: localStorage.getItem("interiorjung-token"),
        withCredentials: true
    },
}).then((response) => {

    console.log("token = ", localStorage.getItem("interiorjung-token"));

    return response.data;
}).catch((error) => {
    console.log("swr error = ", error);
});

export default fetcher;