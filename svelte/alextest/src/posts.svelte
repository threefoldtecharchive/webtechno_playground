<script>
import { posts } from './stores.js';
let posts_value;
posts.subscribe(post => {
	posts_value = post;
})
</script>

{#each posts_value as post}
<h1>
	test
	{post.title}
</h1>
<p>
	{post.body}
</p>
{/each}