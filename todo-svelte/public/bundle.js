
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.data !== data)
            text.data = data;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, value) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src/App.svelte generated by Svelte v3.6.7 */

    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.todo = list[i];
    	child_ctx.each_value = list;
    	child_ctx.todo_index = i;
    	return child_ctx;
    }

    // (185:12) {:else}
    function create_else_block(ctx) {
    	var div, t_value = ctx.todo.title, t, dispose;

    	function dblclick_handler() {
    		return ctx.dblclick_handler(ctx);
    	}

    	return {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr(div, "class", "todo-item-title todo-item-label svelte-sa3mpf");
    			add_location(div, file, 185, 16, 4228);
    			dispose = listen(div, "dblclick", dblclick_handler);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, t);
    		},

    		p: function update(changed, new_ctx) {
    			ctx = new_ctx;
    			if ((changed.filteredTodos) && t_value !== (t_value = ctx.todo.title)) {
    				set_data(t, t_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			dispose();
    		}
    	};
    }

    // (183:12) {#if todo.editing}
    function create_if_block(ctx) {
    	var input, dispose;

    	function keydown_handler_1(...args) {
    		return ctx.keydown_handler_1(ctx, ...args);
    	}

    	return {
    		c: function create() {
    			input = element("input");
    			attr(input, "type", "text");
    			add_location(input, file, 183, 16, 4087);

    			dispose = [
    				listen(input, "input", ctx.input_input_handler),
    				listen(input, "keydown", keydown_handler_1)
    			];
    		},

    		m: function mount(target, anchor) {
    			insert(target, input, anchor);

    			input.value = ctx.currentTodoTitle;
    		},

    		p: function update(changed, new_ctx) {
    			ctx = new_ctx;
    			if (changed.currentTodoTitle && (input.value !== ctx.currentTodoTitle)) input.value = ctx.currentTodoTitle;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(input);
    			}

    			run_all(dispose);
    		}
    	};
    }

    // (177:8) {#each filteredTodos as todo}
    function create_each_block(ctx) {
    	var div2, div0, input, t0, t1, div1, t3, dispose;

    	function input_change_handler() {
    		ctx.input_change_handler.call(input, ctx);
    	}

    	function select_block_type(ctx) {
    		if (ctx.todo.editing) return create_if_block;
    		return create_else_block;
    	}

    	var current_block_type = select_block_type(ctx);
    	var if_block = current_block_type(ctx);

    	function click_handler() {
    		return ctx.click_handler(ctx);
    	}

    	return {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			input = element("input");
    			t0 = space();
    			if_block.c();
    			t1 = space();
    			div1 = element("div");
    			div1.textContent = "×";
    			t3 = space();
    			attr(input, "type", "checkbox");
    			add_location(input, file, 179, 16, 3968);
    			attr(div0, "class", "todo-item-left svelte-sa3mpf");
    			add_location(div0, file, 178, 12, 3923);
    			attr(div1, "class", "remove-item svelte-sa3mpf");
    			add_location(div1, file, 191, 12, 4409);
    			attr(div2, "class", "todo-item svelte-sa3mpf");
    			add_location(div2, file, 177, 8, 3887);

    			dispose = [
    				listen(input, "change", input_change_handler),
    				listen(div1, "click", click_handler)
    			];
    		},

    		m: function mount(target, anchor) {
    			insert(target, div2, anchor);
    			append(div2, div0);
    			append(div0, input);

    			input.checked = ctx.todo.done;

    			append(div2, t0);
    			if_block.m(div2, null);
    			append(div2, t1);
    			append(div2, div1);
    			append(div2, t3);
    		},

    		p: function update(changed, new_ctx) {
    			ctx = new_ctx;
    			if (changed.filteredTodos) input.checked = ctx.todo.done;

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(changed, ctx);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);
    				if (if_block) {
    					if_block.c();
    					if_block.m(div2, t1);
    				}
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div2);
    			}

    			if_block.d();
    			run_all(dispose);
    		}
    	};
    }

    function create_fragment(ctx) {
    	var div3, img, t0, input0, t1, div0, t2, div1, label, input1, t3, t4, div2, button0, t6, button1, t8, button2, dispose;

    	var each_value = ctx.filteredTodos;

    	var each_blocks = [];

    	for (var i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	return {
    		c: function create() {
    			div3 = element("div");
    			img = element("img");
    			t0 = space();
    			input0 = element("input");
    			t1 = space();
    			div0 = element("div");

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div1 = element("div");
    			label = element("label");
    			input1 = element("input");
    			t3 = text("Check all");
    			t4 = space();
    			div2 = element("div");
    			button0 = element("button");
    			button0.textContent = "All";
    			t6 = space();
    			button1 = element("button");
    			button1.textContent = "Completed";
    			t8 = space();
    			button2 = element("button");
    			button2.textContent = "Active";
    			attr(img, "src", '/img/logo.png');
    			attr(img, "alt", "svelte logo");
    			attr(img, "class", "logo svelte-sa3mpf");
    			add_location(img, file, 172, 4, 3611);
    			attr(input0, "type", "text");
    			attr(input0, "class", "todo-input svelte-sa3mpf");
    			attr(input0, "placeholder", "What needs to be done");
    			add_location(input0, file, 173, 4, 3674);
    			attr(div0, "id", "todos-list");
    			add_location(div0, file, 175, 4, 3819);
    			attr(input1, "type", "checkbox");
    			attr(input1, "class", "svelte-sa3mpf");
    			add_location(input1, file, 200, 15, 4614);
    			add_location(label, file, 200, 8, 4607);
    			attr(div1, "class", "extra-container svelte-sa3mpf");
    			add_location(div1, file, 199, 4, 4569);
    			attr(button0, "class", "svelte-sa3mpf");
    			toggle_class(button0, "active", ctx.currentFilter===FILTER_ALL);
    			add_location(button0, file, 204, 8, 4754);
    			attr(button1, "class", "svelte-sa3mpf");
    			toggle_class(button1, "active", ctx.currentFilter===FILTER_DONE);
    			add_location(button1, file, 205, 8, 4870);
    			attr(button2, "class", "svelte-sa3mpf");
    			toggle_class(button2, "active", ctx.currentFilter===FILTER_ACTIVE);
    			add_location(button2, file, 206, 8, 4994);
    			attr(div2, "class", "extra-container svelte-sa3mpf");
    			add_location(div2, file, 203, 4, 4716);
    			attr(div3, "class", "container svelte-sa3mpf");
    			add_location(div3, file, 171, 0, 3583);

    			dispose = [
    				listen(input0, "input", ctx.input0_input_handler),
    				listen(input0, "keydown", ctx.keydown_handler),
    				listen(input1, "change", ctx.change_handler),
    				listen(button0, "click", ctx.click_handler_1),
    				listen(button1, "click", ctx.click_handler_2),
    				listen(button2, "click", ctx.click_handler_3)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div3, anchor);
    			append(div3, img);
    			append(div3, t0);
    			append(div3, input0);

    			input0.value = ctx.newTodoText;

    			append(div3, t1);
    			append(div3, div0);

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append(div3, t2);
    			append(div3, div1);
    			append(div1, label);
    			append(label, input1);
    			append(label, t3);
    			append(div3, t4);
    			append(div3, div2);
    			append(div2, button0);
    			append(div2, t6);
    			append(div2, button1);
    			append(div2, t8);
    			append(div2, button2);
    		},

    		p: function update(changed, ctx) {
    			if (changed.newTodoText && (input0.value !== ctx.newTodoText)) input0.value = ctx.newTodoText;

    			if (changed.filteredTodos || changed.currentTodoTitle) {
    				each_value = ctx.filteredTodos;

    				for (var i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}

    			if ((changed.currentFilter || changed.FILTER_ALL)) {
    				toggle_class(button0, "active", ctx.currentFilter===FILTER_ALL);
    			}

    			if ((changed.currentFilter || changed.FILTER_DONE)) {
    				toggle_class(button1, "active", ctx.currentFilter===FILTER_DONE);
    			}

    			if ((changed.currentFilter || changed.FILTER_ACTIVE)) {
    				toggle_class(button2, "active", ctx.currentFilter===FILTER_ACTIVE);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div3);
    			}

    			destroy_each(each_blocks, detaching);

    			run_all(dispose);
    		}
    	};
    }

    const ENTER_KEY='Enter';

    const ESCAPE_KEY='Escape';

    const FILTER_ALL = 'all';

    const FILTER_ACTIVE = 'active';

    const FILTER_DONE = 'done';

    function instance($$self, $$props, $$invalidate) {
    	let todos = [
            {
                id:1,
                title: "learn svelte",
                done: false,
            },
            {
                id:2,
                title: "create todoapp with svelte",
                done: false,
            },
            {
                id:3,
                title: "learn sapper",
                done: false,
            },

        ];

    let currentFilter = FILTER_ALL; 

    let newTodoText = '';
    let currentTodoTitle = '';

    function addTodo(event){
        // console.log(event + event.key)
        if (event.key === ENTER_KEY) {
            console.log(`wishing to add ${newTodoText}`);
            let newTodoId = todos? todos[todos.length -1 ].id + 1 : 1;
            $$invalidate('todos', todos = [...todos, {id:newTodoId, title:newTodoText, done:false}]); 
            $$invalidate('newTodoText', newTodoText= '');      

        }else if (event.key === ESCAPE_KEY) {
            console.log(`ok cancelling adding ${newTodoText} and resetting it`);
            $$invalidate('newTodoText', newTodoText= '');      
        
        }
    }
    function deleteTodo(toRemoveTodo){
        console.log(`removing todo with id ${toRemoveTodo.id}`);
        $$invalidate('todos', todos = todos.filter( (todo) => todo.id != toRemoveTodo.id ));
    }

    function checkAllTodos(event){
        todos.forEach(todo => {
            todo.done = event.target.checked;
        });
        $$invalidate('todos', todos);
        console.log(`todos ${todos}`);

    }

    function updateFilter(filter){
        console.log(`updating currentFilter to : ${filter}`);
        $$invalidate('currentFilter', currentFilter = filter);
    }

    function editTodo(todo){
        todo.editing = true;
        $$invalidate('currentTodoTitle', currentTodoTitle = todo.title);

    }

    function maybeDoneEdit(event, todo){
        
        if (event.key===ENTER_KEY){
            console.log(`updating todo title to ${currentTodoTitle}`);
            todo.title = currentTodoTitle;
            todo.editing = false;
            $$invalidate('currentTodoTitle', currentTodoTitle ='');
            console.log(JSON.stringify(todos));
        }
        $$invalidate('todos', todos);

    }

    	function input0_input_handler() {
    		newTodoText = this.value;
    		$$invalidate('newTodoText', newTodoText);
    	}

    	function keydown_handler(event) {
    		return addTodo(event);
    	}

    	function input_change_handler({ todo, each_value, todo_index }) {
    		each_value[todo_index].done = this.checked;
    		$$invalidate('filteredTodos', filteredTodos), $$invalidate('currentFilter', currentFilter), $$invalidate('todos', todos);
    	}

    	function input_input_handler() {
    		currentTodoTitle = this.value;
    		$$invalidate('currentTodoTitle', currentTodoTitle);
    	}

    	function keydown_handler_1({ todo }, event) {
    		return maybeDoneEdit(event, todo);
    	}

    	function dblclick_handler({ todo }) {
    		return editTodo(todo);
    	}

    	function click_handler({ todo }) {
    		return deleteTodo(todo);
    	}

    	function change_handler(event) {
    		return checkAllTodos(event);
    	}

    	function click_handler_1() {
    		return updateFilter(FILTER_ALL);
    	}

    	function click_handler_2() {
    		return updateFilter(FILTER_DONE);
    	}

    	function click_handler_3() {
    		return updateFilter(FILTER_ACTIVE);
    	}

    	let filteredTodos;

    	$$self.$$.update = ($$dirty = { currentFilter: 1, todos: 1 }) => {
    		if ($$dirty.currentFilter || $$dirty.todos) { $$invalidate('filteredTodos', filteredTodos = currentFilter === FILTER_ALL
                                ? todos
                                : currentFilter === FILTER_ACTIVE
                                    ? todos.filter( (todo) => !todo.done)
                                    : todos.filter( (todo) => todo.done)); }
    	};

    	return {
    		currentFilter,
    		newTodoText,
    		currentTodoTitle,
    		addTodo,
    		deleteTodo,
    		checkAllTodos,
    		updateFilter,
    		editTodo,
    		maybeDoneEdit,
    		filteredTodos,
    		input0_input_handler,
    		keydown_handler,
    		input_change_handler,
    		input_input_handler,
    		keydown_handler_1,
    		dblclick_handler,
    		click_handler,
    		change_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	};
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, []);
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
