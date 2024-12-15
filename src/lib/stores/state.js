import { writable } from 'svelte/store';

export const StageTypes = {
        LOADED: 'loaded',
        START: 'start',
};

const stages = writable({
        loaded: {},
        start: {},
});

function toggleStage(type, stage) {
        stages.update((currentStages) => {
                currentStages[type][stage] = !currentStages[type][stage];
                return { ...currentStages };
        });
}

function setStage(type, stage, value) {
        stages.update((currentStages) => {
                currentStages[type][stage] = value;
                return { ...currentStages };
        });
}

function toggleLoadedStage(stage) {
        toggleStage(StageTypes.LOADED, stage);
}

function toggleStartStage(stage) {
        toggleStage(StageTypes.START, stage);
}

export { stages, toggleLoadedStage, toggleStartStage, setStage };
