/*
 here you can define dev specific configurations
 */
export const environment = {
  production: false,
  clientid: '69af424226e15a6396dd',
  clientsecret: '683d05837403207f247939ab21668065352b65db',
  api: {
    user: 'https://api.github.com/users/{username}?{auth}',
    repos: 'https://api.github.com/users/{username}/repos?{auth}',
    readme: 'https://api.github.com/repos/{username}/{repo}/readme?{auth}',
    organisation: 'https://api.github.com/orgs/{organisation}/members?{auth}'
  }
};

