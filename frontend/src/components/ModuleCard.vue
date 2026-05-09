<template>
  <component
    :is="isActive ? 'RouterLink' : 'div'"
    :to="isActive ? `/modules/${module.id}` : undefined"
    class="group relative bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4 transition-all duration-200"
    :class="isActive
      ? 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer'
      : 'opacity-75 cursor-default'"
  >
    <!-- Phase badge -->
    <span class="absolute top-4 right-4 text-xs font-medium text-gray-400">
      Phase {{ module.phase }}
    </span>

    <!-- Icon -->
    <div
      class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
      :class="iconBg"
    >
      {{ module.icon }}
    </div>

    <!-- Content -->
    <div class="flex flex-col gap-1.5 flex-1">
      <h3 class="font-semibold text-gray-900 text-base leading-snug">
        {{ module.name }}
      </h3>
      <p class="text-sm text-gray-500 leading-relaxed">
        {{ module.description }}
      </p>
    </div>

    <!-- Tags -->
    <div class="flex flex-wrap gap-1.5">
      <span
        v-for="tag in module.tags"
        :key="tag"
        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
      >
        {{ tag }}
      </span>
    </div>

    <!-- Status -->
    <div class="flex items-center justify-between pt-1 border-t border-gray-100">
      <span
        class="inline-flex items-center gap-1.5 text-xs font-medium"
        :class="isActive ? 'text-emerald-600' : 'text-gray-400'"
      >
        <span
          class="w-1.5 h-1.5 rounded-full"
          :class="isActive ? 'bg-emerald-500' : 'bg-gray-300'"
        />
        {{ isActive ? 'Available' : 'Coming Soon' }}
      </span>

      <span
        v-if="isActive"
        class="text-xs font-medium text-gray-400 group-hover:text-gray-600 transition-colors"
      >
        Open →
      </span>
    </div>
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  module: {
    type: Object,
    required: true,
  },
})

const isActive = computed(() => props.module.status === 'active')

const iconBgMap = {
  blue: 'bg-blue-50',
  green: 'bg-emerald-50',
  orange: 'bg-orange-50',
  purple: 'bg-violet-50',
  red: 'bg-red-50',
}

const iconBg = computed(() => iconBgMap[props.module.accentColor] ?? 'bg-gray-50')
</script>
