<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <AppNav />
    <main class="pt-16">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import AppNav from './components/AppNav.vue'
</script>
