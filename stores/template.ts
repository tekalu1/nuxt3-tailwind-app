import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTemplateStore = defineStore('template', () => {
  // State
  const count = ref(0)
  const name = ref('Template')
  const items = ref<string[]>([])

  // Getters
  const doubleCount = computed(() => count.value * 2)
  const displayName = computed(() => `${name.value}: ${count.value}`)
  const itemCount = computed(() => items.value.length)

  // Actions
  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  function reset() {
    count.value = 0
  }

  function setName(newName: string) {
    name.value = newName
  }

  function addItem(item: string) {
    items.value.push(item)
  }

  function removeItem(index: number) {
    items.value.splice(index, 1)
  }

  function clearItems() {
    items.value = []
  }

  // Return
  return {
    // State
    count,
    name,
    items,
    // Getters
    doubleCount,
    displayName,
    itemCount,
    // Actions
    increment,
    decrement,
    reset,
    setName,
    addItem,
    removeItem,
    clearItems
  }
})