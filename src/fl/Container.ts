/// <reference path="Core.ts" />

module fl
{
    export class Container extends PIXI.DisplayObjectContainer implements FlashObject
    {
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
        protected _currentFrame = 0;
        protected _totalFrames = 1;

        get totalFrames() { return this._totalFrames; }
        get currentFrame() { return this._currentFrame; }
        set currentFrame(value:number)
        {
            if (this._currentFrame != value)
            {
                this._currentFrame = clampRange(value, 0, this._totalFrames - 1);
                this.handleFrameChange();
            }
        }

        public get animation()
        {
            return this._animation
                || (this._animation = new Animation(this));
        }
        //endregion

        public globalColor:Color = <Color>{};

        protected handleFrameChange()
        {
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

            var gc = this.globalColor;

            var parentObject = <Container>this.parent;
            if (parentObject && parentObject.isFlashObject)
            {
                var pc = parentObject.globalColor;
                gc.r = r * pc.r;
                gc.g = g * pc.g;
                gc.b = b * pc.b;
                gc.a = a * pc.a;
            }
            else
            {
                gc.r = r;
                gc.g = g;
                gc.b = b;
                gc.a = a;
            }
        }

        forEachFlashObject(action:(child:FlashObject)=>void)
        {
            var n = this.children.length;
            for (var i = 0; i < n; i++)
            {
                var child = <FlashObject>this.children[i];
                if (child.isFlashObject)
                    action(child);
            }
        }

        getAll<T extends FlashObject>(predicate:(it:FlashObject) => boolean):T[]
        {
            var result = [];
            var n = this.children.length;
            for (var i = 0; i < n; i++)
            {
                var child = <FlashObject>this.children[i];
                if (child.isFlashObject && predicate(child))
                    result.push(child);
            }
            return result;
        }

        getAllByPrefix<T extends FlashObject>(prefix:string):T[]
        {
            return this.getAll<T>(it =>
            {
                return it.name && it.name.indexOf(prefix) == 0;
            });
        }

        getByName<T extends FlashObject>(name:string, safe:boolean = false):T
        {
            var n = this.children.length;
            for (var i = 0; i < n; i++)
            {
                var child = <FlashObject>this.children[i];
                if (child.name == name)
                    return <T>child;
            }

            if (safe)
                return null;
            else
                throw new Error("Child not found: " + name);
        }

        getByPath<T extends FlashObject>(path:string, safe:boolean = false):T
        {
            var parts = path.split('/');
            var target = this;

            for (var i = 0; i < parts.length; i++)
            {
                var child = target.getByName(parts[i]);
                if (!child)
                    return null;

                if (i + 1 == parts.length)
                    return <T>child;

                if (!(child instanceof Container))
                    return null;

                target = <Container>child;
            }

            if (safe)
                return null;
            else
                throw new Error("Child not found: " + path);
        }

        playAllChildren()
        {
            this.forEachFlashObject(it =>
            {
                if (it.totalFrames > 1 || (it instanceof Clip))
                    it.animation.play();
            });
        }
    }
}