<script setup lang="ts">
import { onErrorCaptured, shallowRef, watch } from 'vue';

const { resetKey } = defineProps<{
    /** Changing this value clears a captured error (like react-error-boundary's resetKeys). */
    resetKey?: unknown;
}>();

defineSlots<{
    default(): unknown;
    fallback(props: { error: Error; reset: () => void }): unknown;
}>();

const error = shallowRef<Error | null>(null);

function reset() {
    error.value = null;
}

onErrorCaptured((err) => {
    error.value = err instanceof Error ? err : new Error(String(err));
    console.error(err);
    return false;
});

watch(() => resetKey, reset);
</script>

<template>
    <slot v-if="error" name="fallback" :error="error" :reset="reset" />
    <slot v-else />
</template>
