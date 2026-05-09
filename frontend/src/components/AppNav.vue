<template>
  <header class="fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-200">
    <nav class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <RouterLink to="/" class="flex items-center gap-2.5 group">
        <span class="text-2xl leading-none">🇪🇸</span>
        <span class="font-bold text-lg text-gray-900 tracking-tight group-hover:text-spanish-red transition-colors">
          Español
        </span>
      </RouterLink>

      <div class="flex items-center gap-1">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          active-class="text-gray-900 bg-gray-100"
        >
          {{ link.label }}
        </RouterLink>
      </div>
    </nav>
  </header>
</template>

<script setup>
const navLinks = [
  { to: '/', label: 'Modules' },
]
</script>
