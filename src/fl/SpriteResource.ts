/// <reference path="Core.ts" />

module fl
{
    export class SpriteFrame
    {
        texture:PIXI.Texture;
        anchor:PIXI.Point;
    }

    export class SpriteResource extends Resource
    {
        static fromJson(data:any, texture:PIXI.Texture):SpriteResource
        {
            var id = data.path;
            var res = new SpriteResource(id);
            res.texture = texture;
            res.labels = data.labels;
            res.frames = [];

            for (var i = 0; i < data.frames.length; i++)
            {
                var props = data.frames[i];
                var bounds = new PIXI.Rectangle(props[0], props[1], props[2], props[3]);
                var anchor = (bounds.width > 0 && bounds.height > 0)
                    ? new PIXI.Point(props[4]/bounds.width, props[5]/bounds.height)
                    : new PIXI.Point();
                var frame:SpriteFrame =
                {
                    texture: new PIXI.Texture(texture.baseTexture, bounds),
                    anchor: anchor,
                    labels: props[6],
                };
                res.frames.push(frame);
            }

            return res;
        }

        texture:PIXI.Texture;
        frames:SpriteFrame[];
        labels:FrameLabel[];

        createInstance():Sprite
        {
            return new Sprite(this);
        }

        dispose()
        {
            this.texture.destroy(false);
            this.texture = null;
            this.frames = null;
            this.labels = null;
        }
    }
}