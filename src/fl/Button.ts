/// <reference path="Core.ts" />
module fl
{
    export class Button
    {
        content:FlashObject;
        onRelease: (target:Button) => void;
        onPress: (target:Button) => void;

        //region enabled
        private _enabled:boolean = true;
        get enabled():boolean { return this._enabled; }
        set enabled(value:boolean)
        {
            if (this._enabled != value)
            {
                this._enabled = value;
                this.refreshEnabledState();
            }
        }

        protected refreshEnabledState()
        {
            this.content.interactive = this._enabled;
            this.content.buttonMode = this._enabled;
        }
        //endregion

        constructor(target:FlashObject, action?: (btn:Button)=>void)
        {
            assertPresent(target, "target");

            this.content = target;
            this.onRelease = action;

            this.content.mouseover = () =>
            {
                this.setDownState();
            };

            this.content.mouseout = () =>
            {
                this.setUpState();
            };

            this.content.mousedown = () =>
            {
                this.setDownState();
                if (this.onPress)
                    this.onPress(this);
            };

            this.content.mouseup = () =>
            {
                if (this.onRelease)
                    this.onRelease(this);
            };

            this.refreshEnabledState();
        }

        private setDownState()
        {
            this.content.currentFrame = 1;
        }

        private setUpState()
        {
            this.content.currentFrame = 0;
        }
    }
}