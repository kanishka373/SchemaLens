import axios from 'axios'

const BASE_URL = '/api'

export const connectAndFetch = async (config) => {
  // Test connection
  const connectRes = await axios.post(`${BASE_URL}/connect`, config)
  if (!connectRes.data.success) {
    throw new Error(connectRes.data.message)
  }

  // Fetch all data in parallel
  const params = {
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database
  }
const [tablesRes, relationshipsRes, statsRes] = await Promise.all([
    axios.get(`${BASE_URL}/tables`, { params }),
    axios.get(`${BASE_URL}/relationships`, { params }),
    axios.get(`${BASE_URL}/stats`, { params })
  ])

  console.log('Stats:', statsRes.data)  // ← yeh add kar

  return {
    tables: tablesRes.data.data,
    relationships: relationshipsRes.data.data,
    stats: statsRes.data.data
  }
 
}