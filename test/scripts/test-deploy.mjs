import {exec } from 'child_process'

exec('npm run deploy', (err, _stdout, stderr) => {
  if (err) {
    console.error(stderr || err?.toString())
    process.exitCode = 1;
  } else {
    console.log('Deploy completed successfully.')
  }
})