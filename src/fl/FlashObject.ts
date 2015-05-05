/// <reference path="Core.ts" />

module fl
{
    export class FrameLabel
    {
        frame: number;
        name: string;
    }

    export class FlashObject extends PIXI.DisplayObject
    {
        name: string;
        timelineInstanceId:number;
        isFlashObject:boolean;
        currentFrame:number;
        totalFrames:number;
        animation:Animation;
        labels:FrameLabel[];
        color:Color;

        gotoLabel(label:string):boolean
        {
            var n = this.labels.length;
            for (var i = 0; i < n; i++)
            {
                if (this.labels[i].name == label)
                {
                    this.currentFrame = this.labels[i].frame;
                    return true;
                }
            }
            return false;
        }

        stepForward():FlashObject
        {
            if (this.currentFrame + 1 < this.totalFrames)
                this.currentFrame = this.currentFrame + 1;
            else
                this.currentFrame = 0;

            return this;
        }

        stepBackward():FlashObject
        {
            if (this.currentFrame > 0)
                this.currentFrame = this.currentFrame - 1;
            else
                this.currentFrame = this.totalFrames - 1;

            return this;
        }

        gotoNextFrame():FlashObject
        {
            if (this.currentFrame + 1 < this.totalFrames)
                this.currentFrame = this.currentFrame + 1;

            return this;
        }

        gotoPrevFrame():FlashObject
        {
            if (this.currentFrame > 0)
                this.currentFrame = this.currentFrame - 1;

            return this;
        }

        gotoFirstFrame():FlashObject
        {
            this.currentFrame = 0;
            return this;
        }

        gotoLastFrame():FlashObject
        {
            this.currentFrame = this.totalFrames - 1;
            return this;
        }

        gotoRandomFrame():FlashObject
        {
            this.currentFrame = (Math.random() * this.totalFrames) | 0;
            return this;
        }

        isFirstFrame():boolean
        {
            return this.currentFrame == 0;
        }

        isLastFrame():boolean
        {
            return this.currentFrame == this.totalFrames - 1;
        }

    }
}

