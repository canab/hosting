/// <reference path="Core.ts" />

module fl
{
    export class ClipResource extends Resource
    {
        static fromJson(data:any):ClipResource
        {
            var id = data.path;
            var r = new ClipResource(id);
            r.resources = data.resources;
            r.instances = ClipResource.readInstances(data.instances);
         	r.frames = ClipResource.readFrames(data.frames, r.instances.length);
            r.labels = data.labels;
            return r;
        }

        private static readInstances(data:any):InstanceInfo[]
        {
            var instances = [];
            for (var i = 0; i < data.length; i++)
            {
                var props = data[i];
                var inst = new InstanceInfo();
                inst.resourceNum = props[0];
                inst.name = props[1];
                instances[i] = inst;
            }
            return instances;
        }

        private static readFrames(data:any, totalInstCount:number):FrameData[]
        {
            var framesCount = data.length;
            var frames = [];

            for (var i = 0; i < framesCount; i++)
            {
                frames[i] = ClipResource.readFrame(data[i], totalInstCount);
            }

            return frames;
        }

        private static readFrame(data:any, totalInstCount:number):FrameData
        {
            var frame = new FrameData();
            frame.existingInstancesBits = [];
            for (var i = 0; i < totalInstCount; i++)
            {
                frame.existingInstancesBits[i] = false;
            }

            var instCount = data.length;
            frame.instances = [];

            for (var i = 0; i < instCount; i++)
            {
                var instance = ClipResource.readInstance(data[i]);
                frame.instances[i] = instance;
                frame.existingInstancesBits[instance.id] = true;
            }

            return frame;
        }

        private static readInstance(data:any):InstanceData
        {
            var inst = new InstanceData();

            inst.id = data[0];

			inst.position = <PIXI.Point>{ x:data[1], y:data[2] };
			inst.rotation = data[3];
			inst.scale = <PIXI.Point>{ x:data[4], y:data[5] };

            inst.color = new Color();
			inst.color.r = data[6];
			inst.color.g = data[7];
			inst.color.b = data[8];
			inst.color.a = data[9];

            return inst;
        }


        resources:string[];
        instances:InstanceInfo[];
        frames:FrameData[];
        labels:FrameLabel[];

        createInstance():Clip
        {
            return new Clip(this);
        }

        getResourcePath(instanceId:number):string
        {
            var resourceNum = this.instances[instanceId].resourceNum;
            return this.resources[resourceNum];
        }

        dispose()
        {
            this.resources = null;
            this.instances = null;
            this.frames = null;
            this.labels = null;
        }

    }

    class FrameData
   	{
   		static EMPTY_LABELS:string[] = [];

   		instances:InstanceData[];
   		existingInstancesBits:boolean[];

   		hasInstance(id:number):boolean
   		{
   			return id >= 0
   				&& id < this.existingInstancesBits.length
   				&& this.existingInstancesBits[id];
   		}
   	}

    class InstanceInfo
    {
        name:string;
        resourceNum:number;
    }

    export class Color
    {
        r:number;
        g:number;
        b:number;
        a:number;

        clone():Color
        {
            return <Color>
            {
                r: this.r,
                g: this.g,
                b: this.b,
                a: this.a,
            };
        }
    }

    class InstanceData
	{
		id:number;
		position:PIXI.Point;
		scale:PIXI.Point;
		rotation:number;
		color:Color;

		applyPropertiesTo(target:FlashObject)
		{
			target.position.x = this.position.x;
			target.position.y = this.position.y;
			target.rotation = this.rotation;
			target.scale.x = this.scale.x;
			target.scale.y = this.scale.y;

            target.color.r = this.color.r;
            target.color.g = this.color.g;
            target.color.b = this.color.b;
            target.color.a = this.color.a;
		}
	}
}