import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import { css } from '@emotion/css'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { ethers } from 'ethers'
import { create } from 'ipfs-http-client'

import {
  contractAddress
} from '../../config'
import Blog from '../../contracts/Blog.json'

const ipfsURI = 'https://ipfs.io/ipfs/'
const client = create('https://ipfs.infura.io:5001/api/v0')

const SimpleMDE = dynamic(
  () => import('react-simplemde-editor'),
  { ssr: false }
)

export default function Post() {
  const [post, setPost] = useState(null)
  const [editing, setEditing] = useState(true)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    fetchPost()
  }, [id])

  async function fetchPost() {
    /* we first fetch the individual post by ipfs hash from the network */
    if (!id) return
    let provider
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'local') {
      provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
    } else if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'testnet') {
      provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.matic.today')
    } else {
      provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com/')
    }
    const contract = new ethers.Contract(contractAddress, Blog.abi, provider)
    const val = await contract.fetchPost(id)
    const postId = val[0].toNumber()

    /* next we fetch the IPFS metadata from the network */
    const ipfsUrl = `${ipfsURI}/${id}`
    const response = await fetch(ipfsUrl)
    const data = await response.json()
    if(data.coverImage) {
      let coverImagePath = `${ipfsURI}/${data.coverImage}`
      data.coverImagePath = coverImagePath
    }
    /* finally we append the post ID to the post data */
    /* we need this ID to make updates to the post */
    data.id = postId;
    setPost(data)
  }

  async function savePostToIpfs() {
    try {
      const added = await client.add(JSON.stringify(post))
      return added.path
    } catch (err) {
      console.log('error: ', err)
    }
  }

  async function updatePost() {
    const hash = await savePostToIpfs()
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, Blog.abi, signer)
    await contract.updatePost(post.id, post.title, hash, post.tags, true)
    // await contract.updatePost(post.id, post.title, Date.now(), post.tags, hash, true)
    router.push('./')
  }

  if (!post) return null

  return (
    <div className={container}>
      {
      /* editing state will allow the user to toggle between */
      /*  a markdown editor and a markdown renderer */
      }
      {
        editing && (
          <div>
            <input
              name='title'
              placeholder='captivating title'
              value={post.title}
              className={titleStyle}
              onChange={e => setPost({ ...post, title: e.target.value })}
            />
            <SimpleMDE
              name='content'
              value={post.content}
              className={mdEditor}
              onChange={value => setPost({ ...post, content: value })}
            />
            <input
              name='tags'
              placeholder='tags, go, here'
              value={post.tags}
              className={tagsStyle}
              onChange={value => setPost({ ...post, tags: value })}
            />
          </div>
        )
      }
      {
        !editing && (
          <div>
            {
              post.coverImagePath && (
                <Image src={post.coverImagePath} className={coverImageStyle} alt="cover image" />
              )
            }
            <div className={contentContainer}>
              <h1 className={title}>{post.title}</h1>
              <ReactMarkdown>{post.content}</ReactMarkdown>
              <p>Tags: {post.tags}</p>
            </div>
          </div>
        )
      }
      <div className={buttonContainer}>
        {
          editing && (
            <button className={button} onClick={updatePost}>Update post</button>
          )
        }
        <button className={button} onClick={() => setEditing(editing ? false : true)}>{ editing ? 'View post' : 'Edit post'}</button>
      </div>
    </div>
  )
}

const coverImageStyle = css`
  width: 75%;
`

const title = css`
  margin: 0;
`

const titleStyle = css`
  padding: 15px;
  margin-top: 15px;
  border: none;
  outline: none;
  width: 100%;
  background-color: #eaeaea;
  color: #444444;
  border-radius: 5px;
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

const contentContainer = css`
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  & img {
    max-width: 900px;
  }
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