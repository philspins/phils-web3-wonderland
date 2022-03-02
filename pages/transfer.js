import { useState, useRef, useEffect } from 'react' // new
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { css } from '@emotion/css'
import { ethers } from 'ethers'
import { create } from 'ipfs-http-client'

/* import contract address and contract owner address */
import {
  contractAddress
} from '../config'

import Blog from '../contracts/Blog.json'

const initialState = { address: '' }

function CreatenewAddress() {
  /* configure initial state to be used in the component */
  const [props, setProps] = useState(initialState)
  // const { address } = props

  function onChange(e) {
    setProps(() => ({ ...props, [e.target.name]: e.target.value }))
    console.log(props.address)
  }

  async function setAddress() {
    /* transfer ownership of smart contract to newAddress  */
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, Blog.abi, signer)
      console.log('contract: ', contract)
      try {
        console.log("Transferring ownership to: " + props.address)
        const val = await contract.transferOwnership(props.address)

        // optional - wait for transaction to be confirmed before rerouting
        await provider.waitForTransaction(val.hash)
        console.log('val: ', val)
      } catch (err) {
        console.log('Error: ', err)
      }
    }    
  }

  return (
    <div className={container}>
      <div>
        <input
          name='address'
          placeholder='input new owner address here'
          value={props.newAddress}
          className={tagsStyle}
          onChange={onChange}
        />
      </div>
      <div className={buttonContainer}>
        <button className={button} type='button' onClick={setAddress}>Transfer</button>
      </div>
    </div>
  )
}

const titleStyle = css`
  padding: 15px;
  margin-top: 15px;
  border: none;
  outline: none;
  width: 100%;
  background-color: #eaeaea;
  color: #444444;
  border-width: 5px;
  font-size: 44px;
  font-weight: 600;
  &::placeholder {
    color: #888888;
  }
`

const tagsStyle = css`
  padding: 15px;
  margin-top: 15px;
  margin-right: 40px;
  width: 100%;
  border: none;
  outline: none;
  background-color: #eaeaea;
  color: #444444;
  border-radius: 5px;
  font-size: 18px;
  font-weight: 600;
  &::placeholder {
    color: #888888;
  }
`

const mdEditor = css`
  padding: 5px;
  margin-top: 15px;
  border: 10px black;
  background-color: #eaeaea;
  color: #444444;
  border-radius: 5px;
  font-size: 18px;
  font-weight: 600;
`

const container = css`
  background-color: #ffffff;
  padding: 20px;
  width: 75%;
  margin: 0 auto;
  border-radius: 15px;  
`

const buttonContainer = css`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`

const button = css`
  background-color: #fafafa;
  outline: none;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  padding: 16px 70px;
  margin-right: 10px;
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 18px;
  box-shadow: 7px 7px rgba(0, 0, 0, .1);
  justify-content: flex-end;
`

export default CreatenewAddress