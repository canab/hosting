module dressup_game
{
    /** Base class for all screens */
    export class AppScreen
    {
        content:fl.Clip;
        name:string = "AppScreen";

        constructor(name:string, content:fl.Clip)
        {
            this.name = name;
            this.content = content;
            this.configureContent(content);
        }

        getElement<T extends fl.FlashObject>(name:string)
        {
            return this.content.getElement<T>(name);
        }

        protected configureContent(content:fl.Clip)
        {

            content.instances.forEach(it =>
            {
                var url:string;

                /** check whether object is link button */
                if (url = Config.links[it.name])
                {
                    new fl.Button(it, () => window.open(url, '_blank'));
                    return;
                }

                /** autoplay objects without name */
                if (!it.name && it.totalFrames > 1)
                {
                    it.animation.play();
                    return;
                }

                if (it instanceof fl.Clip)
                    this.configureContent(<fl.Clip>it);
            });
        }

    }
}