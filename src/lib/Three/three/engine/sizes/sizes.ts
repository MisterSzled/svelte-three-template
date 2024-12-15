import { createEventEmitter } from "../eventEmitter/eventEmitter"

interface SizesType {
        original_width: number,
        original_height: number,
        width: number,
        height: number,
        pixelRatio: number
}


let size_properties = {
        original_width: 0,
        original_height: 0,
        width: 0,
        height: 0,
        pixelRatio: Math.min(2, 2)
}

const getSizer = (window: Window) => {
        let sizer = createEventEmitter()

        size_properties = {
                original_width: window.innerWidth,
                original_height: window.innerHeight,
                width: window.innerWidth,
                height: window.innerHeight,
                pixelRatio: Math.min(window.devicePixelRatio, 2)
        }

        window.addEventListener('resize', () => {
                size_properties.width = window.innerWidth;
                size_properties.height = window.innerHeight;
                size_properties.pixelRatio = Math.min(window.devicePixelRatio, 2);

                sizer.emit('resize');
        })


        return sizer;
}

export { size_properties, getSizer, SizesType }