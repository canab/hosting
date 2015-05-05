/// <reference path="fl/Core.ts" />
/// <reference path="Config.ts" />
/// <reference path="AppScreen.ts" />
/// <reference path="IntroScreen.ts" />
/// <reference path="SceneScreen.ts" />

module dressup_game
{
    export var APP_WIDTH:number = 760;
    export var APP_HEIGHT:number = 610;
    export var STAGE_COLOR:number = 0xffffff;
    export var FORCE_USE_CANVAS:boolean = false;

    export function initialize(containerId:string)
    {
        var container = document.getElementById(containerId);
        if (!container)
            throw new Error(`Element not found: id="${containerId}"`);

        App.initialize();

        container.appendChild(App.canvas)
    }

    /** Application facade */
    export class App
    {
        static renderer:PIXI.PixiRenderer;
        static stage:PIXI.Stage;

        private static _screen:AppScreen;

        static initialize()
        {
            fl.Animation.defaultTicksPerFrame = 2;
            App.initStage();
            App.loadIntro();
            requestAnimFrame(App.animate);
        }

        private static initStage()
        {
            App.stage = new PIXI.Stage(STAGE_COLOR);
            App.renderer = FORCE_USE_CANVAS
                ? new PIXI.CanvasRenderer(APP_WIDTH, APP_HEIGHT)
                : PIXI.autoDetectRenderer(APP_WIDTH, APP_HEIGHT);
        }

        static loadIntro()
        {
            fl.Bundle.load('intro', () => App.changeScreen(new IntroScreen()));
        }

        private static animate()
        {
            try
            {
                App.renderer.render(App.stage);
                requestAnimFrame(App.animate);
            }
            catch (e)
            {
                console.error("Stage error: probably some resources are unloaded but still present on the stage");
                throw e;
            }
        }

        static changeScreen(screen:AppScreen)
        {
            console.log("App.changeScreen: " + screen.name);

            if (App._screen)
                App.stage.removeChild(App._screen.content);

            App._screen = screen;

            if (App._screen)
                App.stage.addChild(App._screen.content);
        }

        static shareOnFacebook()
        {
            /*
            App.renderer.render(App.stage);
            var data = App.canvas.toDataURL("image/png");
            var data1 = data.split(',')[0];

            var encodedPng = data.substring(data.indexOf(',') + 1, data.length);
            var decodedPng = Base64Binary.decode(encodedPng);

            console.log(data);

            var link = 'http://www.facebook.com/dialog/feed?app_id=821805674507717' +
                    '&link=https://hpbe.time2play.mobi/' +
                    '&picture=' + decodedPng +
                    '&name=' + encodeURIComponent('[CONTENT_TITLE]') +
                    '&caption=' + encodeURIComponent('[CONTENT_CAPTION]') +
                    '&redirect_uri=https://hpbe.time2play.mobi/' +
                    '&description=' + encodeURIComponent('[CONTENT_DESCRIPTION]') +
                    '&display=popup';
            window.open(link, 'Опубликовать ссылку в Facebook', 'width=640,height=436,toolbar=0,status=0');

            return;

            var encodedPng = data.substring(data.indexOf(',') + 1, data.length);
            //var decodedPng = Base64Binary.decode(encodedPng);

            FB.ui({
                    method: 'share',
                    name: "some name",
                    link: "https://hpbe.time2play.mobi/",
                    picture: data,
                    caption: 'some caption',
                    description: "some descrtiption",
                },
                function (response)
                {
                    if (response && response.post_id)
                    {
                        console.log('Thank you');
                    }
                }
            );

            return;

            var anchor = <HTMLAnchorElement>document.createElement('a');
            anchor.textContent = "download screenshot";
            anchor['download'] = "screenshot.png";
            anchor.href = App.canvas
                .toDataURL("image/png")
                .replace("image/png", "image/octet-stream");

            // this works only in chrome
            //anchor.click();

            // this works in firefox/chrome
            // it still sucks in safary
            var event = document.createEvent("MouseEvent");
            event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            anchor.dispatchEvent(event); */
        }

        static get canvas():HTMLCanvasElement
        {
            return App.renderer.view;
        }

    }
}

