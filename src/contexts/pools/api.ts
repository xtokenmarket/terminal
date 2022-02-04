import axios from 'axios'

export const PoolsApi = {
  fetchAllPools: () => {
    // return axios.get('https://terminal.xtokenapi.link/api/pools')
    return axios.get('https://terminal.xtokenapi.link/api/pools?offset=0&limit=10&userAddress=it ')
  },
}