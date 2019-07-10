*Psst — looking for a shareable component template? Go here --> [sveltejs/component-template](https://github.com/sveltejs/component-template)*

---
# Svelte blog with gunJS
At the moment svelte wont update the properties set by gunjs.  
This could be a bug, scope issue or something else

 ### Please use (some) dummy data!
Dummy data, just paste in console of browser
```javascript
var gun = Gun() // Or Gun("ws://ip:port")
var post1 = {
	id: 1,
	title: "Look at my cat",
	date: new Date().toString(),
	description: "My cat",
	body: "My cat is the best cat. You have never seen such a good cat",
	image: "cat01.jpg"
}
var post2 = {
	id: 2,
	title: "Look at my duck",
	date: new Date().toString(),
	description: "My duck",
	body: "My duck is the best duck. You have never seen such a good duck. A big yellow duck",
	image: "duck01.jpg"
}
var posts = gun.get('posts')
posts.set(post1)
posts.set(post2)

gun.get("headline").put({
	image: "tf.jpg",
	title: "Welcome to my blog",
	description: "This blog is running on 3Bot :D"
})

# svelte app

This is a project template for [Svelte](https://svelte.technology) apps. It lives at https://github.com/sveltejs/template.

To create a new project based on this template using [degit](https://github.com/Rich-Harris/degit):

```bash
npm install -g degit # you only need to do this once

degit sveltejs/template svelte-app
cd svelte-app
```

*Note that you will need to have [Node.js](https://nodejs.org) installed.*


## Get started

Install the dependencies...

```bash
cd svelte-app
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.


## Deploying to the web

### With [now](https://zeit.co/now)

Install `now` if you haven't already:

```bash
npm install -g now
```

Then, from within your project folder:

```bash
now
```

As an alternative, use the [Now desktop client](https://zeit.co/download) and simply drag the unzipped project folder to the taskbar icon.

### With [surge](https://surge.sh/)

Install `surge` if you haven't already:

```bash
npm install -g surge
```

Then, from within your project folder:

```bash
npm run build
surge public
```
