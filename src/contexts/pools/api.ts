import axios from 'axios'

const URL = 'http://3.8.192.52:3000/api'

export const PoolsApi = {
  fetchAllPools: () => {
    return axios.get(URL + '/pools', {
      params: {
       limit: 10,
      },
    })
  },
}