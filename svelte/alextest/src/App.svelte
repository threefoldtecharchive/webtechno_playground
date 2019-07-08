<script>
  import Posts from "./posts.svelte";
  import { posts } from "./stores.js";
  import Post from "./Post.svelte";
  import NamedPost from "./NamedPost.svelte";

  let name = "world";
  let posts_value;
  posts.update(() => [
    { title: "My first post", body: "Welcome to my first post" },
    { title: "My second post", body: "Welcome to my second post" }
  ]);
  posts.subscribe(posts => {
	  console.log("posts are updated")
	console.log(posts)
    posts_value = posts;
  });

  function handleSubmit(e) {
	console.log(e)
	let data = new FormData(e.target)
	let tempPost = {};
	tempPost.title = data.get("title")
	tempPost.body = data.get("body")
	posts_value[data.get("id")] = tempPost
	posts.update(() => posts_value)
  }
</script>

<style>
  .with-store {
    color: red;
  }
  .Object {
    color: blue;
  }
</style>
Change posts value
<form on:submit|preventDefault={handleSubmit}>
<label for="id">id</label><input name="id">
<label for="title">title</label><input name="title">
<label for="body">body</label><input name="body">
<button>Save</button>
</form>
<h1>Hello {name}!</h1>

<div class="with-store">
  With store
  {#each posts_value as post}
    <h1> {post.title} </h1>
    <p> {post.body} </p>
  {/each}
</div>

<br />
<br />
<div class="Object">
<!-- HTML Encode! (linter decodes this... be aware) -->
  via &lt;Posts/&gt; object
  <Posts />
</div>

<br />
<br />
<div class="slot">
  via slot with styling
  {#each posts_value as post}
    <Post>
      <h1> {post.title} </h1>
      <p> {post.body} </p>
    </Post>
  {/each}
</div>

<br />
<br />
<div class="slot">
  via slot and named params
  {#each posts_value as post}
    <NamedPost>
	<!-- As you see, the order of the params does not matter.  -->
	<span slot="body">
		{post.body}
	</span>
      <span slot="title">
		{post.title}
	</span>

    </NamedPost>
  {/each}
</div>
