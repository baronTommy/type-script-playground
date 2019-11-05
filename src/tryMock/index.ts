import axios from 'axios'

export const request = (p: string) =>  axios.get(p)
