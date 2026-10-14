import mysql2 from 'mysql2/promise';

const createConnection = async (config) => {
  const connection = await mysql2.createConnection({
    host: config.host,
    port: config.port || 3306,
    user: config.user,
    password: config.password,
    database: config.database,
  });
  return connection;
};

export const testConnection = async (config) => {
  const conn = await createConnection(config);
  await conn.ping();
  await conn.end();
};

export const scanTables = async (config) => {
  const conn = await createConnection(config);

  const [tables] = await conn.query(`
    SELECT TABLE_NAME, TABLE_ROWS, CREATE_TIME
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = ?
    ORDER BY TABLE_NAME
  `, [config.database]);

  const result = [];

  for (const table of tables) {
    const [columns] = await conn.query(`
      SELECT 
        COLUMN_NAME,
        DATA_TYPE,
        IS_NULLABLE,
        COLUMN_KEY,
        COLUMN_DEFAULT,
        EXTRA
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
      ORDER BY ORDINAL_POSITION
    `, [config.database, table.TABLE_NAME]);

    result.push({
      name: table.TABLE_NAME,
      rows: table.TABLE_ROWS,
      createdAt: table.CREATE_TIME,
      columns: columns.map(col => ({
        name: col.COLUMN_NAME,
        type: col.DATA_TYPE,
        nullable: col.IS_NULLABLE === 'YES',
        key: col.COLUMN_KEY,
        default: col.COLUMN_DEFAULT,
        extra: col.EXTRA,
      })),
    });
  }

  await conn.end();
  return result;
};

export const scanRelationships = async (config) => {
  const conn = await createConnection(config);

  const [relationships] = await conn.query(`
    SELECT
      kcu.TABLE_NAME as sourceTable,
      kcu.COLUMN_NAME as sourceColumn,
      kcu.REFERENCED_TABLE_NAME as targetTable,
      kcu.REFERENCED_COLUMN_NAME as targetColumn,
      kcu.CONSTRAINT_NAME as constraintName
    FROM information_schema.KEY_COLUMN_USAGE kcu
    WHERE 
      kcu.TABLE_SCHEMA = ?
      AND kcu.REFERENCED_TABLE_NAME IS NOT NULL
      AND kcu.REFERENCED_TABLE_NAME != ''
  `, [config.database]);

  await conn.end();
  return relationships;
};

export const scanStats = async (config) => {
  const conn = await createConnection(config);

  const [tables] = await conn.query(`
    SELECT TABLE_NAME
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = ?
  `, [config.database]);

  const [columns] = await conn.query(`
    SELECT COUNT(*) as total
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = ?
  `, [config.database]);

  const [relationships] = await conn.query(`
    SELECT TABLE_NAME, COUNT(*) as count
    FROM information_schema.KEY_COLUMN_USAGE kcu
    WHERE kcu.TABLE_SCHEMA = ? 
    AND kcu.REFERENCED_TABLE_NAME IS NOT NULL
    AND kcu.REFERENCED_TABLE_NAME != ''
    GROUP BY TABLE_NAME
    ORDER BY count DESC
  `, [config.database]);

  await conn.end();

  return {
    totalTables: tables.length,
    totalColumns: columns[0].total,
    totalRelationships: relationships.length,
    mostConnectedTable: relationships[0]?.TABLE_NAME || 'None',
  };
};