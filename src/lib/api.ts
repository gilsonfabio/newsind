import axios from "axios";

export const api = axios.create({
    //baseURL: "https://backcaldascard.vercel.app/"
    baseURL: "http://localhost:3333/" 
})

