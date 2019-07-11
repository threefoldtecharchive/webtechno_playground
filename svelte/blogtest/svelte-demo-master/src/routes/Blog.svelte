<script>
  let posts = [];
  let blogInfo = {};
  let newPost = {
	  title: "",
	  body: ""
  };
  function editBlog(e) {
    if (e.key === "Enter") {
      e.target.blur()
      window.gun
        .get("headline")
        .put({ title: blogInfo.title, description: blogInfo.description });
    }
  }
  function handleSubmit(e){
      if (posts[posts.length - 1] != null) {
        newPost.id = posts[posts.length - 1].id + 1;
      } else {
        newPost.id = 0;
	  }
      window.gun.get("posts").set(newPost);
  }
  window.gun.get("headline").on(headLine => {
    blogInfo.title = headLine.title;
    blogInfo.description = headLine.description;
  });
  
  var sveltedoesntworkverywell = [];
  window.gun
    .get("posts")
    .map()
    .on((post, id) => {
		console.log(post, id)
		if (post != null) {
			// posts.push(post); if only this worked in svelte
			post.ref = id
			sveltedoesntworkverywell.push(post);
		} else {
			var index = posts.findIndex(p => {
				return p.ref == id;
			});

			if(index != -1) sveltedoesntworkverywell.splice(index, 1);
		}
		posts = sveltedoesntworkverywell;
    });
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

<input on:keyup={editBlog} class="blog-title" bind:value={blogInfo.title} />
<br />
<input on:keyup={editBlog} class="blog-description" bind:value={blogInfo.description} />
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

<form id="newPost" on:submit|preventDefault={handleSubmit}>
<input class="new-post-title" bind:value={newPost.title} placeholder="Title"/>
<br />
<input class="new-post-body" bind:value={newPost.body} placeholder="Body" />
<button>Save post</button>
</form>
