# Phil's Magical Web3 CrYpT0bl0g

## Summary

This is a full stack web3 blog and CMS that sits on the blockchain. I had the help of this wonderful tutorial to help me get things off the ground: [The Complete Guide To Full Stack Web3 Development](https://dev.to/dabit3/the-complete-guide-to-full-stack-web3-development-4g74). Portions of that article have been included in this readme to ensure that the vital instructions there are preserved alongside this code.

## Local Development

To deploy the app:

1. Clone this repository

```sh
git clone git@github.com:philspins/full-stack-web3.git
```

2. Install the dependencies

```sh
npm install
```

3. Run the local node

```sh
npx hardhat node
```

*** If issues are encountered at this stage, comment out the following lines in hardhat.config.js:

```js
mumbai: {
  url: "https://rpc-mumbai.matic.today",
  accounts: [process.env.pk]
},
```

4. Deploy to localhost

```sh
npx hardhat run scripts/deploy.js --network localhost
```

5. Run the app in development mode

```sh
npm run dev
```

6. To run a production build, run the following commands:

```sh
npm run build && npm start
```


## Deploying to the Polygon Test Network

1. Export the private key for the test account (Account #0 from the output of `npx hardhat node` in the previous section):
```
export pk="test-account-#0-private-key"
```

2. Ensure that the Mumbai configuration in hardhat.config.js is uncommented:

```js
// mumbai: {
//   url: "https://rpc-mumbai.matic.today",
//   accounts: [process.env.pk]
// },
```

3. To deploy to Polygon testnet, run the following command:
```
npx hardhat run scripts/deploy.js --network mumbai
```

4. Then update the environment variables in .env.local to be `testnet`:
```
ENVIRONMENT="testnet"
NEXT_PUBLIC_ENVIRONMENT="testnet"
```

5. Restart the server to register the change in environment variables:
```
npm run dev
```

## Deploying to The Graph (Creating a Subgraph)

### Creating the project in The Graph
1. To get started, visit [The Graph](://thegraph.com/explorer/dashboard) hosted service and either sign in or create a new 
account. 
2. Next, go to the dashboard and click on Add Subgraph to create a new subgraph.

### Initializing a new subgraph using the Graph CLI
1. Next, install the Graph CLI:

```shell
$ npm install -g @graphprotocol/graph-cli
```

2. Run the following command to deploy the subgraph.  <ACCESS_TOKEN> can be found 
```shell
$ graph auth https://api.thegraph.com/deploy/ <ACCESS_TOKEN>
$ cd subgraph
$ yarn deploy
```