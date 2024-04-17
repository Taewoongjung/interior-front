import axios from "axios";

const fetcher = async (url: string) => await axios.get(url, {
    headers: {
        Authorization: localStorage.getItem("interiorjung-token"),
        withCredentials: true
    },
}).then((response) => {

    console.log("token = ", localStorage.getItem("interiorjung-token"));
    console.log(response.data);

    return response.data;
}).catch((error) => {
    if (error.response.status === 403) {
        window.location.href = '/auth';
    }
});

export default fetcher;