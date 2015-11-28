/// <reference path="Core.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var fl;
(function (fl) {
    var FrameLabel = (function () {
        function FrameLabel() {
        }
        return FrameLabel;
    })();
    fl.FrameLabel = FrameLabel;
    var FlashObject = (function (_super) {
        __extends(FlashObject, _super);
        function FlashObject() {
            _super.apply(this, arguments);
        }
        FlashObject.prototype.gotoLabel = function (label) {
            var n = this.labels.length;
            for (var i = 0; i < n; i++) {
                if (this.labels[i].name == label) {
                    this.currentFrame = this.labels[i].frame;
                    return true;
                }
            }
            return false;
        };
        FlashObject.prototype.stepForward = function () {
            if (this.currentFrame + 1 < this.totalFrames)
                this.currentFrame = this.currentFrame + 1;
            else
                this.currentFrame = 0;
            return this;
        };
        FlashObject.prototype.stepBackward = function () {
            if (this.currentFrame > 0)
                this.currentFrame = this.currentFrame - 1;
            else
                this.currentFrame = this.totalFrames - 1;
            return this;
        };
        FlashObject.prototype.gotoNextFrame = function () {
            if (this.currentFrame + 1 < this.totalFrames)
                this.currentFrame = this.currentFrame + 1;
            return this;
        };
        FlashObject.prototype.gotoPrevFrame = function () {
            if (this.currentFrame > 0)
                this.currentFrame = this.currentFrame - 1;
            return this;
        };
        FlashObject.prototype.gotoFirstFrame = function () {
            this.currentFrame = 0;
            return this;
        };
        FlashObject.prototype.gotoLastFrame = function () {
            this.currentFrame = this.totalFrames - 1;
            return this;
        };
        FlashObject.prototype.gotoRandomFrame = function () {
            this.currentFrame = (Math.random() * this.totalFrames) | 0;
            return this;
        };
        FlashObject.prototype.isFirstFrame = function () {
            return this.currentFrame == 0;
        };
        FlashObject.prototype.isLastFrame = function () {
            return this.currentFrame == this.totalFrames - 1;
        };
        return FlashObject;
    })(PIXI.DisplayObject);
    fl.FlashObject = FlashObject;
})(fl || (fl = {}));
/// <reference path="Core.ts" />
var fl;
(function (fl) {
    var Animation = (function () {
        function Animation(target) {
            this.ticksPerFrame = Animation.defaultTicksPerFrame;
            this.isActive = false;
            this._target = target;
        }
        Animation.prototype.playTo = function (endFrame) {
            this._looping = false;
            this._endFrame = fl.clampRange(endFrame, 0, this._target.totalFrames - 1);
            this._step = this._endFrame > this._target.currentFrame ? 1 : -1;
            this.isActive = true;
        };
        Animation.prototype.playLoop = function (step) {
            this._looping = true;
            this._step = step;
            this.isActive = true;
        };
        Animation.prototype.stop = function () {
            this.isActive = false;
        };
        Animation.prototype.update = function () {
            if (++this._tickCounter < this.ticksPerFrame)
                return;
            this._tickCounter = 0;
            var currentFrame = this._target.currentFrame;
            if (!this._looping && currentFrame == this._endFrame) {
                this.stop();
                if (this._completeHandler)
                    this._completeHandler(this);
                return;
            }
            var nextFrame = currentFrame + this._step;
            if (nextFrame < 0)
                nextFrame = this._target.totalFrames - 1;
            else if (nextFrame >= this._target.totalFrames)
                nextFrame = 0;
            this._target.currentFrame = nextFrame;
        };
        Animation.prototype.play = function () {
            this.playLoop(1);
        };
        Animation.prototype.playReverse = function () {
            this.playLoop(-1);
        };
        Animation.prototype.playToBegin = function () {
            this.playTo(0);
        };
        Animation.prototype.playToEnd = function () {
            this.playTo(this._target.totalFrames - 1);
        };
        Animation.prototype.playFromBeginToEnd = function () {
            this._target.currentFrame = 0;
            this.playToEnd();
        };
        Animation.prototype.playFromEndToBegin = function () {
            this._target.currentFrame = this._target.totalFrames - 1;
            this.playToBegin();
        };
        Animation.prototype.gotoAndStop = function (frameNum) {
            this._target.currentFrame = frameNum;
            this.stop();
            return this;
        };
        Animation.prototype.gotoAndPlay = function (frameNum) {
            this._target.currentFrame = frameNum;
            this.play();
            return this;
        };
        Animation.prototype.onComplete = function (handler) {
            this._completeHandler = handler;
        };
        Animation.defaultTicksPerFrame = 1;
        return Animation;
    })();
    fl.Animation = Animation;
})(fl || (fl = {}));
/// <reference path="Core.ts" />
var fl;
(function (fl) {
    var Resource = (function () {
        function Resource(id) {
            this._id = id;
        }
        Resource.prototype.createInstance = function () {
            throw new Error("Not implemented");
        };
        Resource.prototype.dispose = function () {
            throw new Error("Not implemented");
        };
        Object.defineProperty(Resource.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        return Resource;
    })();
    fl.Resource = Resource;
})(fl || (fl = {}));
/// <reference path="Core.ts" />
var fl;
(function (fl) {
    var Bundle = (function () {
        function Bundle(name) {
            this.textures = {};
            this.resources = {};
            this.name = name;
        }
        Bundle.load = function (bundleName, onComplete) {
            console.log("Bundle.load: " + bundleName);
            var bundle = Bundle._bundles[bundleName];
            if (bundle)
                throw new Error("Bundle is already loaded: " + bundleName);
            bundle = new Bundle(bundleName);
            Bundle._bundles[bundleName] = bundle;
            bundle.load(onComplete);
        };
        Bundle.unload = function (bundleName) {
            console.log("Bundle.unload: " + bundleName);
            var bundle = Bundle._bundles[bundleName];
            if (!bundle)
                throw new Error("Bundle is not loaded: " + bundleName);
            Bundle._bundles[bundleName] = null;
            bundle.unload();
        };
        Bundle.getResource = function (resourceId) {
            var bundleId = resourceId.substr(0, resourceId.indexOf('/'));
            var bundle = Bundle._bundles[bundleId];
            if (!bundle)
                throw new Error('Bundle is not loaded: ' + resourceId);
            var res = bundle.resources[resourceId];
            if (res == null)
                throw new Error('Resource not found: ' + resourceId);
            return res;
        };
        Bundle.createSprite = function (id) {
            var res = Bundle.getResource(id);
            if (!(res instanceof fl.SpriteResource))
                throw new Error('Resource is not a Sprite: ' + id);
            return new fl.Sprite(res);
        };
        Bundle.createClip = function (id) {
            var res = Bundle.getResource(id);
            if (!(res instanceof fl.ClipResource))
                throw new Error('Resource is not a Clip: ' + id);
            return new fl.Clip(res);
        };
        Bundle.prototype.load = function (onComplete) {
            this.completeHandler = onComplete;
            this.loadResources();
        };
        Bundle.prototype.unload = function () {
            var _this = this;
            Object.keys(this.resources)
                .forEach(function (key) { return _this.resources[key].dispose(); });
            Object.keys(this.textures)
                .forEach(function (key) { return _this.textures[key].destroy(true); });
            this.resources = {};
            this.textures = {};
        };
        Bundle.prototype.loadResources = function () {
            var _this = this;
            var url = this.getUrl('bundle.json');
            var loader = new PIXI.JsonLoader(url);
            this.verboseLog('loading: ' + url);
            loader.on('loaded', function () {
                _this.verboseLog('OK: ' + url);
                _this.rawData = loader['json'];
                _this.loadTextures();
            });
            loader.load();
        };
        Bundle.prototype.loadTextures = function () {
            this.textures = {};
            for (var _i = 0, _a = this.rawData["textures"]; _i < _a.length; _i++) {
                var textureName = _a[_i];
                var url = this.getUrl(textureName + Bundle.TEXTURE_EXT);
                this.verboseLog('loading: ' + url);
                this.textures[textureName] = null;
                var loader = new PIXI.ImageLoader(url);
                loader.on('loaded', this.createTextureLoadedHandler(textureName, loader));
                loader.load();
            }
        };
        Bundle.prototype.createTextureLoadedHandler = function (textureName, loader) {
            var _this = this;
            return function () {
                _this.verboseLog("OK: " + textureName);
                _this.textures[textureName] = loader.texture;
                if (_this.allTexturesLoaded()) {
                    _this.createResources();
                    _this.complete();
                }
            };
        };
        Bundle.prototype.complete = function () {
            this.rawData = null;
            if (this.completeHandler != null)
                this.completeHandler();
        };
        Bundle.prototype.allTexturesLoaded = function () {
            var _this = this;
            return Object
                .keys(this.textures)
                .every(function (v, i, a) { return _this.textures[v] != null; });
        };
        Bundle.prototype.createResources = function () {
            for (var _i = 0, _a = this.rawData["symbols"]; _i < _a.length; _i++) {
                var symbol = _a[_i];
                var id = symbol.path;
                this.resources[id] = this.createResource(symbol);
                this.verboseLog(id);
            }
        };
        Bundle.prototype.createResource = function (json) {
            var type = json.type;
            if (type == "sprite") {
                var textureName = json.texture;
                var texture = this.textures[textureName];
                if (!texture)
                    throw new Error("Unknown texture: " + textureName);
                return fl.SpriteResource.fromJson(json, texture);
            }
            if (type == "clip")
                return fl.ClipResource.fromJson(json);
            throw new Error("Unknown resource type: " + type);
        };
        Bundle.prototype.verboseLog = function (message) {
            if (Bundle.VERBOSE_LOG)
                console.log("| " + message);
        };
        Bundle.prototype.getUrl = function (assetName) {
            return "assets/" + this.name + "/" + assetName;
        };
        Bundle.VERBOSE_LOG = false;
        Bundle.TEXTURE_EXT = ".png";
        Bundle._bundles = {};
        return Bundle;
    })();
    fl.Bundle = Bundle;
})(fl || (fl = {}));
/// <reference path="Core.ts" />
var fl;
(function (fl) {
    var Container = (function (_super) {
        __extends(Container, _super);
        function Container() {
            _super.apply(this, arguments);
            this.timelineInstanceId = -1;
            this.isFlashObject = true;
            this.labels = fl.Internal.EMPTY_ARRAY;
            this.color = { r: 1, g: 1, b: 1, a: 1 };
            this._currentFrame = 0;
            this._totalFrames = 1;
            //endregion
            this.globalColor = {};
        }
        Object.defineProperty(Container.prototype, "totalFrames", {
            get: function () { return this._totalFrames; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "currentFrame", {
            get: function () { return this._currentFrame; },
            set: function (value) {
                if (this._currentFrame != value) {
                    this._currentFrame = fl.clampRange(value, 0, this._totalFrames - 1);
                    this.handleFrameChange();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "animation", {
            get: function () {
                return this._animation
                    || (this._animation = new fl.Animation(this));
            },
            enumerable: true,
            configurable: true
        });
        Container.prototype.handleFrameChange = function () {
        };
        Container.prototype.updateTransform = function () {
            if (this._animation && this._animation.isActive)
                this.animation.update();
            this.updateColor();
            _super.prototype.updateTransform.call(this);
        };
        Container.prototype.updateColor = function () {
            var c = this.color;
            var r = c.r;
            var g = c.g;
            var b = c.b;
            var a = c.a;
            var gc = this.globalColor;
            var parentObject = this.parent;
            if (parentObject && parentObject.isFlashObject) {
                var pc = parentObject.globalColor;
                gc.r = r * pc.r;
                gc.g = g * pc.g;
                gc.b = b * pc.b;
                gc.a = a * pc.a;
            }
            else {
                gc.r = r;
                gc.g = g;
                gc.b = b;
                gc.a = a;
            }
        };
        Container.prototype.forEachFlashObject = function (action) {
            var n = this.children.length;
            for (var i = 0; i < n; i++) {
                var child = this.children[i];
                if (child.isFlashObject)
                    action(child);
            }
        };
        Container.prototype.getAll = function (predicate) {
            var result = [];
            var n = this.children.length;
            for (var i = 0; i < n; i++) {
                var child = this.children[i];
                if (child.isFlashObject && predicate(child))
                    result.push(child);
            }
            return result;
        };
        Container.prototype.getAllByPrefix = function (prefix) {
            return this.getAll(function (it) {
                return it.name && it.name.indexOf(prefix) == 0;
            });
        };
        Container.prototype.getByName = function (name, safe) {
            if (safe === void 0) { safe = false; }
            var n = this.children.length;
            for (var i = 0; i < n; i++) {
                var child = this.children[i];
                if (child.name == name)
                    return child;
            }
            if (safe)
                return null;
            else
                throw new Error("Child not found: " + name);
        };
        Container.prototype.getByPath = function (path, safe) {
            if (safe === void 0) { safe = false; }
            var parts = path.split('/');
            var target = this;
            for (var i = 0; i < parts.length; i++) {
                var child = target.getByName(parts[i]);
                if (!child)
                    return null;
                if (i + 1 == parts.length)
                    return child;
                if (!(child instanceof Container))
                    return null;
                target = child;
            }
            if (safe)
                return null;
            else
                throw new Error("Child not found: " + path);
        };
        Container.prototype.playAllChildren = function () {
            this.forEachFlashObject(function (it) {
                if (it.totalFrames > 1 || (it instanceof fl.Clip))
                    it.animation.play();
            });
        };
        return Container;
    })(PIXI.DisplayObjectContainer);
    fl.Container = Container;
})(fl || (fl = {}));
/// <reference path="Core.ts" />
var fl;
(function (fl) {
    (function (PlayType) {
        PlayType[PlayType["LOOP"] = 0] = "LOOP";
        PlayType[PlayType["ONCE"] = 1] = "ONCE";
        PlayType[PlayType["NONE"] = 2] = "NONE";
    })(fl.PlayType || (fl.PlayType = {}));
    var PlayType = fl.PlayType;
    var Clip = (function (_super) {
        __extends(Clip, _super);
        function Clip(resource) {
            _super.call(this);
            this.nestedPlayingType = PlayType.LOOP;
            this._instances = [];
            this._resource = resource;
            this._totalFrames = resource.frames.length;
            this.labels = resource.labels;
            this.constructInstances();
            this.handleFrameChange();
        }
        Clip.prototype.constructInstances = function () {
            var count = this._resource.instances.length;
            for (var i = 0; i < count; i++) {
                var instName = this._resource.instances[i].name;
                var resourcePath = this._resource.getResourcePath(i);
                var resource = fl.Bundle.getResource(resourcePath);
                var instance;
                if (resource != null) {
                    instance = resource.createInstance();
                }
                else if (resourcePath == "fl.text") {
                }
                instance.name = instName;
                this._instances[i] = instance;
            }
        };
        Clip.prototype.handleFrameChange = function () {
            this.updateChildren();
            fl.Internal.dispatchLabels(this);
        };
        Clip.prototype.updateChildren = function () {
            var frame = this._resource.frames[this._currentFrame];
            var childIndex = 0;
            var instanceIndex = 0;
            var instanceCount = frame.instances.length;
            while (childIndex < this.children.length && instanceIndex < instanceCount) {
                var child = this.children[childIndex];
                if (!child.isFlashObject) {
                    childIndex++;
                    continue;
                }
                var instance = frame.instances[instanceIndex];
                if (child.timelineInstanceId == instance.id) {
                    instance.applyPropertiesTo(child);
                    if (child.totalFrames > 1) {
                        if (this.nestedPlayingType == PlayType.LOOP)
                            child.stepForward();
                        else if (this.nestedPlayingType == PlayType.ONCE)
                            child.gotoNextFrame();
                    }
                    instanceIndex++;
                    childIndex++;
                }
                else if (frame.hasInstance(child.timelineInstanceId)) {
                    var newItem = this.getTimeLineItem(instance.id);
                    instance.applyPropertiesTo(newItem);
                    this.addChildAt(newItem, this.getChildIndex(child));
                    instanceIndex++;
                    childIndex++;
                }
                else {
                    if (child.timelineInstanceId >= 0)
                        this.removeChild(child);
                    else
                        childIndex++;
                }
            }
            while (instanceIndex < instanceCount) {
                var instance = frame.instances[instanceIndex];
                var newItem = this.getTimeLineItem(instance.id);
                instance.applyPropertiesTo(newItem);
                this.addChild(newItem);
                instanceIndex++;
                childIndex++;
            }
            while (childIndex < this.children.length) {
                var item = this.children[childIndex];
                if (!item.isFlashObject) {
                    childIndex++;
                    continue;
                }
                if (item.timelineInstanceId >= 0)
                    this.removeChild(item);
                else
                    childIndex++;
            }
        };
        Clip.prototype.getTimeLineItem = function (instanceId) {
            var instance = this._instances[instanceId];
            instance.timelineInstanceId = instanceId;
            instance.currentFrame = 0;
            return instance;
        };
        Object.defineProperty(Clip.prototype, "resource", {
            get: function () {
                return this._resource;
            },
            enumerable: true,
            configurable: true
        });
        Clip.prototype.toString = function () {
            return 'Clip[' + this._resource.id + ']';
        };
        Clip.prototype.tryGetElement = function (name) {
            var n = this._instances.length;
            for (var i = 0; i < n; i++) {
                var inst = this._instances[i];
                if (inst.name == name)
                    return inst;
            }
            return null;
        };
        Clip.prototype.getElement = function (name) {
            var element = this.tryGetElement(name);
            if (element)
                return element;
            else
                throw new Error("Instance not found: " + name);
        };
        Object.defineProperty(Clip.prototype, "instances", {
            get: function () {
                return this._instances;
            },
            enumerable: true,
            configurable: true
        });
        return Clip;
    })(fl.Container);
    fl.Clip = Clip;
})(fl || (fl = {}));
/// <reference path="Core.ts" />
var fl;
(function (fl) {
    var ClipResource = (function (_super) {
        __extends(ClipResource, _super);
        function ClipResource() {
            _super.apply(this, arguments);
        }
        ClipResource.fromJson = function (data) {
            var id = data.path;
            var r = new ClipResource(id);
            r.resources = data.resources;
            r.instances = ClipResource.readInstances(data.instances);
            r.frames = ClipResource.readFrames(data.frames, r.instances.length);
            r.labels = data.labels;
            return r;
        };
        ClipResource.readInstances = function (data) {
            var instances = [];
            for (var i = 0; i < data.length; i++) {
                var props = data[i];
                var inst = new InstanceInfo();
                inst.resourceNum = props[0];
                inst.name = props[1];
                instances[i] = inst;
            }
            return instances;
        };
        ClipResource.readFrames = function (data, totalInstCount) {
            var framesCount = data.length;
            var frames = [];
            for (var i = 0; i < framesCount; i++) {
                frames[i] = ClipResource.readFrame(data[i], totalInstCount);
            }
            return frames;
        };
        ClipResource.readFrame = function (data, totalInstCount) {
            var frame = new FrameData();
            frame.existingInstancesBits = [];
            for (var i = 0; i < totalInstCount; i++) {
                frame.existingInstancesBits[i] = false;
            }
            var instCount = data.length;
            frame.instances = [];
            for (var i = 0; i < instCount; i++) {
                var instance = ClipResource.readInstance(data[i]);
                frame.instances[i] = instance;
                frame.existingInstancesBits[instance.id] = true;
            }
            return frame;
        };
        ClipResource.readInstance = function (data) {
            var inst = new InstanceData();
            inst.id = data[0];
            inst.position = { x: data[1], y: data[2] };
            inst.rotation = data[3];
            inst.scale = { x: data[4], y: data[5] };
            inst.color = new Color();
            inst.color.r = data[6];
            inst.color.g = data[7];
            inst.color.b = data[8];
            inst.color.a = data[9];
            return inst;
        };
        ClipResource.prototype.createInstance = function () {
            return new fl.Clip(this);
        };
        ClipResource.prototype.getResourcePath = function (instanceId) {
            var resourceNum = this.instances[instanceId].resourceNum;
            return this.resources[resourceNum];
        };
        ClipResource.prototype.dispose = function () {
            this.resources = null;
            this.instances = null;
            this.frames = null;
            this.labels = null;
        };
        return ClipResource;
    })(fl.Resource);
    fl.ClipResource = ClipResource;
    var FrameData = (function () {
        function FrameData() {
        }
        FrameData.prototype.hasInstance = function (id) {
            return id >= 0
                && id < this.existingInstancesBits.length
                && this.existingInstancesBits[id];
        };
        FrameData.EMPTY_LABELS = [];
        return FrameData;
    })();
    var InstanceInfo = (function () {
        function InstanceInfo() {
        }
        return InstanceInfo;
    })();
    var Color = (function () {
        function Color() {
        }
        Color.prototype.clone = function () {
            return {
                r: this.r,
                g: this.g,
                b: this.b,
                a: this.a,
            };
        };
        return Color;
    })();
    fl.Color = Color;
    var InstanceData = (function () {
        function InstanceData() {
        }
        InstanceData.prototype.applyPropertiesTo = function (target) {
            target.position.x = this.position.x;
            target.position.y = this.position.y;
            target.rotation = this.rotation;
            target.scale.x = this.scale.x;
            target.scale.y = this.scale.y;
            target.color.r = this.color.r;
            target.color.g = this.color.g;
            target.color.b = this.color.b;
            target.color.a = this.color.a;
        };
        return InstanceData;
    })();
})(fl || (fl = {}));
/// <reference path="Core.ts" />
var fl;
(function (fl) {
    var Sprite = (function (_super) {
        __extends(Sprite, _super);
        //endregion
        function Sprite(resource) {
            _super.call(this, null);
            this.timelineInstanceId = -1;
            this.isFlashObject = true;
            this.labels = fl.Internal.EMPTY_ARRAY;
            this.color = { r: 1, g: 1, b: 1, a: 1 };
            this._currentFrame = 0;
            this._totalFrames = 1;
            this._resource = resource;
            this._totalFrames = resource.frames.length;
            this.labels = resource.labels;
            this.handleFrameChange();
        }
        Object.defineProperty(Sprite.prototype, "totalFrames", {
            get: function () { return this._totalFrames; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "currentFrame", {
            get: function () { return this._currentFrame; },
            set: function (value) {
                if (this._currentFrame != value) {
                    this._currentFrame = fl.clampRange(value, 0, this._totalFrames - 1);
                    this.handleFrameChange();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "animation", {
            get: function () {
                return this._animation
                    || (this._animation = new fl.Animation(this));
            },
            enumerable: true,
            configurable: true
        });
        Sprite.prototype.updateTransform = function () {
            if (this._animation && this._animation.isActive)
                this.animation.update();
            this.updateColor();
            var textureScale = this.resource.scale;
            if (textureScale != 1) {
                var scale = this.scale;
                var sx = scale.x;
                var sy = scale.y;
                scale.x /= textureScale;
                scale.y /= textureScale;
                _super.prototype.updateTransform.call(this);
                scale.x = sx;
                scale.y = sy;
            }
            else {
                _super.prototype.updateTransform.call(this);
            }
        };
        Sprite.prototype.updateColor = function () {
            var c = this.color;
            var r = c.r;
            var g = c.g;
            var b = c.b;
            var a = c.a;
            var parentObject = this.parent;
            if (parentObject && parentObject.isFlashObject) {
                var pc = parentObject.globalColor;
                r *= pc.r;
                g *= pc.g;
                b *= pc.b;
                a *= pc.a;
            }
            this.tint = 255 * r << 16 | 255 * g << 8 | 255 * b;
            this.alpha = a;
        };
        Sprite.prototype.handleFrameChange = function () {
            var frame = this._resource.frames[this._currentFrame];
            this.anchor.set(frame.anchor.x, frame.anchor.y);
            this.texture = frame.texture;
            fl.Internal.dispatchLabels(this);
        };
        Object.defineProperty(Sprite.prototype, "resource", {
            get: function () {
                return this._resource;
            },
            enumerable: true,
            configurable: true
        });
        Sprite.prototype.toString = function () {
            return 'Sprite[' + this._resource.id + ']';
        };
        return Sprite;
    })(PIXI.Sprite);
    fl.Sprite = Sprite;
})(fl || (fl = {}));
/// <reference path="Core.ts" />
var fl;
(function (fl) {
    var SpriteFrame = (function () {
        function SpriteFrame() {
        }
        return SpriteFrame;
    })();
    fl.SpriteFrame = SpriteFrame;
    var SpriteResource = (function (_super) {
        __extends(SpriteResource, _super);
        function SpriteResource() {
            _super.apply(this, arguments);
        }
        SpriteResource.fromJson = function (data, texture) {
            var id = data.path;
            var res = new SpriteResource(id);
            res.texture = texture;
            res.scale = data.scale;
            res.labels = data.labels;
            res.frames = [];
            for (var i = 0; i < data.frames.length; i++) {
                var props = data.frames[i];
                var bounds = new PIXI.Rectangle(props[0], props[1], props[2], props[3]);
                var anchor = (bounds.width > 0 && bounds.height > 0)
                    ? new PIXI.Point(props[4] / bounds.width, props[5] / bounds.height)
                    : new PIXI.Point();
                var frame = {
                    texture: new PIXI.Texture(texture.baseTexture, bounds),
                    anchor: anchor,
                    labels: props[6],
                };
                res.frames.push(frame);
            }
            return res;
        };
        SpriteResource.prototype.createInstance = function () {
            return new fl.Sprite(this);
        };
        SpriteResource.prototype.dispose = function () {
            this.texture.destroy(false);
            this.texture = null;
            this.frames = null;
            this.labels = null;
        };
        return SpriteResource;
    })(fl.Resource);
    fl.SpriteResource = SpriteResource;
})(fl || (fl = {}));
/// <reference path="Core.ts" />
var fl;
(function (fl) {
    var Button = (function () {
        //endregion
        function Button(target, action) {
            var _this = this;
            //region enabled
            this._enabled = true;
            fl.assertPresent(target, "target");
            this.content = target;
            this.onRelease = action;
            this.content.mouseover = function () {
                _this.setDownState();
            };
            this.content.mouseout = function () {
                _this.setUpState();
            };
            this.content.mousedown = function () {
                _this.setDownState();
                if (_this.onPress)
                    _this.onPress(_this);
            };
            this.content.mouseup = function () {
                if (_this.onRelease)
                    _this.onRelease(_this);
            };
            this.content.touchstart = function () {
                _this.setDownState();
                if (_this.onPress)
                    _this.onPress(_this);
            };
            this.content.touchend = function () {
                _this.setUpState();
                if (_this.onRelease)
                    _this.onRelease(_this);
            };
            this.content.touchendoutside = function () {
                _this.setUpState();
            };
            this.refreshEnabledState();
        }
        Object.defineProperty(Button.prototype, "enabled", {
            get: function () { return this._enabled; },
            set: function (value) {
                if (this._enabled != value) {
                    this._enabled = value;
                    this.refreshEnabledState();
                }
            },
            enumerable: true,
            configurable: true
        });
        Button.prototype.refreshEnabledState = function () {
            this.content.interactive = this._enabled;
            this.content.buttonMode = this._enabled;
        };
        Button.prototype.setDownState = function () {
            this.content.currentFrame = 1;
        };
        Button.prototype.setUpState = function () {
            this.content.currentFrame = 0;
        };
        return Button;
    })();
    fl.Button = Button;
})(fl || (fl = {}));
/// <reference path="../lib/pixi.d.ts" />
/// <reference path="FlashObject.ts" />
/// <reference path="Animation.ts" />
/// <reference path="Resource.ts" />
/// <reference path="Bundle.ts" />
/// <reference path="Container.ts" />
/// <reference path="Clip.ts" />
/// <reference path="ClipResource.ts" />
/// <reference path="Sprite.ts" />
/// <reference path="SpriteResource.ts" />
/// <reference path="Button.ts" />
var fl;
(function (fl) {
    applyMixins(fl.Container, fl.FlashObject);
    applyMixins(fl.Sprite, fl.FlashObject);
    function applyMixins(derived, base) {
        Object.getOwnPropertyNames(base.prototype).forEach(function (name) {
            derived.prototype[name] = base.prototype[name];
        });
    }
    fl.applyMixins = applyMixins;
    function assertPresent(value, name) {
        if (!value)
            throw new Error("Value not present: " + name);
    }
    fl.assertPresent = assertPresent;
    function clampRange(value, min, max) {
        if (value < min)
            return min;
        else if (value > max)
            return max;
        else
            return value;
    }
    fl.clampRange = clampRange;
    var Internal = (function () {
        function Internal() {
        }
        Internal.dispatchLabels = function (target) {
            if (!fl.onLabel)
                return;
            var n = target.labels.length;
            var frame = target.currentFrame;
            for (var i = 0; i < n; i++) {
                if (target.labels[i].frame == frame)
                    fl.onLabel(target, target.labels[i].name);
            }
        };
        Internal.EMPTY_ARRAY = [];
        return Internal;
    })();
    fl.Internal = Internal;
})(fl || (fl = {}));
// Generated code!
// see build.rb
var dressup_game;
(function (dressup_game) {
    var PartConfig = (function () {
        function PartConfig() {
        }
        return PartConfig;
    })();
    dressup_game.PartConfig = PartConfig;
    var Config = (function () {
        function Config() {
        }
        //{SIZE}
        Config.width = 760;
        Config.height = 610;
        //{SIZE}
        /**
         * Bindings for link buttons.
         * Each screen is recursively scanned for links.
         * If object's name is present in this map, button with navigation action is created
         * */
        Config.links = {
            //{LINKS}
            'small_logo': 'http://www.dressupgames.com/',
            'btn_more_seasons': 'http://www.dressupgames.com/',
            'btn_free_games': 'http://http://www.dressupgames.com/',
            'btn_fb': 'http://facebook.com/dressupgames',
        };
        Config.parts = {
            //{CONFIG}
            'btn_m1_opt1': { 'path': ['model_1/opt_1'], 'exclude': [], 'allowHide': false },
            'btn_m1_opt2': { 'path': ['model_1/opt_2'], 'exclude': ['model_1/opt_3', 'model_1/opt_4'], 'allowHide': true },
            'btn_m1_opt3': { 'path': ['model_1/opt_3'], 'exclude': ['model_1/opt_2'], 'allowHide': true },
            'btn_m1_opt4': { 'path': ['model_1/opt_4'], 'exclude': ['model_1/opt_2'], 'allowHide': true },
            'btn_m1_opt5': { 'path': ['model_1/opt_5'], 'exclude': [], 'allowHide': true },
            'btn_m1_opt6': { 'path': ['model_1/opt_6'], 'exclude': [], 'allowHide': true },
            'btn_m1_opt7': { 'path': ['model_1/opt_7'], 'exclude': [], 'allowHide': true },
            'btn_m1_opt8': { 'path': ['model_1/opt_8'], 'exclude': [], 'allowHide': true },
            'btn_m1_opt9': { 'path': ['model_1/opt_9'], 'exclude': [], 'allowHide': true },
            'btn_m1_opt10': { 'path': ['model_1/opt_10'], 'exclude': [], 'allowHide': true },
            'btn_m1_opt11': { 'path': ['model_1/opt_11'], 'exclude': [], 'allowHide': true },
            'btn_m1_opt12': { 'path': ['model_1/opt_12'], 'exclude': [], 'allowHide': true },
            'btn_m1_opt13': { 'path': ['model_1/opt_13'], 'exclude': [], 'allowHide': true },
            'btn_m1_opt14': { 'path': ['model_1/opt_14'], 'exclude': [], 'allowHide': true },
            'btn_m1_opt15': { 'path': ['model_1/opt_15'], 'exclude': [], 'allowHide': true },
            'btn_m2_opt1': { 'path': ['model_2/opt_1'], 'exclude': [], 'allowHide': false },
            'btn_m2_opt2': { 'path': ['model_2/opt_2'], 'exclude': ['model_2/opt_3', 'model_2/opt_4'], 'allowHide': true },
            'btn_m2_opt3': { 'path': ['model_2/opt_3'], 'exclude': ['model_2/opt_2'], 'allowHide': true },
            'btn_m2_opt4': { 'path': ['model_2/opt_4'], 'exclude': ['model_2/opt_2'], 'allowHide': true },
            'btn_m2_opt5': { 'path': ['model_2/opt_5'], 'exclude': [], 'allowHide': true },
            'btn_m2_opt6': { 'path': ['model_2/opt_6'], 'exclude': [], 'allowHide': true },
            'btn_m2_opt7': { 'path': ['model_2/opt_7'], 'exclude': [], 'allowHide': true },
            'btn_m2_opt8': { 'path': ['model_2/opt_8'], 'exclude': [], 'allowHide': true },
            'btn_m2_opt9': { 'path': ['model_2/opt_9'], 'exclude': [], 'allowHide': true },
            'btn_m2_opt10': { 'path': ['model_2/opt_10'], 'exclude': [], 'allowHide': true },
            'btn_m2_opt11': { 'path': ['model_2/opt_11'], 'exclude': [], 'allowHide': true },
            'btn_m2_opt12': { 'path': ['model_2/opt_12'], 'exclude': [], 'allowHide': true },
            'btn_m2_opt13': { 'path': ['model_2/opt_13'], 'exclude': [], 'allowHide': true },
            'btn_m2_opt14': { 'path': ['model_2/opt_14'], 'exclude': [], 'allowHide': true },
            'btn_m2_opt15': { 'path': ['model_2/opt_15'], 'exclude': [], 'allowHide': true },
            'btn_m3_opt1': { 'path': ['model_3/opt_1'], 'exclude': [], 'allowHide': false },
            'btn_m3_opt2': { 'path': ['model_3/opt_2'], 'exclude': [], 'allowHide': true },
            'btn_m3_opt3': { 'path': ['model_3/opt_3'], 'exclude': [], 'allowHide': true },
            'btn_m3_opt4': { 'path': ['model_3/opt_4'], 'exclude': [], 'allowHide': true },
            'btn_m3_opt5': { 'path': ['model_3/opt_5'], 'exclude': [], 'allowHide': true },
            'btn_m3_opt6': { 'path': ['model_3/opt_6'], 'exclude': [], 'allowHide': true },
            'btn_m3_opt7': { 'path': ['model_3/opt_7'], 'exclude': [], 'allowHide': true },
            'btn_m3_opt8': { 'path': ['model_3/opt_8'], 'exclude': [], 'allowHide': true },
            'btn_m3_opt9': { 'path': ['model_3/opt_9'], 'exclude': [], 'allowHide': true },
            'btn_m3_opt10': { 'path': ['model_3/opt_10'], 'exclude': [], 'allowHide': true },
            'btn_m3_opt11': { 'path': ['model_3/opt_11'], 'exclude': [], 'allowHide': true },
            'btn_m3_opt12': { 'path': ['model_3/opt_12'], 'exclude': [], 'allowHide': true },
            'btn_m3_opt13': { 'path': ['model_3/opt_13'], 'exclude': [], 'allowHide': true },
            'btn_m3_opt14': { 'path': ['model_3/opt_14'], 'exclude': [], 'allowHide': true },
            'btn_m3_opt15': { 'path': ['model_3/opt_15'], 'exclude': [], 'allowHide': true },
        };
        return Config;
    })();
    dressup_game.Config = Config;
})(dressup_game || (dressup_game = {}));
var dressup_game;
(function (dressup_game) {
    /** Base class for all screens */
    var AppScreen = (function () {
        function AppScreen(name, content) {
            this.name = "AppScreen";
            this.name = name;
            this.content = content;
            this.configureContent(content);
        }
        AppScreen.prototype.getElement = function (name) {
            return this.content.getElement(name);
        };
        AppScreen.prototype.configureContent = function (content) {
            var _this = this;
            content.instances.forEach(function (it) {
                var url;
                /** check whether object is link button */
                if (url = dressup_game.Config.links[it.name]) {
                    new fl.Button(it, function () { return window.open(url, '_blank'); });
                    return;
                }
                /** autoplay objects without name */
                if (!it.name && it.totalFrames > 1) {
                    it.animation.play();
                    return;
                }
                if (it instanceof fl.Clip)
                    _this.configureContent(it);
            });
        };
        return AppScreen;
    })();
    dressup_game.AppScreen = AppScreen;
})(dressup_game || (dressup_game = {}));
var dressup_game;
(function (dressup_game) {
    var IntroScreen = (function (_super) {
        __extends(IntroScreen, _super);
        function IntroScreen() {
            _super.call(this, 'IntroScreen', fl.Bundle.createClip('intro/intro_screen'));
            this.playButton = new fl.Button(this.getElement('btn_play'), function () {
                fl.Bundle.unload('intro');
                dressup_game.App.changeScreen(new dressup_game.SceneScreen());
            });
            this.loadingClip = this.getElement('loading');
            var intro = this.getElement('intro_anim');
            intro.nestedPlayingType = fl.PlayType.ONCE;
            intro.animation.playToEnd();
            this.loadSceneBundle();
        }
        IntroScreen.prototype.loadSceneBundle = function () {
            var _this = this;
            this.playButton.content.visible = false;
            this.loadingClip.animation.play();
            fl.Bundle.load('scene', function () {
                _this.loadingClip.animation.stop();
                _this.loadingClip.visible = false;
                _this.playButton.content.visible = true;
            });
        };
        return IntroScreen;
    })(dressup_game.AppScreen);
    dressup_game.IntroScreen = IntroScreen;
})(dressup_game || (dressup_game = {}));
var dressup_game;
(function (dressup_game) {
    var SceneScreen = (function (_super) {
        __extends(SceneScreen, _super);
        function SceneScreen() {
            var _this = this;
            _super.call(this, 'SceneScreen', fl.Bundle.createClip('scene/scene_screen'));
            this._backButton = this.createBackButton();
            this._models = this.content
                .getAllByPrefix(SceneScreen.MODEL_PREFIX)
                .map(function (it) { return _this.processModel(it); });
            this._partButtons = this.content
                .getAllByPrefix(SceneScreen.PART_BTN_PREFIX)
                .map(function (it) { return new fl.Button(it, function (btn) { return _this.onPartButtonClick(btn); }); });
            this._backgrounds = this.content
                .getAllByPrefix(SceneScreen.BG_PREFIX);
            this._controls = this.initControlPanel();
        }
        SceneScreen.prototype.createBackButton = function () {
            var _this = this;
            return new fl.Button(this.content.getElement('btnBackground'), function () {
                _this._backgrounds.forEach(function (it) { return it.stepForward(); });
            });
        };
        SceneScreen.prototype.processModel = function (model) {
            var _this = this;
            model.getAllByPrefix(SceneScreen.PART_PREFIX)
                .forEach(function (it) { return _this.processModelPart(it); });
            return model;
        };
        SceneScreen.prototype.processModelPart = function (part) {
            var cfg = this.getPartConfig(part);
            if (cfg.allowHide) {
                part.interactive = true;
                part.buttonMode = true;
                part.mouseup = function (it) { return part.visible = false; };
            }
            part.visible = part.gotoLabel('default_frame');
        };
        SceneScreen.prototype.onPartButtonClick = function (btn) {
            var _this = this;
            var btnName = btn.content.name;
            var btnConfig = dressup_game.Config.parts[btnName];
            if (!btnConfig)
                throw new Error("Config not found for button: " + btnName);
            btnConfig.path.forEach(function (it) { return _this.toggleModelPart(it); });
            btnConfig.exclude.forEach(function (it) { return _this.hideModelPart(it); });
        };
        SceneScreen.prototype.toggleModelPart = function (path) {
            var clip = this.getModelPart(path);
            if (!clip.visible)
                clip.visible = true;
            else
                clip.stepForward();
        };
        SceneScreen.prototype.hideModelPart = function (path) {
            this.getModelPart(path).visible = false;
        };
        SceneScreen.prototype.getModelPart = function (path) {
            var result = this.content.getByPath(path);
            if (!result)
                throw new Error("Content not found: " + path);
            return result;
        };
        SceneScreen.prototype.getPartConfig = function (part) {
            var model = part.parent;
            var modelNum = model.name.replace(/\D+/, "");
            var optionNum = part.name.replace(/\D+/, "");
            var optionId = "btn_m" + modelNum + "_opt" + optionNum;
            var config = dressup_game.Config.parts[optionId];
            if (config)
                return config;
            else
                throw new Error("Config not found: " + optionId);
        };
        //
        // ControlPanel
        //
        SceneScreen.prototype.initControlPanel = function () {
            var _this = this;
            var controls = this.content.getElement('controls');
            controls.nestedPlayingType = fl.PlayType.NONE;
            var saveBtn = controls.tryGetElement("btn_save");
            if (saveBtn)
                saveBtn.visible = false;
            this.tryCreateButton(controls, "btn_reset", function () {
                _this.resetModels();
            });
            this.tryCreateButton(controls, "btn_photo", function () {
                _this.setControlsVisible(false);
                controls.currentFrame = 1;
            });
            this.tryCreateButton(controls, "btn_back", function () {
                _this.setControlsVisible(true);
                controls.currentFrame = 0;
            });
            return controls;
        };
        SceneScreen.prototype.tryCreateButton = function (container, name, action) {
            var clip = container.tryGetElement(name);
            if (clip)
                new fl.Button(clip, action);
        };
        SceneScreen.prototype.setControlsVisible = function (value) {
            this._partButtons.forEach(function (it) { return it.content.visible = value; });
            this._backButton.content.visible = value;
        };
        SceneScreen.prototype.resetModels = function () {
            var _this = this;
            this._models.forEach(function (model) {
                model.getAllByPrefix(SceneScreen.PART_PREFIX).forEach(function (part) {
                    var info = _this.getPartConfig(part);
                    if (info.allowHide)
                        part.visible = false;
                });
            });
        };
        SceneScreen.MODEL_PREFIX = "model";
        SceneScreen.PART_PREFIX = "opt";
        SceneScreen.PART_BTN_PREFIX = "btn_m";
        SceneScreen.BG_PREFIX = "back";
        return SceneScreen;
    })(dressup_game.AppScreen);
    dressup_game.SceneScreen = SceneScreen;
})(dressup_game || (dressup_game = {}));
/// <reference path="fl/Core.ts" />
/// <reference path="Config.ts" />
/// <reference path="AppScreen.ts" />
/// <reference path="IntroScreen.ts" />
/// <reference path="SceneScreen.ts" />
var dressup_game;
(function (dressup_game) {
    dressup_game.STAGE_COLOR = 0xffffff;
    dressup_game.FORCE_USE_CANVAS = false;
    function initialize(containerId) {
        var container = document.getElementById(containerId);
        if (!container)
            throw new Error("Element not found: id=\"" + containerId + "\"");
        App.initialize();
        container.appendChild(App.canvas);
    }
    dressup_game.initialize = initialize;
    /** Application facade */
    var App = (function () {
        function App() {
        }
        App.initialize = function () {
            fl.Animation.defaultTicksPerFrame = 2;
            App.initStage();
            App.loadIntro();
            requestAnimFrame(App.animate);
        };
        App.initStage = function () {
            App.stage = new PIXI.Stage(dressup_game.STAGE_COLOR);
            App.renderer = dressup_game.FORCE_USE_CANVAS
                ? new PIXI.CanvasRenderer(dressup_game.Config.width, dressup_game.Config.height)
                : PIXI.autoDetectRenderer(dressup_game.Config.width, dressup_game.Config.height);
        };
        App.loadIntro = function () {
            fl.Bundle.load('intro', function () { return App.changeScreen(new dressup_game.IntroScreen()); });
        };
        App.animate = function () {
            try {
                var view = App.renderer.view;
                var w = view.clientWidth;
                var h = view.clientHeight;
                if (this._clientWidth != w || this._clientHeight != h) {
                    App.renderer.resize(w, h);
                    App.refreshScreenScale();
                    this._clientWidth = w;
                    this._clientHeight = h;
                }
                App.renderer.render(App.stage);
                requestAnimFrame(App.animate);
            }
            catch (e) {
                console.error("Stage error: probably some resources are unloaded but still present on the stage");
                throw e;
            }
        };
        App.refreshScreenScale = function () {
            if (App._screen) {
                var appScale = Math.min(App.renderer.width / dressup_game.Config.width, App.renderer.height / dressup_game.Config.height);
                App._screen.content.scale.x = appScale;
                App._screen.content.scale.y = appScale;
            }
        };
        App.changeScreen = function (screen) {
            console.log("App.changeScreen: " + screen.name);
            if (App._screen)
                App.stage.removeChild(App._screen.content);
            App._screen = screen;
            if (App._screen)
                App.stage.addChild(App._screen.content);
            App.refreshScreenScale();
        };
        Object.defineProperty(App, "canvas", {
            get: function () {
                return App.renderer.view;
            },
            enumerable: true,
            configurable: true
        });
        App._clientWidth = -1;
        App._clientHeight = -1;
        return App;
    })();
    dressup_game.App = App;
})(dressup_game || (dressup_game = {}));
//# sourceMappingURL=dressup.js.map