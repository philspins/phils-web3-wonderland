import ReactMarkdown from 'react-markdown'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { css } from '@emotion/css'
import { ethers } from 'ethers'
import { AccountContext } from '../../context'

/* import contract and owner addresses */
import {
  contractAddress, ownerAddress
} from '../../config'
import Blog from '../../artifacts/contracts/Blog.sol/Blog.json'

const ipfsURI = 'https://ipfs.io/ipfs/'

export default function Post({ post }) {
  const account = useContext(AccountContext)
  const router = useRouter()
  const { id } = router.query

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <div className={container}>
      {
        post && (
          <div>
            {
              /* if the post has a cover image, render it */
              post.coverImage && (
                <Image src={post.coverImagePath} className={coverImageStyle} alt="cover image" />
              )
            }
            <div className={contentContainer}>
              <h1 className={title}>{post.title}</h1>
              <ReactMarkdown>{post.content}</ReactMarkdown>
              <br />
              <p>Tags: {post.tags}</p>
            </div>
          </div>
        )
      }
      <div className={buttonContainer}>
      {
        /* if the owner is the user, render an edit button */
        ownerAddress === account && (
          <div className={button}>
            <Link href={`/edit-post/${id}`}>Edit post</Link>
          </div>
        )
      }
      </div>
    </div>
  )
}

export async function getStaticPaths() {
  /* here we fetch the posts from the network */
  let provider
  if (process.env.ENVIRONMENT === 'local') {
    provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
  } else if (process.env.ENVIRONMENT === 'testnet') {
    provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.matic.today')
  } else {
    provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com/')
  }

  const contract = new ethers.Contract(contractAddress, Blog.abi, provider)
  const data = await contract.fetchPosts()

  /* then we map over the posts and create a params object passing */
  /* the id property to getStaticProps which will run for ever post */
  /* in the array and generate a new page */
  const paths = data.map(d => ({ params: { id: d[2] } }))

  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps({ params }) {
  /* using the id property passed in through the params object */
  /* we can us it to fetch the data from IPFS and pass the */
  /* post data into the page as props */
  const { id } = params
  const ipfsUrl = `${ipfsURI}/${id}`
  const response = await fetch(ipfsUrl)
  const data = await response.json()
  if(data.coverImage) {
    let coverImage = `${ipfsURI}/${data.coverImage}`
    data.coverImage = coverImage
  }

  return {
    props: {
      post: data
    },
  }
}

const coverImageStyle = css`
  width: 900px;
`

const container = css`
  width: 75%;
  margin: 0 auto;
`

const buttonContainer = css`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`

const title = css`
  margin: 0;
`


const tagsLabel = css`
  padding: 5px;
  margin-bottom: 10px;
`

const contentContainer = css`
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  & img {
    max-width: 900px;
  }
`

const button = css`
  background-color: #fafafa;
  outline: none;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  margin-right: 10px;
  margin-top: 15px;
  font-size: 18px;
  padding: 16px 70px;
  box-shadow: 7px 7px rgba(0, 0, 0, .1);
  justify-content: flex-end;
`