const path = require('path');
const Knex = require('knex');
const ms = require('ms');

const knex = Knex({
  client: 'pg',
  connection: process.env.DB_URL,
  pool: { min: 2, max: 10 },
  migrations: { directory: path.join(__dirname, 'migrations') },
  // seeds: { directory: path.join(__dirname, 'seeds') },
  debug: true
});

new Promise((resolve) => setTimeout(resolve, 5000))
  .then(() => knex.migrate.latest())
  .then(async () => {
    // Making a first query to show the setup is working correctly.
    // Will succeed.
    await makeQuery(0);

    // Making a query after 20 minutes of inactivity to catch- the bug.
    // Will fail.
    await makeQuery(ms('20m'));
    // Making a second query immediately after to show how queries after
    // the failing one will succeed.
    // Will succeed.
    await makeQuery(0);
  });

async function makeQuery(delay) {
  await new Promise((resolve) => setTimeout(resolve, delay));

  console.log(`\n\nElapsed: ${delay} ms`);
  await knex
    .select()
    .from('user')
    .where('email', 'example@example.com')
    .then((x) => console.log('Result', x))
    .catch(console.error);
}
