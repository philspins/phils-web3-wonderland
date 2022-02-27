import { css } from '@emotion/css'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import Link from 'next/link'
import { AccountContext } from '../context'

/* import contract address and contract owner address */
import {
  contractAddress, ownerAddress
} from '../config'

/* import Application Binary Interface (ABI) */
import Blog from '../artifacts/contracts/Blog.sol/Blog.json'

export default function Home(props) {
  /* posts are fetched server side and passed in as props */
  /* see getServerSideProps */
  const { posts } = props
  const account = useContext(AccountContext)

  const router = useRouter()
  async function navigate() {
    router.push('/create-post')
  }

  function postListVisible() {
    if(posts && !posts.length) return invisible;
    return postList;
  }

  return (
    <div className={body}>
      <div className={postListVisible()}>
        {
          /* map over the posts array and render a button with the post title */
          posts.map((post, index) => (
            post[2] != "" && (
              <div>
                <div className={postContainer}>
                  <Link href={`/post/${post[3]}`} key={index}>
                    <a className={postTitle}>{post[1]}</a>
                  </Link>
                  <p className={postSummary}>Tags: {post[2]}</p><br />
                </div>
              </div>
            )
          ))
        }
      </div>
        {
          (account === ownerAddress) && posts && !posts.length && (
            /* if the signed in user is the account owner, render a button */
            /* to create the first post */
            <button className={buttonStyle} onClick={navigate}>
              Create your first post
            </button>
          )
        }
    </div>
  )
}

export async function getServerSideProps() {
  /* here we check to see the current environment variable */
  /* and render a provider based on the environment we're in */
  let provider
  if (process.env.ENVIRONMENT === 'local') {
    provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')    
  } else if (process.env.ENVIRONMENT === 'testnet') {
    provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.matic.today')
  } else {
    provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com/')
  }

  const contract = new ethers.Contract(contractAddress, Blog.abi, provider)
  const data = await contract.fetchPostsDescending()
  return {
    props: {
      posts: JSON.parse(JSON.stringify(data))
    }
  }
}

const body = css`
  display: flex;
  justify-content: center;
`

const postTitle = css`
  font-size: 30px;
  font-weight: bold;
  margin: 0;
  padding: 20px;
`

const invisible = css`
  visibility: none !important;
`

const postList = css`
  width: 75%;
  margin: 0 auto;
  padding-top: 30px;
  padding-bottom: 10px;
  padding-right: 20px;
  padding-left: 20px;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 10px;
`

const postContainer = css`
  background-color: #eaeaea;
  padding-top: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
`

const postSummary = css`
  cursor: pointer;
  margin: 0;
  padding: 20px;
`

const buttonStyle = css`
  display: flex;
  justify-content: center;
  margin-top: 100px;
  background-color: #fafafa;
  outline: none;
  border: none;
  font-size: 44px;
  padding: 20px 70px;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 7px 7px rgba(0, 0, 0, .1);
`
