<template>
  <div>
    <!-- Hero -->
    <section class="bg-white border-b border-gray-200">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div class="max-w-2xl">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-4xl">🇪🇸</span>
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase"
              style="background:#ffc400; color:#1a1a1a;"
            >
              Beta
            </span>
          </div>
          <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Your Spanish<br />
            <span style="color:#c60b1e;">Learning Hub</span>
          </h1>
          <p class="text-lg text-gray-500 leading-relaxed">
            Five focused tools — built to work together — to take you from beginner to fluent.
            Each module is independent; use what you need, when you need it.
          </p>
        </div>

        <!-- Stats bar -->
        <div class="flex flex-wrap gap-8 mt-10">
          <div v-for="stat in stats" :key="stat.label" class="flex flex-col gap-0.5">
            <span class="text-2xl font-bold text-gray-900">{{ stat.value }}</span>
            <span class="text-sm text-gray-500">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Module grid -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-900">All Modules</h2>
        <span class="text-sm text-gray-400">{{ activeCount }} of {{ modules.length }} available</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <ModuleCard
          v-for="module in modules"
          :key="module.id"
          :module="module"
        />
      </div>
    </section>

    <!-- Roadmap strip -->
    <section class="border-t border-gray-200 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">Build Roadmap</h2>
        <ol class="flex flex-col sm:flex-row gap-0">
          <li
            v-for="(module, i) in modules"
            :key="module.id"
            class="flex-1 flex sm:flex-col items-start sm:items-center gap-3 sm:gap-2 relative"
          >
            <!-- connector line -->
            <div
              v-if="i < modules.length - 1"
              class="hidden sm:block absolute top-4 left-1/2 w-full h-px bg-gray-200"
            />
            <div
              class="relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
              :class="module.status === 'active'
                ? 'bg-spanish-red text-white'
                : 'bg-gray-100 text-gray-400'"
            >
              {{ module.phase }}
            </div>
            <span class="text-xs text-gray-500 sm:text-center sm:max-w-[90px] leading-snug">
              {{ module.name }}
            </span>
          </li>
        </ol>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ModuleCard from '../components/ModuleCard.vue'
import { modules } from '../modules/registry.js'

const activeCount = computed(() => modules.filter((m) => m.status === 'active').length)

const stats = [
  { value: modules.length, label: 'Modules planned' },
  { value: '10k+', label: 'Spanish words available' },
  { value: 'A1–C2', label: 'CEFR levels covered' },
  { value: 'Free', label: 'Vocabulary data sources' },
]
</script>
