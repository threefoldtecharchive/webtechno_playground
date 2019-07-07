<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" crossorigin="anonymous">

<script>
    let count = 0;
    let name = "some";
    
    import { d } from './stores.js';

    $: if (count >= 10) {
      alert(`count is dangerously high!`);
      count = 3;
    }

    function handleClick() {
	    count += 1;
    }

import 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js'
// import 'https://code.jquery.com/jquery-3.2.1.slim.min.js'
import 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js'

import "https://cdn.jsdelivr.net/npm/gun/examples/jquery.js"
// import "https://cdn.jsdelivr.net/npm/gun/gun.js"
// import "https://cdn.jsdelivr.net/npm/gun/lib/webrtc.js"

// var gun = Gun(['http://localhost:8765/gun', 'https://gunjs.herokuapp.com/gun']);

import Box from './Comp.svelte';
// import Box2 from './Comp2.svelte';

</script>

<button on:click={handleClick}>
    Clicked {count} {count === 1 ? 'time' : 'times'}
</button>


<div class="container">
  <div class="row">
    <div class="col-sm">
      One of three columns
      <Box></Box>
    </div>
    <div class="col-sm">
      One of three columns
      <Box></Box>
      {name}
    </div>
    <div class="col-sm">
      {#if count >= 0}
        <div class="alert alert-primary" role="alert">
          ALARM, we need to be carefull
        </div>
      {/if}
      <div class="progress">
        <div class="progress-bar" role="progressbar" style="width: {count*10}%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
      </div>

    </div>
  </div>
</div>



