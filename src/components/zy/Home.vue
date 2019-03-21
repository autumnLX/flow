<template>
  <div class="page">
    <h1 id="content">
      Hello World!
    </h1>
  </div>
</template>

<script>
const Velocity = window.Velocity

export default {
  name: 'Home',
  mounted() {
    const H1 = document.getElementById('content')
    Velocity(H1, { opacity: 0 }, { duration: 1000, delay: 2000 });
    // setInterval(() => {
    // Velocity(H1, 'callout.swing')
    // }, 600)
    // Velocity(H1, 'transition.swoopOut')
  }
}
</script>
