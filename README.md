# Phil's Magical Web3 Wonderland


## Summary

This is a full stack web3 blog and CMS that sits on the blockchain. I had the help of this wonderful tutorial to help me get things off the ground: [The Complete Guide To Full Stack Web3 Development](https://dev.to/dabit3/the-complete-guide-to-full-stack-web3-development-4g74). Portions of that article have been included in this readme to ensure that the vital instructions there are preserved alongside this code.

## Local Development

To run the app locally for development purposes, follow these steps:

1. Clone this repository

```sh
git clone git@github.com:philspins/phils-web3-wonderland.git
```

2. Install the dependencies

```sh
npm install
```

3. Export the private key for the Mumbai test account (can retrieve with `npx hardhat node`)

```shell
$ export pk="test-account-#0-private-key"
```

4. Run the local node

```sh
npx hardhat node
```

5. Deploy the contract to local hardhat

```shell
$ npx hardhat run scripts/deploy.js --network localhost
```

6. Run the app in development mode

```shell
$ npm run dev
```

The app is now live on `http://localhost:3000` and will auto-watch & recompile any changes made.

## Deploying to Mumbai Test Network

1. To deploy to Polygon testnet, run the following command:

```shell
$ npx hardhat run scripts/deploy.js --network mumbai
```

2. Then update the environment variables (these are used by the Next.js app) in .env.local to be `testnet`:

```shell
ENVIRONMENT="testnet"
NEXT_PUBLIC_ENVIRONMENT="testnet"
```

3. If you are already running a dev instance, restart it to register the change in environment variables:

```shell
$ npm run dev
```

## Deploying to Polygon Main Network

1. Export the private key for your main wallet.  Make sure that this wallet has some MATIC tokens. 
!!! Do NOT share this key with !!
!!! Do NOT save this key to source control !!
```
export pk="mainnet-wallet-with-MATIC-tokens"
```

2. To deploy to Polygon mainnet, run the following command:

```shell
$ npx hardhat run scripts/deploy.js --network polygon
```

3. Then update the environment variables in .env.local to be `mainnet`:

```shell
ENVIRONMENT="mainnet"
NEXT_PUBLIC_ENVIRONMENT="mainnet"
```

4. If you are already running a dev instance, restart it to register the change in environment variables:

```shell
$ npm run dev
```

## Deploying to The Graph

### Creating the project in The Graph

1. To get started, visit The Graph's [hosted service dashboard](https://thegraph.com/hosted-service/dashboard) and either sign in or create a new 
account. 
2. Next, go to the dashboard and click on Add Subgraph to create a new subgraph.


### Deploy subgraph using the Graph CLI

1. Next, install the Graph CLI:

```shell
$ npm install -g @graphprotocol/graph-cli
```

2. Update subgraph.yaml with the current contract address and it's startBlock value.  You can find the start block by searching for the contract address using [Polygon Scan](https://polygonscan.com/)

```yaml
source:
      address: "0xCurrentAddress"
      startBlock: 123456
```

3. Run the following command to deploy the subgraph. Your <ACCESS_TOKEN> can be found by logging into The Graph and opening the [hosted service dashboard](https://thegraph.com/hosted-service/dashboard) 
.
```shell
$ graph auth https://api.thegraph.com/deploy/ <ACCESS_TOKEN>
$ cd subgraph
$ yarn deploy
```

4. Once the deployment is complete, you'll be able to query the API using the URL format below.  You can also find this if you open the subgraph playground from the dashboard.
```
https://api.thegraph.com/subgraphs/name/{graph-username}/{subgraph-name}
```

## Finishing Up

### Fleek

I have chosen to set up my CI/CD through [Fleek](https://fleek.co). You can login to Fleek using your GitHub account and easily have it pull your repo and build it.

1. Login to [Fleek](https://fleek.co)
2. Click `Add New Site`
3. Click `Connect with Github`
4. Select the repo for this project and hit Continue
5. Select IPFS for the Hosting Service and hit Continue
6. Under `Basic Build Settings` Click on `Show Advanced`
7. Add three environment variables:
   1. ENVIRONMENT="mainnet"
   2. NEXT_PUBLIC_ENVIRONMENT="mainnet"
   3. pk="mainnet-wallet-with-MATIC-tokens"
8. Click `Deploy Site`

With any luck, in a few minutes your site will be live on Fleek!  WHen you open the dashboard for your site, there will be a link right at the top of the page to load open your deployment.  They use Docker style container naming such as 'shrill-pond-1234'.

Further down the page, you will also see the `Current IPFS Hash`.  Copy this value, this is what you will configure as our website location in Unstoppable Domains.

### Domain Registration

The final piece of this project is to setup an NFT domain through [Unstoppable Domains](https://unstoppabledomains.com/).  This part is optional, but I thought it was a nice finishing touch.  

1. Think up a unique domain name 
2. Go to the [marketplace](https://unstoppabledomains.com/search) to purchase a domain
   1. There are three different types of tokens (and networks) to choose from: Ethereum, Polygon and Zilliqa
   2. Each type of token has advantages and disadvantages:
      1. I originally chose ZIL before I realized how hard it would be to work with.  I'm not sure what it's advantages are, just liked the extension of `.zil`.
      2. My second choice was Polygon, which is easier to work with and has low fees, but has limited options of what you can do with it when you transfer the domain.  
      3. Ethereum is easiest to deal with but has high transaction fees.
3. Follow the recommended steps to [mint your domain](https://support.unstoppabledomains.com/support/solutions/articles/48001181696-mint-your-domain).  I highly recommend that if you plan to use a hardware wallet, use it from the start.  These pages have info about how to mint on a Ledger:
   1. [How to Mint Domains on a Hardware Wallet](https://support.unstoppabledomains.com/support/solutions/articles/48001185901-how-to-mint-domains-on-a-hardware-wallet)
   2. [Minting with Ledger (Polygon)](https://support.unstoppabledomains.com/support/solutions/articles/48001203751-minting-with-ledger-polygon-)
   3. [Retrieving .zil Domain Transferred to a Ledger Hardware Wallet](https://support.unstoppabledomains.com/support/solutions/articles/48001208652-retrieving-zil-domain-transferred-to-a-ledger-hardware-wallet)
4. Browse to the [My Domains page](https://unstoppabledomains.com/domains).
5. Click on the `Manage` button next to the domain you would like to manage.
6. Click on the `Website` link in the left-hand menu.
7. Click the `Manage Website` button.
8. Enter the IPFS hash you got from Fleek.
9. Click `Launch Website`.
10. Using one of the recommended methods for [browsing to Unstoppable Domains](https://unstoppabledomains.com/learn/where-you-can-view-unstoppable-domains) you can now browse to your website! 