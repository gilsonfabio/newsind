import axios from "axios";

export const api = axios.create({
    baseURL: "https://backcaldascard.vercel.app/"
    //baseURL: "https://backdelivery.vercel.app/" 
})

/*
.env
NEXTAUTH_SECRET=fc72ba03-b91a-4277-8218-b6ceef990734
NEXTAUTH_URL=http://localhost:3000
*/