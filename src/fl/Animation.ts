/// <reference path="Core.ts" />

module fl
{
    export class Animation
    {
        static defaultTicksPerFrame:number = 1;

        ticksPerFrame:number = Animation.defaultTicksPerFrame;
        isActive:boolean = false;

        private _target:FlashObject;
        private _completeHandler:(sender:Animation)=>void;

        private _tickCounter:number;
        private _endFrame:number;
        private _looping:boolean;
        private _step:number;

        constructor(target:FlashObject)
        {
            this._target = target;
        }

        playTo(endFrame:number)
        {
            this._looping = false;
            this._endFrame = fl.clampRange(endFrame, 0, this._target.totalFrames - 1);
            this._step = this._endFrame > this._target.currentFrame ? 1 : -1;

            this.isActive = true;
        }

        playLoop(step:number)
        {
            this._looping = true;
            this._step = step;

            this.isActive = true;
        }

        stop()
        {
            this.isActive = false;
        }

        update()
        {
            if (++this._tickCounter < this.ticksPerFrame)
                return;

            this._tickCounter = 0;

            var currentFrame = this._target.currentFrame;

            if (!this._looping && currentFrame == this._endFrame)
            {
                this.stop();
                if (this._completeHandler)
                    this._completeHandler(this);
                return;
            }

            var nextFrame = currentFrame + this._step;
            if (nextFrame < 0)
                nextFrame = this._target.totalFrames - 1;
            else if (nextFrame >= this._target.totalFrames)
                nextFrame = 0;

            this._target.currentFrame = nextFrame;
        }

        play()
        {
            this.playLoop(1);
        }

        playReverse()
        {
            this.playLoop(-1);
        }

        playToBegin()
        {
            this.playTo(0);
        }

        playToEnd()
        {
            this.playTo(this._target.totalFrames - 1);
        }

        playFromBeginToEnd()
        {
            this._target.currentFrame = 0;
            this.playToEnd();
        }

        playFromEndToBegin()
        {
            this._target.currentFrame = this._target.totalFrames - 1;
            this.playToBegin();
        }

        gotoAndStop(frameNum:number):Animation
        {
            this._target.currentFrame = frameNum;
            this.stop();
            return this;
        }

        gotoAndPlay(frameNum:number):Animation
        {
            this._target.currentFrame = frameNum;
            this.play();
            return this;
        }

        onComplete(handler:(sender:Animation) => void)
        {
            this._completeHandler = handler;
        }
    }
}