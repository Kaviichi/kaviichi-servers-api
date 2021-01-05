#

## Development

- Uses prettier for code formatting, it is recommended to install the VS Code Prettier addon with development.

### Getting Started

- Install packages
    ```
    npm install
    ```
- Start the server with nodemon
    ```
    nodemon src/server.ts
    ```
- Run tests
    ```
    npm run test
    ```
- Build the js files
    ```
    npm run build
    ```

### Secrets

To parse secrets into the development environment, you can either:
1. Make the secrets an environment variable if building the server with nodemon `npm i -g nodemon` (example for Linux)
    ```
    DISCORD_CLIENT_SECRET=the-secret-code
    nodemon ./src/server.ts
    ```

or

2. Run the Docker container parsing the secrets at runtime
    ```
    docker build . -t kaviichi-servers
    docker run -p 8080:8080 -e DISCORD_CLIENT_SECRET=the-secret-code kaviichi-servers
    ```
### References
Main resources used to create this project.

- [Restful API with NodeJS, Express & Typescript](https://www.youtube.com/watch?v=vyz47fUXcxU)
- [Deploy To Google Cloud Run Using Github Actions](https://towardsdatascience.com/deploy-to-google-cloud-run-using-github-actions-590ecf957af0)
- [Dockerizing a Node.js web app](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
