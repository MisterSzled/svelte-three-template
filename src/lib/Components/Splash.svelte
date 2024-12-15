<script>
        import { onMount } from "svelte";
        import { stages, toggleStartStage } from "../stores/state";

        let message = $state("Loading");
        let visible = $state(true);

        onMount(() => {
                const unsubscribe = stages.subscribe((stages) => {
                        if (stages.loaded["0"]) {
                                message = "Start";
                        }
                        if (stages.start["0"]) {
                                visible = false;
                        }
                });

                return unsubscribe;
        });

        let startAnimation = () => {
                toggleStartStage(0);
        };
</script>

<div
        class={"h-full w-full flex justify-center relative max-w-[1600px] z-10" +
                (!!visible ? "" : " hidden")}
>
        <button
                class="h-full flex-grow flex text-white justify-center items-center flex-col text-5xl"
                onclick={startAnimation}
        >
                {message}
        </button>
</div>
