import '../styles/globals.css'
import { useState } from 'react'
import { css } from '@emotion/css'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Link from 'next/link'
import { AccountContext } from '../context.js'
import { ownerAddress } from '../config'
import 'easymde/dist/easymde.min.css'

function MyApp({ Component, pageProps }) {
  const scriptTxt = `
  (function () {
    const { pathname } = window.location
    const ipfsMatch = /.*\\/Qm\\w{44}\\//.exec(pathname)
    const base = document.createElement('base')

    base.href = ipfsMatch ? ipfsMatch[0] : './'
    document.head.append(base)
  })();
  `

  const [account, setAccount] = useState(null)
  // web3Modal configuration for enabling wallet access
  async function getWeb3Modal() {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: false,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: { 
            infuraId: process.env.NEXT_PUBLIC_INFURA_ID
          },
        },
      },
    })
    return web3Modal
  }

  // the connect function uses web3 modal to connect to the user's wallet
  async function connect() {
    try {
      const web3Modal = await getWeb3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const accounts = await provider.listAccounts()
      setAccount(accounts[0])
    } catch (err) {
      console.log('error:', err)
    }
  }

  return (
    <html>
        <head>
            <script dangerouslySetInnerHTML={{__html: scriptTxt}}/>
        </head>
        <body>
          <div>
            <nav className={nav}>
              <div className={header}>
                <div className={logo} />
                <Link href="/">
                  <a>
                    <div className={titleContainer}>
                      <h1 className={title}>Phil&apos;s Magical Web3 Wonderland</h1>
                      <h2 className={description}>straight from the block... chain</h2>
                    </div>
                  </a>
                </Link>
                {
                  !account && (
                    <div className={buttonContainer}>
                      <button className={buttonStyle} onClick={connect}>Login</button>
                    </div>
                  )
                }
                {
                  account && <p className={accountInfo}>{account}</p>
                }
              </div>
              <div className={linkContainer}>
                <Link href="/" >
                  <a className={link}>
                    Home
                  </a>
                </Link>
                {
                  /* if the signed in user is the contract owner, we */
                  /* show the nav link to create a new post */
                  (account === ownerAddress) && (
                    <Link href="/create-post">
                      <a className={link}>
                        Create Post
                      </a>
                    </Link>
                  )
                }
              </div>
            </nav>
            <div className={container}>
              <AccountContext.Provider value={account}>
                <Component {...pageProps} connect={connect} />
              </AccountContext.Provider>
            </div>
          </div>
        </body>
      </html>
  )
}

const accountInfo = css`
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: flex-end;
  font-size: 12px;
`

const container = css`
  padding: 40px;
`

const linkContainer = css`
  display: flex;
  background-color: rgba(255, 255, 255, .75);
  padding: 10px 20px;
  justify-content: center;
`

const nav = css`
  justify-content: center;
  font-weight: 600;
  color: white;
`

const header = css`
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, .075);
  padding: 20px;
`

const logo = css`
  background-image: url("https://storageapi.fleek.co/ea67259b-39f8-4af3-9a70-34d3d524831a-bucket/logo.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 150px;
  height: 100px;
`

const title = css`
  margin-left: 30px;
  margin: 0;
  color: white;
  font-size: 40px;
`

const description = css`
  margin: 0;
  color: white;
`

const titleContainer = css`
  display: flex;
  flex-direction: column;
  padding-left: 15px;
`

const buttonContainer = css`
  width: 100%;
  height: 50px;
  display: flex;
  flex: 1;
  justify-content: flex-end;
`

const buttonStyle = css`
  background-color: #fafafa;
  outline: none;
  border: none;
  font-size: 18px;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 30px;
  padding-right: 30px;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 7px 7px rgba(0, 0, 0, .1);
`

const link = css`
  display: flex;
  padding: 20px;
  background-color: rgba(0, 0, 0, .5);
  border-radius: 10px;
  width: 150px;
  margin: 0px 20px 0px 0px;
  font-size: 16px;
  font-weight: 800;
  color: white;
  align-items: center;
  justify-content: center;
`

export default MyApp