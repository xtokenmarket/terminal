import axios from 'axios'

type GraphVariables = { [key: string]: string | number | string[] }

export const fetchQuery = async (
  query: string,
  variables: GraphVariables,
  endpoint: string
) => {
  const response = await axios.post(endpoint, { query, variables })
  return response.data.errors ? response.data.errors : response.data.data
}
