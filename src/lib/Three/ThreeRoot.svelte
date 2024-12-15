<script>
        import { onMount } from "svelte";
        import { createScene } from "./three/index.ts";

        let el;

        onMount(() => {
                createScene(el, window);
        });
</script>

<canvas bind:this={el} class="w-[100vw] h-[100vh] fixed top-0 left-0 z-0"
></canvas>
