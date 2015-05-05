/// <reference path="Core.ts" />

module fl
{
    export enum PlayType
    {
        LOOP,
        ONCE,
        NONE,
    }

    export class Clip extends Container implements FlashObject
    {
        nestedPlayingType:PlayType = PlayType.LOOP;

        private _resource:ClipResource;
        private _instances:FlashObject[] = [];

        constructor(resource:ClipResource)
        {
            super();

            this._resource = resource;
            this._totalFrames = resource.frames.length;
            this.labels = resource.labels;

            this.constructInstances();
            this.handleFrameChange();
        }

        constructInstances()
        {
            var count = this._resource.instances.length;

            for (var i = 0; i < count; i++)
            {
                var instName = this._resource.instances[i].name;
                var resourcePath = this._resource.getResourcePath(i);
                var resource = Bundle.getResource(resourcePath);

                var instance:FlashObject;

                if (resource != null)
                {
                    instance = resource.createInstance();
                }
                else if (resourcePath == "fl.text")
                {
                    // not implemented
                    // instance = new TextLabel() { text = ":-)" };
                }
                instance.name = instName;
                this._instances[i] = instance;
            }
        }

        protected handleFrameChange()
        {
            this.updateChildren();
            Internal.dispatchLabels(this);
        }

        private updateChildren()
        {
            var frame = this._resource.frames[this._currentFrame];
            var itemIndex = 0;
            var instanceIndex = 0;
            var instanceCount = frame.instances.length;

            while (itemIndex < this.children.length && instanceIndex < instanceCount)
            {
                var item = <FlashObject>this.children[itemIndex];
                if (!item.isFlashObject)
                {
                    itemIndex++;
                    continue;
                }

                var instance = frame.instances[instanceIndex];

                if (item.timelineInstanceId == instance.id)
                {
                    instance.applyPropertiesTo(item);

                    if (item.totalFrames > 1)
                    {
                        if (this.nestedPlayingType == PlayType.LOOP)
                            item.stepForward();
                        else if (this.nestedPlayingType == PlayType.ONCE)
                            item.gotoNextFrame();
                    }

                    instanceIndex++;
                    itemIndex++;
                }
                else if (frame.hasInstance(item.timelineInstanceId))
                {
                    var newItem = this.getChildItem(instance.id);
                    instance.applyPropertiesTo(newItem);
                    this.setChildIndex(item, this.getChildIndex(newItem));
                    instanceIndex++;
                }
                else
                {
                    if (item.timelineInstanceId >= 0)
                        this.removeChild(item);
                    else
                        itemIndex++;
                }
            }

            while (instanceIndex < instanceCount)
            {
                var instance = frame.instances[instanceIndex];
                var newItem = this.getChildItem(instance.id);
                instance.applyPropertiesTo(newItem);
                this.addChild(newItem);
                instanceIndex++;
                itemIndex++;
            }

            while (itemIndex < this.children.length)
            {
                var item = <FlashObject>this.children[itemIndex];
                if (!item.isFlashObject)
                {
                    itemIndex++;
                    continue;
                }

                if (item.timelineInstanceId >= 0)
                    this.removeChild(item);
                else
                    itemIndex++;
            }
        }

        private getChildItem(instanceId:number):FlashObject
        {
            var child = this._instances[instanceId];
            child.timelineInstanceId = instanceId;
            child.currentFrame = 0;
            return child;
        }

        get resource()
        {
            return this._resource;
        }

        toString():string
        {
            return 'Clip[' + this._resource.id + ']';
        }

        getElement<T extends FlashObject>(name:string):T
        {
            var n = this._instances.length;
            for (var i = 0; i < n; i++)
            {
                var inst = this._instances[i];
                if (inst.name == name)
                    return <T>inst;
            }

            throw new Error("Instance not found: " + name);
        }

        get instances():FlashObject[]
        {
            return this._instances;
        }

    }
}