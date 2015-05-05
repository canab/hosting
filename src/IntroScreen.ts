module dressup_game
{
    export class IntroScreen extends AppScreen
    {
        private playButton:fl.Button;
        private loadingClip:fl.FlashObject;

        constructor()
        {
            super('IntroScreen', fl.Bundle.createClip('intro/intro_screen'));

            this.playButton = new fl.Button(this.getElement('btn_play'), () =>
            {
                fl.Bundle.unload('intro');
                App.changeScreen(new SceneScreen());
            });

            this.loadingClip = this.getElement('loading');

            var intro = this.getElement<fl.Clip>('intro_anim');
            intro.nestedPlayingType = fl.PlayType.ONCE;
            intro.animation.playToEnd();

            this.loadSceneBundle();
        }

        loadSceneBundle()
        {
            this.playButton.content.visible = false;
            this.loadingClip.animation.play();

            fl.Bundle.load('scene', () =>
            {
                this.loadingClip.animation.stop();
                this.loadingClip.visible = false;
                this.playButton.content.visible = true;
            });
        }
    }
}