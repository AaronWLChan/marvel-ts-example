import { MarvelAPI } from 'marvel-ts'

/**
 * Provide public key.
 */
const api = new MarvelAPI(process.env.REACT_APP_PUBLIC_KEY!)

export default api
