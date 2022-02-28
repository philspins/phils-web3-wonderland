import { useState, useRef, useEffect } from 'react' // new
import { useRouter } from 'next/router'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { css } from '@emotion/css'
import { ethers } from 'ethers'
import { create } from 'ipfs-http-client'

/* import contract address and contract owner address */
import {
  contractAddress
} from '../config'

import Blog from '../contracts/Blog.json'

/* define the ipfs endpoint */
const client = create('https://ipfs.infura.io:5001/api/v0')

/* configure the markdown editor to be client-side import */
const SimpleMDE = dynamic(
  () => import('react-simplemde-editor'),
  { ssr: false }
)

const initialState = { title: '', content: '' }

function CreatePost() {
  /* configure initial state to be used in the component */
  const [post, setPost] = useState(initialState)
  const [image, setImage] = useState(null)
  const [loaded, setLoaded] = useState(false)

  const fileRef = useRef(null)
  const { title, content, tags } = post
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      /* delay rendering buttons until dynamic import is complete */
      setLoaded(true)
    }, 500)
  }, [])

  function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }))
  }

  async function createNewPost() {   
    /* saves post to ipfs then anchors to smart contract */
    if (!title || !content) return
    const hash = await savePostToIpfs()
    await savePost(hash)
    router.push(`/`)
  }

  async function savePostToIpfs() {
    /* save post metadata to ipfs */
    try {
      const added = await client.add(JSON.stringify(post))
      return added.path
    } catch (err) {
      console.log('error: ', err)
    }
  }

  async function savePost(hash) {
    /* anchor post to smart contract */
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, Blog.abi, signer)
      console.log('contract: ', contract)
      try {
        const val = await contract.createPost(post.title, hash, post.tags)
        
        // optional - wait for transaction to be confirmed before rerouting
        await provider.waitForTransaction(val.hash)
        console.log('val: ', val)
      } catch (err) {
        console.log('Error: ', err)
      }
    }    
  }

  function triggerOnChange() {
    /* trigger handleFileChange handler of hidden file input */
    fileRef.current.click()
  }

  async function handleFileChange (e) {
    /* upload cover image to ipfs and save hash to state */
    const uploadedFile = e.target.files[0]
    if (!uploadedFile) return
    const added = await client.add(uploadedFile)
    setPost(state => ({ ...state, coverImage: added.path }))
    setImage(uploadedFile)
  }

  return (
    <div className={container}>
      {
        image && (
          <Image className={coverImageStyle} 
                 src={URL.createObjectURL(image)}
                 alt="cover image" />
        )
      }
      <div>
        <input
          name='title'
          placeholder='captivating title'
          value={post.title}
          className={titleStyle}
          onChange={onChange}
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
          onChange={onChange}
        />
      </div>
      <div className={buttonContainer}>
        {
          loaded && (
            <>
              <button className={button} type='button' onClick={createNewPost}>Publish</button>
              <button  className={button} onClick={triggerOnChange}>Add cover image</button>
            </>
          )
        }
        <input
          id='selectImage'
          className={hiddenInput} 
          type='file'
          onChange={handleFileChange}
          ref={fileRef}
        />
      </div>
    </div>
  )
}

const hiddenInput = css`
  display: none;
`

const coverImageStyle = css`
  max-width: 800px;
`

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

export default CreatePost