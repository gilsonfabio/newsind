import axios from "axios";

export const api = axios.create({
    baseURL: "https://backcaldascard.vercel.app/"
    //baseURL: "https://backdelivery.vercel.app/" 
})

