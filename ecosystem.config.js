module.exports = {
  apps: [{
    name: 'bamBackend',
    script: './index.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-13-210-197-204.ap-southeast-2.compute.amazonaws.com',
      key: '~/.ssh/bensonMooch.pem',
      ref: 'origin/master',
      repo: 'git@github.com:harrypatrick94/bamBackend.git',
      path: '/home/ubuntu/bamBackend',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}
