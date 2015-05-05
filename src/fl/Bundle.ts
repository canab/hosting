/// <reference path="Core.ts" />

module fl
{
    export class Bundle
    {
        static VERBOSE_LOG = false;

        private static _bundles: { [id:string] : Bundle } = {};

        static load(bundleName:string, onComplete:()=>void)
        {
            console.log("Bundle.load: " + bundleName);

            var bundle = Bundle._bundles[bundleName];
            if (bundle)
                throw new Error("Bundle is already loaded: " + bundleName);

            bundle = new Bundle(bundleName);
            Bundle._bundles[bundleName] = bundle;
            bundle.load(onComplete);
        }

        static unload(bundleName:string)
        {
            console.log("Bundle.unload: " + bundleName);

            var bundle = Bundle._bundles[bundleName];
            if (!bundle)
                throw new Error("Bundle is not loaded: " + bundleName);

            Bundle._bundles[bundleName] = null;
            bundle.unload();
        }

        static getResource<T extends Resource>(resourceId:string):T
        {
            var bundleId = resourceId.substr(0, resourceId.indexOf('/'));
            var bundle = Bundle._bundles[bundleId];
            if (!bundle)
                throw new Error('Bundle is not loaded: ' + resourceId);

            var res = bundle.resources[resourceId];
            if (res == null)
                throw new Error('Resource not found: ' + resourceId);

            return <T>res;
        }

        static createSprite(id:string):Sprite
        {
            var res = Bundle.getResource<SpriteResource>(id);
            if (!(res instanceof SpriteResource))
                throw new Error('Resource is not a Sprite: ' + id);

            return new Sprite(res);
        }

        static createClip(id:string):Clip
        {
            var res = Bundle.getResource<ClipResource>(id);
            if (!(res instanceof ClipResource))
                throw new Error('Resource is not a Clip: ' + id);

            return new Clip(res);
        }

    	private name:String;
    	private texture:PIXI.Texture;
        private resources: { [id: string] : Resource } = {};
        private completeHandler: ()=>void;

    	constructor(name:String)
    	{
    		this.name = name;
    	}

    	private load(onComplete?:()=>void)
    	{
            this.completeHandler = onComplete;
            this.loadTexture();
    	}

        private unload()
        {
            Object.keys(this.resources)
                .forEach(key => this.resources[key].dispose());

            this.texture.destroy(true);
            this.texture = null;
        }

        private loadTexture()
        {
            var url = this.getUrl('bundle.png');
            var loader = new PIXI.ImageLoader(url);
            this.verboseLog('Loading: ' + url);
            loader.on('loaded', () => {
                this.texture = loader.texture;
                this.loadResources();
            });
            loader.load();
        }

        private loadResources()
        {
            var url = this.getUrl('bundle.json');
            var loader = new PIXI.JsonLoader(url);
            this.verboseLog('Loading: ' + url);
            loader.on('loaded', () => {
                this.createResources(loader['json']);
                if (this.completeHandler != null)
                    this.completeHandler();
            });
            loader.load();
        }

        private createResources(description:Object[])
        {
            var n = description.length;
            for(var i = 0; i < n; i++)
            {
                var entry:any = description[i];
                var id = entry.path;
                this.resources[id] = this.createResource(entry);
                this.verboseLog(id);
            }
        }

        private createResource(json:any):Resource
        {
            var type = json.type;

            if (type == "sprite")
                return SpriteResource.fromJson(json, this.texture);

            if (type == "clip")
                return ClipResource.fromJson(json);

            throw new Error("Unknown resource type: " + type);
        }

        private verboseLog(message:string)
        {
            if (Bundle.VERBOSE_LOG)
                console.log(message);
        }

        private getUrl(assetName:string):string
        {
            return `assets/${this.name}/${assetName}`;
        }
    }

}