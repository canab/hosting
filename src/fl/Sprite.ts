/// <reference path="Core.ts" />

module fl
{
    export class Sprite extends PIXI.Sprite implements FlashObject
    {
        private _resource:SpriteResource;

        //region FlashObject
        name:string;
        timelineInstanceId:number = -1;
        isFlashObject:boolean = true;
        labels:FrameLabel[] = Internal.EMPTY_ARRAY;
        color:Color = <Color>{ r: 1, g: 1, b: 1, a: 1};

        gotoLabel: (label:string) => boolean;
        stepForward: () => FlashObject;
        stepBackward: () => FlashObject;
        gotoNextFrame: () => FlashObject;
        gotoPrevFrame: () => FlashObject;
        gotoFirstFrame: () => FlashObject;
        gotoLastFrame: () => FlashObject;
        gotoRandomFrame: () => FlashObject;
        isFirstFrame: () => boolean;
        isLastFrame: () => boolean;

        private _animation:Animation;
        protected _currentFrame:number = 0;
        protected _totalFrames:number = 1;

        get totalFrames():number { return this._totalFrames; }
        get currentFrame():number { return this._currentFrame; }
        set currentFrame(value:number)
        {
            if (this._currentFrame != value)
            {
                this._currentFrame = clampRange(value, 0, this._totalFrames - 1);
                this.handleFrameChange();
            }
        }

        public get animation():Animation
        {
            return this._animation
                || (this._animation = new Animation(this));
        }
        //endregion

        constructor(resource:SpriteResource)
        {
            super(null);

            this._resource = resource;
            this._totalFrames = resource.frames.length;
            this.labels = resource.labels;

            this.handleFrameChange();
        }

        updateTransform():void
        {
            if (this._animation && this._animation.isActive)
                this.animation.update();

            this.updateColor();

            super.updateTransform();
        }

        updateColor()
        {
            var c = this.color;
            var r = c.r;
            var g = c.g;
            var b = c.b;
            var a = c.a;

            var parentObject = <Container>this.parent;
            if (parentObject && parentObject.isFlashObject)
            {
                var pc = parentObject.globalColor;
                r *= pc.r;
                g *= pc.g;
                b *= pc.b;
                a *= pc.a;
            }

            this.tint = 255 * r << 16 | 255 * g << 8 | 255 * b;
            this.alpha = a;
        }

        handleFrameChange()
        {
            var frame = this._resource.frames[this._currentFrame];
            this.anchor.set(frame.anchor.x, frame.anchor.y);
            this.texture = frame.texture;

            Internal.dispatchLabels(this);
        }

        get resource()
        {
            return this._resource;
        }

        toString():string
        {
            return 'Sprite[' + this._resource.id + ']';
        }
    }
}