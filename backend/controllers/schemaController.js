import {testConnection,scanTables,scanRelationships,scanStats
} from '../services/schemaScanner.js';

export const connectDB = async (req, res) => {
  try {
    const { host, port, user, password, database } = req.body;
    await testConnection({ host, port, user, password, database });
    res.json({ success: true, message: 'Connected successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getTables = async (req, res) => {
  try {
    const { host, port, user, password, database } = req.query;
    const tables = await scanTables({ host, port, user, password, database });
    res.json({ success: true, data: tables });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getRelationships = async (req, res) => {
  try {
    const { host, port, user, password, database } = req.query;
    const relationships = await scanRelationships({ host, port, user, password, database });
    res.json({ success: true, data: relationships });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const { host, port, user, password, database } = req.query;
    const stats = await scanStats({ host, port, user, password, database });
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};