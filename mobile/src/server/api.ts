import axios from "axios"

export const api = axios.create({
  baseURL: "http://192.YOUR.IP.0:3333",
})