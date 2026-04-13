const dns = require('dns');
const { Client } = require('pg');

const hostname = 'ep-polished-queen-amh5d0u6.c-5.us-east-1.aws.neon.tech';

dns.lookup(hostname, (err, address, family) => {
  if (err) {
    console.error('DNS Lookup failed:', err);
    return;
  }
  console.log('Resolved Address:', address);
  console.log('Family: IPv', family);

  const connectionString = `postgresql://neondb_owner:npg_rYbp7T4hcaIX@${address}/neondb?sslmode=require`;
  const client = new Client({ connectionString });

  client.connect()
    .then(() => {
      console.log('Connected successfully with IP!');
      return client.query('SELECT NOW()');
    })
    .then(res => {
      console.log('Server time:', res.rows[0].now);
      client.end();
    })
    .catch(err => {
      console.error('Connection with IP failed:', err.message);
    });
});
