<script context="module">
  let item = {};

  export function preload(req) {
    console.log("~> preload");
    // return load(req.params.title).then(obj => item = obj);
  }
</script>

<script>
  // Comes from App (router)
  export let params = {};
  let post = {title:"", body:""};
  // return fetch(`https://sapper-template.now.sh/blog/${title}.json`).then(r => r.json());

	window.gun
        .get("posts")
        .map()
        .on(p => {
		if (p != null && params.title == p.id) {
            post.gunId = p._["#"];
            post.title = p.title;
			post.body = p.body;
          }
        });
  // Initial value (preload)

  // Reactively update `post` value
  // $: if (params.title) load(params.title).then(obj => { post = obj });

  function deletePost() {
      // console.log("deleting", this.$route.params.uid)
      window.gun
        .get("posts")
        .get(post.gunId)
        .put(null);
      window.location = "/";
    }

</script>

<style>
  /*
		By default, CSS is locally scoped to the component,
		and any unused styles are dead-code-eliminated.
		In this page, Svelte can't know which elements are
		going to appear inside the {{{post.html}}} block,
		so we have to use the :global(...) modifier to target
		all elements inside .content
	*/
  .content :global(h2) {
    font-size: 1.4em;
    font-weight: 500;
  }
  .content :global(pre) {
    background-color: #f9f9f9;
    box-shadow: inset 1px 1px 5px rgba(0, 0, 0, 0.05);
    padding: 0.5em;
    border-radius: 2px;
    overflow-x: auto;
  }
  .content :global(pre) :global(code) {
    background-color: transparent;
    padding: 0;
  }
  .content :global(ul) {
    line-height: 1.5;
  }
  .content :global(li) {
    margin: 0 0 0.5em 0;
  }
</style>

<svelte:head>
  <title>{post.title}</title>
</svelte:head>

<h1>{post.title}</h1>

<div class="content">
  {post.body}
</div>

<button on:click="{deletePost}">Delete</button>