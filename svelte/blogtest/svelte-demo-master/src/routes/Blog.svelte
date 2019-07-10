<script context="module">
  let posts = [];
  let blogInfo = {};
  let title;
  let description;
  function editBlog(e) {
    if (e.key === "Enter") {
	  console.log(blogInfo);
	  window.gun.get("headline").put({title:title, description:description})
    }
  }
  export function preload() {
    // return fetch('https://sapper-template.now.sh/blog.json')
    // return fetch('http://localhost:5000/blog.json')
    // 	.then(r => r.json())
    // 	.then(arr => {
    // 		posts = arr;
    // 	});
    window.gun.get("headline").on(headLine => {
	  title = headLine.title;
	  description = headLine.description;
    });
    posts = [];
    window.gun
      .get("posts")
      .map()
      .on(post => {
        posts.push(post);
      });
  }
</script>

<style>
  .blog-title,
  .blog-description {
    max-width: 700px;
    margin: auto;
    text-align: center;
    width: 100%;
    border: none;
  }
  .blog-title {
    font-size: 36px;
  }
</style>

<svelte:head>
  <title>Blog</title>
</svelte:head>

<input on:keyup={editBlog} class="blog-title" bind:value={title} />
<p>Debug: {title}</p>
<br />
<input class="blog-description" bind:value={description} />
<br />
<br />
<br />

<div id="posts">
  {#each posts as post}
    <a href="/blog/{post.id}">{post.title}</a>
    <br />
     {post.body}
    <br />
    <br />
  {/each}
</div>
