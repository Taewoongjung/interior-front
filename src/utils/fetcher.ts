import axios from "axios";

const fetcher = async (url: string) => await axios.get(url, {
    headers: {
        Authorization: localStorage.getItem("interiorjung-token"),
        withCredentials: true
    },
}).then((response) => {
    const token = localStorage.getItem("interiorjung-token");
    if (token == null) {
        window.location.reload();
    }

    return response.data;
}).catch((error) => {
    if (error.response.status === 401) {
        window.location.href = '/auth';
    }
});

export default fetcher;
