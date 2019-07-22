
<style lang="scss">
  .container {
		max-width: 600px;
		margin: 0 auto;
	}
	.logo {
		display: block;
		margin: 20px auto;
		height: 75px;
	}
	.todo-input {
    width: 100%;
    padding: 10px 18px;
    font-size: 18px;
    margin-bottom: 16px;
  }
  .todo-item {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    animation-duration: 0.3s;
  }
  .remove-item {
    cursor: pointer;
    margin-left: 14px;
    &:hover {
      color: black;
    }
  }
  .todo-item-left { // later
    display: flex;
    align-items: center;
  }
  .todo-item-label {
    padding: 10px;
    border: 1px solid white;
    margin-left: 12px;
  }
  .todo-item-edit {
    font-size: 24px;
    color: #2c3e50;
    margin-left: 12px;
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc; //override defaults
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    &:focus {
      outline: none;
    }
  }
  .completed {
    text-decoration: line-through;
    color: grey;
  }
  .extra-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    border-top: 1px solid lightgrey;
    padding-top: 14px;
    margin-bottom: 14px;
    input {
      margin-right: 8px;
    }
  }
  button {
    font-size: 14px;
    background-color: white;
    appearance: none;
    &:hover {
      background: salmon;
    }
    &:focus {
      outline: none;
    }
  }
  .active {
    background: salmon;
  }
</style>



<script>

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

    ]

const ENTER_KEY='Enter'
const ESCAPE_KEY='Escape'

const FILTER_ALL = 'all'
const FILTER_ACTIVE = 'active'
const FILTER_DONE = 'done'

let currentFilter = FILTER_ALL 

let newTodoText = '';
let currentTodoTitle = '';

function addTodo(event){
    // console.log(event + event.key)
    if (event.key === ENTER_KEY) {
        console.log(`wishing to add ${newTodoText}`);
        let newTodoId = todos? todos[todos.length -1 ].id + 1 : 1
        todos = [...todos, {id:newTodoId, title:newTodoText, done:false}] 
        newTodoText= ''      

    }else if (event.key === ESCAPE_KEY) {
        console.log(`ok cancelling adding ${newTodoText} and resetting it`)
        newTodoText= ''      
    
    }
}
function deleteTodo(toRemoveTodo){
    console.log(`removing todo with id ${toRemoveTodo.id}`)
    todos = todos.filter( (todo) => todo.id != toRemoveTodo.id )
}

function checkAllTodos(event){
    todos.forEach(todo => {
        todo.done = event.target.checked
    });
    todos = todos
    console.log(`todos ${todos}`)

}

function updateFilter(filter){
    console.log(`updating currentFilter to : ${filter}`)
    currentFilter = filter
}

function editTodo(todo){
    todo.editing = true
    currentTodoTitle = todo.title

}

function maybeDoneEdit(event, todo){
    
    if (event.key===ENTER_KEY){
        console.log(`updating todo title to ${currentTodoTitle}`)
        todo.title = currentTodoTitle
        todo.editing = false;
        currentTodoTitle =''
        console.log(JSON.stringify(todos))
    }
    todos = todos

}

$: filteredTodos = currentFilter === FILTER_ALL
                        ? todos
                        : currentFilter === FILTER_ACTIVE
                            ? todos.filter( (todo) => !todo.done)
                            : todos.filter( (todo) => todo.done)                                 

</script>
<div class="container">
    <img src={'/img/logo.png'} alt="svelte logo" class="logo">
    <input type="text" class="todo-input" placeholder="What needs to be done" bind:value={newTodoText} on:keydown={(event) => addTodo(event)} >

    <div id="todos-list">
        {#each filteredTodos as todo}
        <div class="todo-item">
            <div class="todo-item-left">
                <input type="checkbox" bind:checked="{todo.done}"/>
            </div>

            {#if todo.editing}
                <input type="text" bind:value="{currentTodoTitle}" on:keydown={(event) => maybeDoneEdit(event, todo)} />
            {:else}
                <div class="todo-item-title todo-item-label" on:dblclick={() => editTodo(todo)}>
                    {todo.title}
                </div>
            {/if}

            
            <div class="remove-item" on:click={() => deleteTodo(todo)} >
                &times;
            </div>
        
        </div>
        {/each}
    </div>

    <div class="extra-container">
        <label><input type="checkbox" on:change={(event) => checkAllTodos(event) }>Check all</label>
    </div>

    <div class="extra-container">
        <button on:click={() => updateFilter(FILTER_ALL)} class:active="{currentFilter===FILTER_ALL}" >All</button>
        <button on:click={() => updateFilter(FILTER_DONE)} class:active="{currentFilter===FILTER_DONE}" >Completed</button>
        <button on:click={() => updateFilter(FILTER_ACTIVE)} class:active="{currentFilter===FILTER_ACTIVE}" >Active</button>
    
    </div>


</div>