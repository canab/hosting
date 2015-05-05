/// <reference path="../lib/pixi.d.ts" />
/// <reference path="FlashObject.ts" />
/// <reference path="Animation.ts" />
/// <reference path="Resource.ts" />
/// <reference path="Bundle.ts" />
/// <reference path="Container.ts" />
/// <reference path="Clip.ts" />
/// <reference path="ClipResource.ts" />
/// <reference path="Sprite.ts" />
/// <reference path="SpriteResource.ts" />
/// <reference path="Button.ts" />

module fl
{
    applyMixins(Container, FlashObject);
    applyMixins(Sprite, FlashObject);

    export var onLabel:(target:FlashObject, label:string) => void;

    export function applyMixins(derived:any, base:any)
    {
        Object.getOwnPropertyNames(base.prototype).forEach(name =>
        {
            derived.prototype[name] = base.prototype[name];
        });
    }

    export function assertPresent(value:any, name:string)
    {
        if (!value)
            throw new Error("Value not present: " + name);
    }

    export function clampRange(value:number, min:number, max:number):number
    {
        if (value < min)
            return min;
        else if (value > max)
            return max;
        else
            return value;
    }

    export class Internal
    {
        static EMPTY_ARRAY:any[] = [];

        static dispatchLabels(target:FlashObject)
        {
            if (!onLabel)
                return;

            var n = target.labels.length;
            var frame = target.currentFrame;
            for (var i = 0; i < n; i++)
            {
                if (target.labels[i].frame == frame)
                    onLabel(target, target.labels[i].name);
            }
        }
    }
}

