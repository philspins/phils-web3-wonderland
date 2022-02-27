//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Blog {
    struct Post {
        uint id;
        string title;
        string hash;
        string tags;
        bool published;
    }

    string public name;
    address public owner;
    using Counters for Counters.Counter;
    Counters.Counter private _postIds;
    mapping(uint => Post) private idToPost;
    mapping(string => Post) private hashToPost;

    // events facilitate communication between smart contracts and their user interfaces
    // i.e. we can create listeners for events in the client and use them in The Graph
    event PostCreated(uint id, string title, string hash, string tags);
    event PostUpdated(uint id, string title, string hash, string tags, bool published);

    // when the blog is deployed, give it a name
    // also set the creator as the owner of the contract
    constructor(string memory _name) {
        console.log("Deploying Blog with name:", _name);
        name = _name;
        owner = msg.sender;
    }

    function updateName(string memory _name) public {
        name = _name;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }

    // fetches an individual post by the content hash
    function fetchPost(string memory hash) public view returns (Post memory) {
        return hashToPost[hash];
    }

    // creates a new post
    function createPost(string memory title, string memory hash, string memory tags) public onlyOwner {
        _postIds.increment();
        uint postId = _postIds.current();
        Post storage post = idToPost[postId];
        post.id = postId;
        post.title = title;
        post.hash = hash;
        post.tags = tags;
        post.published = true;
        hashToPost[hash] = post;
        emit PostCreated(post.id, post.title, post.hash, post.tags);
    }

    // updates an existing post
    function updatePost(uint postId, string memory title, string memory hash, string memory tags, bool published) public onlyOwner {
        Post storage post = idToPost[postId];
        post.title = title;
        post.hash = hash;
        post.tags = tags;
        post.published = published;
        idToPost[postId] = post;
        hashToPost[hash] = post;
        emit PostUpdated(post.id, post.title, post.hash, post.tags, post.published);
    }

    // fetches all posts
    function fetchPosts() public view returns (Post[] memory posts) {
        uint itemCount = _postIds.current();
        posts = new Post[](itemCount);
        for (uint i = 1; i <= itemCount; i++) {
            Post storage currentItem = idToPost[i];
            posts[i-1] = currentItem;
        }
        return posts;
    }

    // fetches all posts in descending order
    function fetchPostsDescending() public view returns (Post[] memory posts) {
        uint itemCount = _postIds.current();
        uint postsIndex = 0;
        if (itemCount > 0) {
            posts = new Post[](itemCount);
            for (uint i = itemCount; i > 0; i--) {
                uint currentId = i + 1;
                Post storage currentItem = idToPost[currentId];
                posts[postsIndex] = currentItem;
                postsIndex += 1;
            }
            return posts;
        }
    }

    // this modifier means only the contract owner can invoke the function
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}