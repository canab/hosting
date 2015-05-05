module dressup_game
{
    export class SceneScreen extends AppScreen
    {
        private static MODEL_PREFIX:string = "model";
        private static PART_PREFIX:string = "opt";
        private static PART_BTN_PREFIX:string = "btn_m";
        private static BG_PREFIX:string = "back";

        private _models:fl.Clip[];
        private _controls:fl.Clip;
        private _partButtons:fl.Button[];
        private _backgrounds:fl.FlashObject[];
        private _backButton:fl.Button;

        constructor()
        {
            super('SceneScreen', fl.Bundle.createClip('scene/scene_screen'));

            this._backButton = this.createBackButton();

            this._models = this.content
                .getAllByPrefix<fl.Clip>(SceneScreen.MODEL_PREFIX)
                .map(it => this.processModel(it));

            this._partButtons = this.content
                .getAllByPrefix<fl.Clip>(SceneScreen.PART_BTN_PREFIX)
                .map(it => new fl.Button(it, btn => this.onPartButtonClick(btn)));

            this._backgrounds = this.content
                .getAllByPrefix(SceneScreen.BG_PREFIX);

            this._controls = this.initControlPanel();
        }

        private createBackButton()
        {
            return new fl.Button(this.content.getElement('btnBackground'),
                () =>
                {
                    this._backgrounds.forEach((it:fl.FlashObject) => it.stepForward());
                });
        }

        private processModel(model:fl.Clip)
        {
            model.getAllByPrefix(SceneScreen.PART_PREFIX)
                .forEach(it => this.processModelPart(it));

            return model;
        }

        private processModelPart(part:fl.FlashObject)
        {
            var cfg = this.getPartConfig(part);

            if (cfg.allowHide)
            {
                part.interactive = true;
                part.buttonMode = true;
                part.mouseup = it => part.visible = false;
            }

            part.visible = part.gotoLabel('default_frame');
        }

        private onPartButtonClick(btn:fl.Button)
        {
            var btnName = btn.content.name;
            var btnConfig = Config.parts[btnName];
            if (!btnConfig)
                throw new Error("Config not found for button: " + btnName);

            btnConfig.path.forEach(it => this.toggleModelPart(it));
            btnConfig.exclude.forEach(it => this.hideModelPart(it));
        }

        private toggleModelPart(path:string)
        {
            var clip = this.getModelPart(path);

            if (!clip.visible)
                clip.visible = true;
            else
                clip.stepForward();
        }

        private hideModelPart(path:string)
        {
            this.getModelPart(path).visible = false;
        }

        private getModelPart(path:string):fl.FlashObject
        {
            var result = this.content.getByPath(path);
            if (!result)
                throw new Error("Content not found: " + path);
            return result
        }

        private getPartConfig(part:fl.FlashObject):PartConfig
        {
            var model = <fl.Container>part.parent;
            var modelNum = model.name.replace(/\D+/, "");
            var optionNum = part.name.replace(/\D+/, "");
            var optionId = `btn_m${modelNum}_opt${optionNum}`;

            var config = Config.parts[optionId];
            if (config)
                return config;
            else
                throw new Error("Config not found: " + optionId);
        }

        //
        // ControlPanel
        //

        private initControlPanel():fl.Clip
        {
            var controls = this.content.getElement<fl.Clip>('controls');
            controls.nestedPlayingType = fl.PlayType.NONE;

            new fl.Button(controls.getElement('btn_reset'), () =>
            {
                this.resetModels();
            });

            new fl.Button(controls.getElement('btn_photo'), () =>
            {
                this.setControlsVisible(false);
                App.shareOnFacebook();
                this.setControlsVisible(true);
            });

            return controls;
        }

        private setControlsVisible(value:boolean)
        {
            this._partButtons.forEach(it => it.content.visible = value);
         	this._backButton.content.visible = value;
            this._controls.currentFrame = value ? 0 : 1;
        }

        public resetModels()
        {
            this._models.forEach((model:fl.Clip) =>
            {
                model.getAllByPrefix(SceneScreen.PART_PREFIX).forEach((part:fl.FlashObject) =>
                {
                    var info = this.getPartConfig(part);
                    if (info.allowHide)
                        part.visible = false;
                });
            });
        }
    }
}
