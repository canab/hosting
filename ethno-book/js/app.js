var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var fl;
(function (fl) {
    var FlashObject = (function (_super) {
        __extends(FlashObject, _super);
        function FlashObject() {
            _super.apply(this, arguments);
        }
        return FlashObject;
    }(PIXI.Container));
    fl.FlashObject = FlashObject;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var FrameLabel = (function () {
        function FrameLabel() {
        }
        return FrameLabel;
    }());
    fl.FrameLabel = FrameLabel;
    var FrameObject = (function (_super) {
        __extends(FrameObject, _super);
        function FrameObject() {
            _super.apply(this, arguments);
        }
        FrameObject.prototype.gotoLabel = function (label) {
            var n = this.labels.length;
            for (var i = 0; i < n; i++) {
                if (this.labels[i].name == label) {
                    this.currentFrame = this.labels[i].frame;
                    return true;
                }
            }
            return false;
        };
        FrameObject.prototype.stepForward = function () {
            if (this.currentFrame + 1 < this.totalFrames)
                this.currentFrame = this.currentFrame + 1;
            else
                this.currentFrame = 0;
            return this;
        };
        FrameObject.prototype.stepBackward = function () {
            if (this.currentFrame > 0)
                this.currentFrame = this.currentFrame - 1;
            else
                this.currentFrame = this.totalFrames - 1;
            return this;
        };
        FrameObject.prototype.gotoNextFrame = function () {
            if (this.currentFrame + 1 < this.totalFrames)
                this.currentFrame = this.currentFrame + 1;
            return this;
        };
        FrameObject.prototype.gotoPrevFrame = function () {
            if (this.currentFrame > 0)
                this.currentFrame = this.currentFrame - 1;
            return this;
        };
        FrameObject.prototype.gotoFirstFrame = function () {
            this.currentFrame = 0;
            return this;
        };
        FrameObject.prototype.gotoLastFrame = function () {
            this.currentFrame = this.totalFrames - 1;
            return this;
        };
        FrameObject.prototype.gotoRandomFrame = function () {
            this.currentFrame = (Math.random() * this.totalFrames) | 0;
            return this;
        };
        FrameObject.prototype.isFirstFrame = function () {
            return this.currentFrame == 0;
        };
        FrameObject.prototype.isLastFrame = function () {
            return this.currentFrame == this.totalFrames - 1;
        };
        return FrameObject;
    }(fl.FlashObject));
    fl.FrameObject = FrameObject;
})(fl || (fl = {}));
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
            this._endFrame = fl.Internal.clampRange(endFrame, 0, this._target.totalFrames - 1);
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
        };
        Animation.prototype.gotoAndPlay = function (frameNum) {
            this._target.currentFrame = frameNum;
            this.play();
        };
        Animation.prototype.onComplete = function (handler) {
            this._completeHandler = handler;
            return this;
        };
        Animation.defaultTicksPerFrame = 1;
        return Animation;
    }());
    fl.Animation = Animation;
})(fl || (fl = {}));
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
        Object.defineProperty(Resource.prototype, "name", {
            get: function () {
                var id = this._id;
                return id.substr(id.lastIndexOf("/") + 1);
            },
            enumerable: true,
            configurable: true
        });
        return Resource;
    }());
    fl.Resource = Resource;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var PlaceholderResource = (function (_super) {
        __extends(PlaceholderResource, _super);
        function PlaceholderResource(id) {
            _super.call(this, id);
        }
        PlaceholderResource.prototype.createInstance = function () {
            return new fl.Placeholder();
        };
        PlaceholderResource.prototype.dispose = function () {
        };
        return PlaceholderResource;
    }(fl.Resource));
    fl.PlaceholderResource = PlaceholderResource;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var Bundle = (function () {
        function Bundle(name) {
            this.textures = {};
            this.resources = {};
            this.name = name;
        }
        Bundle.createPlaceholders = function () {
            var bundle = new Bundle("placeholders");
            bundle.resources["placeholders/empty"] = new fl.PlaceholderResource("placeholders/empty");
            return bundle;
        };
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
        Bundle.createFlashObject = function (id) {
            var res = Bundle.getResource(id);
            if (res instanceof fl.SpriteResource)
                return new fl.Sprite(res);
            else if (res instanceof fl.ClipResource)
                new fl.Clip(res);
            else
                throw new Error('Unknown resource type: ' + id);
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
            this.verboseLog('loading: ' + url);
            new PIXI.loaders.Loader().add('json', url).load(function (loader, resources) {
                _this.verboseLog('OK: ' + url);
                _this.rawData = resources['json'].data;
                if (_this.rawData)
                    _this.loadTextures();
            });
        };
        Bundle.prototype.loadTextures = function () {
            var _this = this;
            this.textures = {};
            var names = this.rawData["textures"];
            var loader = new PIXI.loaders.Loader;
            var _loop_1 = function(textureName) {
                url = this_1.getUrl(textureName + Bundle.textureExt);
                this_1.verboseLog('loading: ' + url);
                loader.add(textureName, url, function () {
                    _this.textures[textureName] = loader.resources[textureName].texture;
                    _this.verboseLog("OK: " + textureName);
                });
            };
            var this_1 = this;
            var url;
            for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
                var textureName = names_1[_i];
                _loop_1(textureName);
            }
            loader.load(function () {
                _this.createResources();
                _this.complete();
            });
        };
        Bundle.prototype.complete = function () {
            this.rawData = null;
            if (this.completeHandler != null)
                this.completeHandler();
        };
        Bundle.prototype.createResources = function () {
            for (var _i = 0, _a = this.rawData['symbols']; _i < _a.length; _i++) {
                var symbol = _a[_i];
                var id = symbol.path;
                this.resources[id] = this.createResource(symbol);
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
            if (Bundle.verboseLog)
                console.log("| " + message);
        };
        Bundle.prototype.getUrl = function (assetName) {
            return Bundle.rootPath + "/" + this.name + "/" + assetName + "?v=" + Bundle.version;
        };
        Bundle.version = "0";
        Bundle.rootPath = "assets";
        Bundle.textureExt = ".png";
        Bundle.verboseLog = true;
        Bundle._bundles = {
            "placeholders": Bundle.createPlaceholders()
        };
        return Bundle;
    }());
    fl.Bundle = Bundle;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var Container = (function (_super) {
        __extends(Container, _super);
        function Container() {
            _super.apply(this, arguments);
            this.timelineIndex = -1;
            this.labels = fl.Internal.EMPTY_ARRAY;
            this.color = new fl.Color(1, 1, 1, 1);
            this.isFlashObject = true;
            this.isFrameObject = false;
            this.scaleMultiplier = 1;
            this.globalColor = {};
        }
        Object.defineProperty(Container.prototype, "scaleX", {
            get: function () { return this.scale.x * this.scaleMultiplier; },
            set: function (value) { this.scale.x = value / this.scaleMultiplier; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "scaleY", {
            get: function () { return this.scale.y * this.scaleMultiplier; },
            set: function (value) { this.scale.y = value / this.scaleMultiplier; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "scaleXY", {
            get: function () { return 0.5 * (this.scaleX + this.scaleY); },
            set: function (value) { this.scaleX = value; this.scaleY = value; },
            enumerable: true,
            configurable: true
        });
        Container.prototype.handleFrameChange = function () {
        };
        Container.prototype.updateTransform = function () {
            if (!this.visible)
                return;
            var animable = this;
            if (animable.isFlashObject && animable.animation && animable.animation.isActive)
                animable.animation.update();
            this.updateColor();
            if (this.matrix) {
                var pt = this.parent.worldTransform;
                var wt = this.worldTransform;
                var m = this.matrix;
                wt.a = m.a * pt.a + m.b * pt.c;
                wt.b = m.a * pt.b + m.b * pt.d;
                wt.c = m.c * pt.a + m.d * pt.c;
                wt.d = m.c * pt.b + m.d * pt.d;
                wt.tx = m.tx * pt.a + m.ty * pt.c + pt.tx;
                wt.ty = m.tx * pt.b + m.ty * pt.d + pt.ty;
                for (var i = 0, j = this.children.length; i < j; ++i) {
                    this.children[i].updateTransform();
                }
                this.worldAlpha = this.alpha * this.parent.worldAlpha;
                this._currentBounds = null;
            }
            else {
                _super.prototype.updateTransform.call(this);
            }
        };
        Container.prototype.updateColor = function () {
            var lc = this.color;
            var gc = this.globalColor;
            var parentObject = this.parent;
            if (parentObject && parentObject.isFlashObject) {
                var pc = parentObject.globalColor;
                gc.r = lc.r * pc.r;
                gc.g = lc.g * pc.g;
                gc.b = lc.b * pc.b;
                gc.a = lc.a * pc.a;
            }
            else {
                gc.r = lc.r;
                gc.g = lc.g;
                gc.b = lc.b;
                gc.a = lc.a;
            }
        };
        return Container;
    }(PIXI.Container));
    fl.Container = Container;
})(fl || (fl = {}));
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
            this.isFrameObject = true;
            this._currentFrame = 0;
            this._totalFrames = 1;
            this.nestedPlayingType = PlayType.LOOP;
            this._instances = [];
            this._resource = resource;
            this._totalFrames = resource.frames.length;
            this.labels = resource.labels;
            this.constructChildren();
            this.handleFrameChange();
        }
        Object.defineProperty(Clip.prototype, "totalFrames", {
            get: function () { return this._totalFrames; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Clip.prototype, "currentFrame", {
            get: function () { return this._currentFrame; },
            set: function (value) {
                if (this._currentFrame != value) {
                    this._currentFrame = fl.Internal.clampRange(value, 0, this._totalFrames - 1);
                    this.handleFrameChange();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Clip.prototype, "animation", {
            get: function () {
                return this._animation
                    || (this._animation = new fl.Animation(this));
            },
            enumerable: true,
            configurable: true
        });
        Clip.prototype.constructChildren = function () {
            var count = this._resource.instances.length;
            for (var i = 0; i < count; i++) {
                var childName = this._resource.instances[i].name;
                var resource = this._resource.getChildResource(i);
                var child;
                if (typeof resource == "string") {
                    child = fl.Bundle
                        .getResource(resource)
                        .createInstance();
                }
                else if (resource.hasOwnProperty("text")) {
                    child = fl.Text.fromData(resource["text"]);
                }
                child.name = childName;
                this._instances[i] = child;
            }
        };
        Clip.prototype.handleFrameChange = function () {
            this.updateChildren();
            fl.Internal.dispatchLabels(this);
        };
        Clip.prototype.updateChildren = function () {
            var frame = this._resource.frames[this._currentFrame];
            var childIndex = 0;
            var propsIndex = 0;
            var propsCount = frame.instances.length;
            while (childIndex < this.children.length && propsIndex < propsCount) {
                var child = this.children[childIndex];
                if (!child.isFlashObject) {
                    childIndex++;
                    continue;
                }
                var childProps = frame.instances[propsIndex];
                if (child.timelineIndex == childProps.id) {
                    childProps.applyTo(child);
                    if (child.isFlashObject) {
                        var animable = child;
                        if (animable.totalFrames > 1) {
                            if (this.nestedPlayingType == PlayType.LOOP)
                                animable.stepForward();
                            else if (this.nestedPlayingType == PlayType.ONCE)
                                animable.gotoNextFrame();
                        }
                    }
                    propsIndex++;
                    childIndex++;
                }
                else if (frame.containsIndex(child.timelineIndex)) {
                    var newItem = this.getTimeLineItem(childProps.id);
                    childProps.applyTo(newItem);
                    this.addChildAt(newItem, this.getChildIndex(child));
                    propsIndex++;
                    childIndex++;
                }
                else {
                    if (child.timelineIndex >= 0)
                        this.removeChildAt(childIndex);
                    else
                        childIndex++;
                }
            }
            while (propsIndex < propsCount) {
                var childProps = frame.instances[propsIndex];
                var newItem = this.getTimeLineItem(childProps.id);
                childProps.applyTo(newItem);
                this.addChild(newItem);
                propsIndex++;
                childIndex++;
            }
            while (childIndex < this.children.length) {
                var item = this.children[childIndex];
                if (!item.isFlashObject) {
                    childIndex++;
                    continue;
                }
                if (item.timelineIndex >= 0)
                    this.removeChildAt(childIndex);
                else
                    childIndex++;
            }
        };
        Clip.prototype.getTimeLineItem = function (instanceId) {
            var instance = this._instances[instanceId];
            instance.timelineIndex = instanceId;
            if (instance.isFlashObject)
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
    }(fl.Container));
    fl.Clip = Clip;
})(fl || (fl = {}));
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
                var inst = new ChildInfo();
                inst.resIndex = props[0];
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
            var props = new ChildProps();
            props.id = data[0];
            props.position = new PIXI.Point(data[1], data[2]);
            props.rotation = data[3];
            props.scale = new PIXI.Point(data[4], data[5]);
            props.color = new fl.Color(data[6], data[7], data[8], data[9]);
            var matrixData = data[10];
            if (matrixData) {
                props.matrix = new PIXI.Matrix();
                props.matrix.a = matrixData[0];
                props.matrix.b = matrixData[1];
                props.matrix.c = matrixData[2];
                props.matrix.d = matrixData[3];
                props.matrix.tx = matrixData[4];
                props.matrix.ty = matrixData[5];
            }
            return props;
        };
        ClipResource.prototype.createInstance = function () {
            return new fl.Clip(this);
        };
        ClipResource.prototype.getChildResource = function (childIndex) {
            var resIndex = this.instances[childIndex].resIndex;
            return this.resources[resIndex];
        };
        ClipResource.prototype.dispose = function () {
            this.resources = null;
            this.instances = null;
            this.frames = null;
            this.labels = null;
        };
        return ClipResource;
    }(fl.Resource));
    fl.ClipResource = ClipResource;
    var FrameData = (function () {
        function FrameData() {
        }
        FrameData.prototype.containsIndex = function (id) {
            return id >= 0
                && id < this.existingInstancesBits.length
                && this.existingInstancesBits[id];
        };
        FrameData.EMPTY_LABELS = [];
        return FrameData;
    }());
    var ChildInfo = (function () {
        function ChildInfo() {
        }
        return ChildInfo;
    }());
    var ChildProps = (function () {
        function ChildProps() {
            this.matrixChecked = false;
        }
        ChildProps.prototype.applyTo = function (target) {
            target.position.x = this.position.x;
            target.position.y = this.position.y;
            target.rotation = this.rotation;
            target.scaleX = this.scale.x;
            target.scaleY = this.scale.y;
            target.color.r = this.color.r;
            target.color.g = this.color.g;
            target.color.b = this.color.b;
            target.color.a = this.color.a;
            if (!this.matrixChecked) {
                if (this.matrix && target.scaleMultiplier > 0 && target.scaleMultiplier != 1)
                    this.matrix = null;
                this.matrixChecked = true;
            }
            target.matrix = this.matrix;
        };
        return ChildProps;
    }());
})(fl || (fl = {}));
var fl;
(function (fl) {
    var Sprite = (function (_super) {
        __extends(Sprite, _super);
        function Sprite(resource) {
            _super.call(this, null);
            this.timelineIndex = -1;
            this.color = new fl.Color(1, 1, 1, 1);
            this.isFlashObject = true;
            this.isFrameObject = true;
            this.scaleMultiplier = 1;
            this._currentFrame = 0;
            this._totalFrames = 1;
            this.labels = fl.Internal.EMPTY_ARRAY;
            this.setResourceInternal(resource);
            this.scaleMultiplier = resource.scale;
            this.scaleXY = 1;
        }
        Object.defineProperty(Sprite.prototype, "scaleX", {
            get: function () { return this.scale.x * this.scaleMultiplier; },
            set: function (value) { this.scale.x = value / this.scaleMultiplier; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "scaleY", {
            get: function () { return this.scale.y * this.scaleMultiplier; },
            set: function (value) { this.scale.y = value / this.scaleMultiplier; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "scaleXY", {
            get: function () { return 0.5 * (this.scaleX + this.scaleY); },
            set: function (value) { this.scaleX = value; this.scaleY = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "totalFrames", {
            get: function () { return this._totalFrames; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "currentFrame", {
            get: function () { return this._currentFrame; },
            set: function (value) {
                if (this._currentFrame != value) {
                    this._currentFrame = fl.Internal.clampRange(value, 0, this._totalFrames - 1);
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
            fl.Internal.applyColor(this);
            if (this.matrix) {
                var pt = this.parent.worldTransform;
                var wt = this.worldTransform;
                var m = this.matrix;
                wt.a = m.a * pt.a + m.b * pt.c;
                wt.b = m.a * pt.b + m.b * pt.d;
                wt.c = m.c * pt.a + m.d * pt.c;
                wt.d = m.c * pt.b + m.d * pt.d;
                wt.tx = m.tx * pt.a + m.ty * pt.c + pt.tx;
                wt.ty = m.tx * pt.b + m.ty * pt.d + pt.ty;
                this.worldAlpha = this.alpha * this.parent.worldAlpha;
                this._currentBounds = null;
            }
            else {
                _super.prototype.updateTransform.call(this);
            }
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
            set: function (value) {
                this.setResourceInternal(value);
                this.currentFrame = 0;
            },
            enumerable: true,
            configurable: true
        });
        Sprite.prototype.setResourceInternal = function (value) {
            this._resource = value;
            this._totalFrames = value.frames.length;
            this._currentFrame = 0;
            this.labels = value.labels;
            this.handleFrameChange();
        };
        Sprite.prototype.toString = function () {
            return 'Sprite[' + this._resource.id + ']';
        };
        return Sprite;
    }(PIXI.Sprite));
    fl.Sprite = Sprite;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var SpriteFrame = (function () {
        function SpriteFrame() {
        }
        return SpriteFrame;
    }());
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
    }(fl.Resource));
    fl.SpriteResource = SpriteResource;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var Placeholder = (function (_super) {
        __extends(Placeholder, _super);
        function Placeholder() {
            _super.apply(this, arguments);
        }
        Placeholder.prototype.getBounds = function (matrix) {
            if (!this._currentBounds) {
                var bounds = Placeholder.predefinedBounds;
                var w0 = bounds.x;
                var w1 = bounds.width + bounds.x;
                var h0 = bounds.y;
                var h1 = bounds.height + bounds.y;
                var worldTransform = matrix || this.worldTransform;
                var a = worldTransform.a;
                var b = worldTransform.b;
                var c = worldTransform.c;
                var d = worldTransform.d;
                var tx = worldTransform.tx;
                var ty = worldTransform.ty;
                var x1 = a * w1 + c * h1 + tx;
                var y1 = d * h1 + b * w1 + ty;
                var x2 = a * w0 + c * h1 + tx;
                var y2 = d * h1 + b * w0 + ty;
                var x3 = a * w0 + c * h0 + tx;
                var y3 = d * h0 + b * w0 + ty;
                var x4 = a * w1 + c * h0 + tx;
                var y4 = d * h0 + b * w1 + ty;
                var maxX = x1;
                var maxY = y1;
                var minX = x1;
                var minY = y1;
                minX = x2 < minX ? x2 : minX;
                minX = x3 < minX ? x3 : minX;
                minX = x4 < minX ? x4 : minX;
                minY = y2 < minY ? y2 : minY;
                minY = y3 < minY ? y3 : minY;
                minY = y4 < minY ? y4 : minY;
                maxX = x2 > maxX ? x2 : maxX;
                maxX = x3 > maxX ? x3 : maxX;
                maxX = x4 > maxX ? x4 : maxX;
                maxY = y2 > maxY ? y2 : maxY;
                maxY = y3 > maxY ? y3 : maxY;
                maxY = y4 > maxY ? y4 : maxY;
                bounds = this._bounds;
                bounds.x = minX;
                bounds.width = maxX - minX;
                bounds.y = minY;
                bounds.height = maxY - minY;
                this._currentBounds = bounds;
            }
            return this._currentBounds;
        };
        Placeholder.prototype.getLoaclBounds = function () {
            return Placeholder.predefinedBounds;
        };
        Placeholder.predefinedBounds = new PIXI.Rectangle(0, 0, 100, 100);
        return Placeholder;
    }(fl.Container));
    fl.Placeholder = Placeholder;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var Button = (function () {
        function Button(target, action) {
            var _this = this;
            this._enabled = true;
            fl.assertPresent(target, "targetCell");
            this.content = target;
            this.onRelease = action;
            this.content.on("mouseover", function () {
                _this.setDownState();
            });
            this.content.on("mouseout", function () {
                _this.setUpState();
            });
            this.content.on("mousedown", function (e) {
                _this.setDownState();
                if (_this.onPress)
                    _this.onPress(_this, e);
            });
            this.content.on("mouseup", function (e) {
                if (_this.onRelease)
                    _this.onRelease(_this, e);
            });
            this.content.on("touchstart", function (e) {
                _this.setDownState();
                if (_this.onPress)
                    _this.onPress(_this, e);
            });
            this.content.on("touchend", function (e) {
                _this.setUpState();
                if (_this.onRelease)
                    _this.onRelease(_this, e);
            });
            this.content.on("touchendoutside", function () {
                _this.setUpState();
            });
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
            var states = this.content;
            if (states.isFlashObject) {
                states.currentFrame = 1;
                states.updateTransform();
            }
        };
        Button.prototype.setUpState = function () {
            var states = this.content;
            if (states.isFlashObject) {
                states.currentFrame = 0;
                states.updateTransform();
            }
        };
        return Button;
    }());
    fl.Button = Button;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var Anchor = (function () {
        function Anchor(source, sourceProperty, target, targetProperty, multiplier) {
            if (multiplier === void 0) { multiplier = 1.0; }
            this._target = target;
            this._targetProperty = targetProperty;
            this._source = source;
            this._sourceProperty = sourceProperty;
            this._multiplier = multiplier;
            this._distance = source[sourceProperty] * multiplier - target[targetProperty];
        }
        Anchor.prototype.apply = function () {
            this._target[this._targetProperty] = this._source[this._sourceProperty] * this._multiplier - this._distance;
        };
        return Anchor;
    }());
    fl.Anchor = Anchor;
})(fl || (fl = {}));
var fl;
(function (fl) {
    applyMixins(fl.Container, fl.FlashObject);
    applyMixins(fl.Clip, fl.FrameObject);
    applyMixins(fl.Sprite, fl.FlashObject);
    applyMixins(fl.Sprite, fl.FrameObject);
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
})(fl || (fl = {}));
var app;
(function (app) {
    var AppScreen = (function () {
        function AppScreen(name) {
            this.name = "AppScreen";
            this._size = new PIXI.Point();
            this._anchors = [];
            this._modifiers = [
                new app.RandomGroup(),
                new app.AutoPlayAnim(),
            ];
            this._keyActions = {};
            this.name = name;
        }
        AppScreen.prototype.createContent = function (path) {
            var content = fl.Bundle.createClip(path);
            this.content = content;
            this._size.x = app.BASE_WIDTH;
            this._size.y = app.BASE_HEIGHT;
            this._reserve = content.children.length > 0
                ? Math.abs(content.getChildAt(0).x)
                : 0;
            this.configureContent(content);
            this.configureAnchors();
        };
        AppScreen.prototype.configureContent = function (content) {
            var _this = this;
            content.forEachRecursive(function (it) {
                if (_this.applyModifier(it))
                    return;
                if (it instanceof fl.Clip)
                    _this.configureContent(it);
            });
        };
        AppScreen.prototype.applyModifier = function (target) {
            for (var _i = 0, _a = this._modifiers; _i < _a.length; _i++) {
                var modifier = _a[_i];
                if (modifier.accepts(target)) {
                    modifier.process(target);
                    return true;
                }
            }
            return false;
        };
        AppScreen.prototype.configureAnchors = function () {
            var _this = this;
            var leftGuid = this.content.getChildByName("guid_left");
            var left = leftGuid ? leftGuid.x : Number.MIN_VALUE;
            var rightGuid = this.content.getChildByName("guid_right");
            var right = rightGuid ? rightGuid.x : Number.MAX_VALUE;
            this.content.children.forEach(function (it) {
                if (app.StringUtil.startsWith(it.name, "back"))
                    return;
                if (it.x <= left)
                    _this.addAnchor(_this, "contentLeft", it, "x");
                else if (it.x >= right)
                    _this.addAnchor(_this, "contentRight", it, "x");
            });
        };
        AppScreen.prototype.addAnchor = function (source, sourceProperty, target, targetProperty, multiplier) {
            if (multiplier === void 0) { multiplier = 1.0; }
            this._anchors.push(new fl.Anchor(source, sourceProperty, target, targetProperty, multiplier));
        };
        Object.defineProperty(AppScreen.prototype, "contentLeft", {
            get: function () {
                var left = (-this.content.x) / this.content.scale.x;
                return Math.max(-this._reserve, left);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppScreen.prototype, "contentRight", {
            get: function () {
                var right = (this.width - this.content.x) / this.content.scale.x;
                return Math.min(right, app.BASE_WIDTH + this._reserve);
            },
            enumerable: true,
            configurable: true
        });
        AppScreen.prototype.validateLayout = function () {
            var scaleX = this.width / app.BASE_WIDTH;
            var scaleY = this.height / app.BASE_HEIGHT;
            var scale = Math.min(scaleX, scaleY);
            this.content.scale.x = scale;
            this.content.scale.y = scale;
            this.content.x = 0.5 * (this.width - app.BASE_WIDTH * scale);
            for (var _i = 0, _a = this._anchors; _i < _a.length; _i++) {
                var a = _a[_i];
                a.apply();
            }
            this.onLayoutChanged();
        };
        AppScreen.prototype.onLayoutChanged = function () { };
        ;
        Object.defineProperty(AppScreen.prototype, "width", {
            get: function () {
                return this._size.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppScreen.prototype, "height", {
            get: function () {
                return this._size.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppScreen.prototype, "size", {
            get: function () {
                return this._size;
            },
            enumerable: true,
            configurable: true
        });
        AppScreen.prototype.resize = function (x, y) {
            this._size.x = x;
            this._size.y = y;
            this.validateLayout();
        };
        AppScreen.prototype.bindKey = function (keyCode, action) {
            this._keyActions[keyCode] = action;
        };
        AppScreen.prototype.bindResource = function (namePrefix, action) {
            this._modifiers.push(new app.ResourceModifier(namePrefix, action));
        };
        AppScreen.prototype.bindButtonRes = function (name, action) {
            var buttonFactory = function (it) { return new fl.Button(it, action); };
            this._modifiers.push(new app.ResourceModifier(name, buttonFactory));
        };
        AppScreen.prototype.handleKeyDown = function (e) {
            var action = this._keyActions[e.keyCode];
            if (action)
                action();
        };
        AppScreen.prototype.getChild = function (path) {
            var child = this.content.findByPath(path);
            if (child == null)
                throw new Error("Child not found: " + path);
            return child;
        };
        return AppScreen;
    }());
    app.AppScreen = AppScreen;
})(app || (app = {}));
var app;
(function (app) {
    var IntroScreen = (function (_super) {
        __extends(IntroScreen, _super);
        function IntroScreen() {
            _super.call(this, 'IntroScreen');
            this.bindKey(83, app.Nav.gotoMainMenu);
            this.bindButtonRes("btn_skip_intro", app.Nav.gotoMainMenu);
            this.createContent('intro/intro_screen');
            this.content.animation
                .onComplete(function () { return setTimeout(app.Nav.gotoMainMenu); })
                .playFromBeginToEnd();
        }
        return IntroScreen;
    }(app.AppScreen));
    app.IntroScreen = IntroScreen;
})(app || (app = {}));
var app;
(function (app) {
    var MainMenuScreen = (function (_super) {
        __extends(MainMenuScreen, _super);
        function MainMenuScreen() {
            var _this = this;
            _super.call(this, "MainMenuScreen");
            this.bindButtonRes("btn_play_again", app.Nav.gotoIntro);
            this.bindResource("menu_point", function (it) { return _this.initMenuPoint(it); });
            this.createContent("intro/menu_screen");
        }
        MainMenuScreen.prototype.initMenuPoint = function (obj) {
            var pointName = obj.resource.name;
            var pointNum = pointName.split("_").pop();
            var contentId = "chapter_" + pointNum;
            new fl.Button(obj, function () { return app.Nav.gotoContent(contentId); });
        };
        return MainMenuScreen;
    }(app.AppScreen));
    app.MainMenuScreen = MainMenuScreen;
})(app || (app = {}));
var app;
(function (app) {
    app.BASE_WIDTH = 1024;
    app.BASE_HEIGHT = 768;
    app.forceUseCanvas = false;
    app.startupMode = "";
    function initialize() {
        App.initialize();
        document.body.querySelector("#app").appendChild(App.canvas);
        window.onresize = function () { return App.isLayoutValid = false; };
        window.onkeydown = function (e) { return App.handleKeyDown(e); };
    }
    app.initialize = initialize;
    var App = (function () {
        function App() {
        }
        App.initialize = function () {
            App._fpsField = document.querySelector("#fps");
            fl.Animation.defaultTicksPerFrame = 2;
            fl.Bundle.version = new Date().getTime().toString();
            fl.onFrameLabel = App.handleLabel;
            App.initStage();
            App.loadBundle();
            App.validateLayout();
            requestAnimationFrame(App.animate);
        };
        App.initStage = function () {
            PIXI.DEFAULT_RENDER_OPTIONS.clearBeforeRender = false;
            PIXI.DEFAULT_RENDER_OPTIONS.antialias = false;
            PIXI.DEFAULT_RENDER_OPTIONS.autoResize = false;
            PIXI.DEFAULT_RENDER_OPTIONS.transparent = false;
            App.stage = new PIXI.Container();
            App.renderer = app.forceUseCanvas
                ? new PIXI.CanvasRenderer(app.BASE_WIDTH, app.BASE_HEIGHT)
                : PIXI.autoDetectRenderer(app.BASE_WIDTH, app.BASE_HEIGHT);
        };
        App.loadBundle = function () {
            if (app.startupMode == "test")
                fl.Bundle.load('test', function () { return App.changeScreen(new app.TestScreen()); });
            if (app.startupMode == "menu")
                fl.Bundle.load('intro', function () { return App.changeScreen(new app.MainMenuScreen()); });
            else
                fl.Bundle.load('intro', function () { return App.changeScreen(new app.IntroScreen()); });
        };
        App.validateLayout = function () {
            var w = window.innerWidth;
            var h = window.innerHeight;
            var res = window.devicePixelRatio;
            var canvas = App.renderer.view;
            App.renderer.resize(w * res, h * res);
            canvas.style.width = w + "px";
            canvas.style.height = h + "px";
            App.adjustScreenSize();
            App.isLayoutValid = true;
        };
        App.animate = function () {
            requestAnimationFrame(App.animate);
            if (!App.isLayoutValid)
                App.validateLayout();
            App.renderer.render(App.stage);
            if (App._fpsField)
                App._fpsField.innerHTML = app.FpsMeter.instance.getFPS().toString();
        };
        App.adjustScreenSize = function () {
            if (App._screen)
                App._screen.resize(App.renderer.width, App.renderer.height);
        };
        App.handleLabel = function (sender, label) {
            if (label.indexOf("goto_") == 0) {
                var frame = Number(label.substr(5));
                if (frame > 0)
                    sender.currentFrame = frame - 1;
            }
            else if (label == "stop") {
                sender.animation.stop();
            }
        };
        App.handleKeyDown = function (e) {
            if (App._screen)
                App._screen.handleKeyDown(e);
        };
        App.changeScreen = function (screen) {
            console.log("App.changeScreen: " + screen.name);
            if (App._screen)
                App.stage.removeChild(App._screen.content);
            App._screen = screen;
            if (App._screen)
                App.stage.addChild(App._screen.content);
            App.adjustScreenSize();
        };
        Object.defineProperty(App, "canvas", {
            get: function () {
                return App.renderer.view;
            },
            enumerable: true,
            configurable: true
        });
        App.isLayoutValid = false;
        return App;
    }());
    app.App = App;
})(app || (app = {}));
var app;
(function (app) {
    var ContentScreen = (function (_super) {
        __extends(ContentScreen, _super);
        function ContentScreen(contentId) {
            var _this = this;
            _super.call(this, "ContentScreen");
            this.contentId = contentId;
            this.bindButtonRes("btn_home", app.Nav.gotoMainMenu);
            this.bindButtonRes("btn_sound", function (it) { return _this.onSoundClick(it); });
            this.createContent("intro/content_common_page");
        }
        ContentScreen.prototype.onSoundClick = function (btn) {
            btn.content.stepForward();
        };
        return ContentScreen;
    }(app.AppScreen));
    app.ContentScreen = ContentScreen;
})(app || (app = {}));
var app;
(function (app) {
    var Nav = (function () {
        function Nav() {
        }
        Nav.gotoIntro = function () {
            app.App.changeScreen(new app.IntroScreen());
        };
        Nav.gotoMainMenu = function () {
            app.App.changeScreen(new app.MainMenuScreen());
        };
        Nav.gotoContent = function (contentId) {
            app.App.changeScreen(new app.ContentScreen(contentId));
        };
        return Nav;
    }());
    app.Nav = Nav;
})(app || (app = {}));
var app;
(function (app) {
    var TestScreen = (function (_super) {
        __extends(TestScreen, _super);
        function TestScreen() {
            _super.call(this, 'TestScreen');
            this.createContent('test/skew_screen');
            this.content.animation.play();
        }
        return TestScreen;
    }(app.AppScreen));
    app.TestScreen = TestScreen;
})(app || (app = {}));
var fl;
(function (fl) {
    var Color = (function () {
        function Color(r, g, b, a) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        Color.fromNum = function (value) {
            var r = (value & 0xFF0000) >> 16;
            var g = (value & 0x00FF00) >> 8;
            var b = (value & 0x0000FF);
            return new Color(r / 255.0, g / 255.0, b / 255.0, 1);
        };
        Color.prototype.clone = function () {
            return new Color(this.r, this.g, this.b, this.a);
        };
        Color.prototype.setTo = function (value) {
            value.r = this.r;
            value.g = this.g;
            value.b = this.b;
            value.a = this.a;
        };
        Color.prototype.setFrom = function (value) {
            this.r = value.r;
            this.g = value.g;
            this.b = value.b;
            this.a = value.a;
        };
        return Color;
    }());
    fl.Color = Color;
})(fl || (fl = {}));
var fl;
(function (fl) {
    var Internal = (function () {
        function Internal() {
        }
        Internal.dispatchLabels = function (target) {
            if (!fl.onFrameLabel)
                return;
            var n = target.labels.length;
            var frame = target.currentFrame;
            for (var i = 0; i < n; i++) {
                if (target.labels[i].frame == frame)
                    fl.onFrameLabel(target, target.labels[i].name);
            }
        };
        Internal.applyColor = function (target) {
            var lc = target.color;
            var parent = target.parent;
            if (parent && parent.isFlashObject) {
                var gc = parent.globalColor;
                var r = lc.r * gc.r;
                var g = lc.g * gc.g;
                var b = lc.b * gc.b;
                var a = lc.a * gc.a;
            }
            else {
                var r = lc.r;
                var g = lc.g;
                var b = lc.b;
                var a = lc.a;
            }
            target.tint = 255 * r << 16 | 255 * g << 8 | 255 * b;
            target.alpha = a;
        };
        Internal.clampRange = function (value, min, max) {
            if (value < min)
                return min;
            else if (value > max)
                return max;
            else
                return value;
        };
        Internal.EMPTY_ARRAY = [];
        return Internal;
    }());
    fl.Internal = Internal;
})(fl || (fl = {}));
var PIXI;
(function (PIXI) {
    PIXI.DisplayObject.prototype.detach = function () {
        if (this.parent)
            this.parent.removeChild(this);
    };
    PIXI.Container.prototype.forEachRecursive = function (action) {
        var n = this.children.length;
        for (var i = 0; i < n; i++) {
            var child = this.children[i];
            if (child.isFlashObject)
                action(child);
            if (child instanceof PIXI.Container)
                child.forEachRecursive(action);
        }
    };
    PIXI.Container.prototype.forEachFrameObject = function (action) {
        var n = this.children.length;
        for (var i = 0; i < n; i++) {
            var child = this.children[i];
            if (child.isFrameObject)
                action(child);
        }
    };
    PIXI.Container.prototype.findAll = function (predicate) {
        var result = [];
        var n = this.children.length;
        for (var i = 0; i < n; i++) {
            var child = this.children[i];
            if (predicate(child))
                result.push(child);
        }
        return result;
    };
    PIXI.Container.prototype.findAllByPrefix = function (prefix) {
        return this.findAll(function (it) {
            return it.name && it.name.indexOf(prefix) == 0;
        });
    };
    PIXI.Container.prototype.findByPath = function (path) {
        var parts = path.split('/');
        var target = this;
        for (var i = 0; i < parts.length; i++) {
            var child = target.getChildByName(parts[i]);
            if (!child)
                return null;
            if (i + 1 == parts.length)
                return child;
            if (!(child instanceof PIXI.Container))
                return null;
            target = child;
        }
        return null;
    };
    PIXI.Container.prototype.playAllChildren = function () {
        this.children.forEach(function (it) {
            var animable = it;
            if (animable.totalFrames > 1)
                animable.animation.play();
        });
    };
    PIXI.Container.prototype.stopAllChildren = function () {
        this.children.forEach(function (it) {
            var animable = it;
            if (animable.totalFrames > 1)
                animable.animation.stop();
        });
    };
})(PIXI || (PIXI = {}));
var fl;
(function (fl) {
    var Text = (function (_super) {
        __extends(Text, _super);
        function Text(text, style) {
            _super.call(this, text, style);
            this.timelineIndex = -1;
            this.color = new fl.Color(1, 1, 1, 1);
            this.isFlashObject = true;
            this.isFrameObject = false;
            this.scaleMultiplier = 1;
        }
        Text.fromData = function (data) {
            var text = data.text || "";
            var style = {};
            style.font = (data.bold ? "bold " : "")
                + (data.italic ? "italic " : "")
                + (data.fontSize + "px ")
                + data.fontName;
            style.fill = data.color;
            style.align = data.align;
            style.padding = 20;
            style.wordWrap = data.multiline;
            style.wordWrapWidth = data.textWidth;
            style.lineHeight = Math.floor(data.fontSize * 1.15) + data.lineSpacing;
            if (data.shadowColor) {
                style.dropShadow = true;
                style.dropShadowColor = data.shadowColor;
                style.dropShadowAngle = data.shadowAngle;
                style.dropShadowDistance = data.shadowDistance;
            }
            if (data.strokeColor) {
                style.stroke = data.strokeColor;
                style.strokeThickness = data.strokeThickness;
                style.lineHeight -= Math.max(1, Math.floor(0.25 * data.strokeThickness));
                style.lineJoin = "round";
            }
            var field = new fl.Text(text, style);
            if (data.align == "center")
                field.anchor.x = 0.5;
            else if (data.align == "right")
                field.anchor.x = 1;
            return field;
        };
        Object.defineProperty(Text.prototype, "scaleX", {
            get: function () { return this.scale.x * this.scaleMultiplier; },
            set: function (value) { this.scale.x = value / this.scaleMultiplier; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text.prototype, "scaleY", {
            get: function () { return this.scale.y * this.scaleMultiplier; },
            set: function (value) { this.scale.y = value / this.scaleMultiplier; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text.prototype, "scaleXY", {
            get: function () { return 0.5 * (this.scaleX + this.scaleY); },
            set: function (value) { this.scaleX = value; this.scaleY = value; },
            enumerable: true,
            configurable: true
        });
        Text.prototype.updateTransform = function () {
            fl.Internal.applyColor(this);
            _super.prototype.updateTransform.call(this);
        };
        return Text;
    }(PIXI.Text));
    fl.Text = Text;
})(fl || (fl = {}));
var app;
(function (app) {
    var AutoPlayAnim = (function () {
        function AutoPlayAnim() {
        }
        AutoPlayAnim.prototype.accepts = function (target) {
            return app.StringUtil.startsWith(target.name, "autoPlay");
        };
        AutoPlayAnim.prototype.process = function (target) {
            if (app.StringUtil.startsWith(target.name, "autoPlayOnce"))
                target.animation.playFromBeginToEnd();
            else
                target.animation.play();
        };
        return AutoPlayAnim;
    }());
    app.AutoPlayAnim = AutoPlayAnim;
})(app || (app = {}));
var app;
(function (app) {
    var RandomGroup = (function () {
        function RandomGroup() {
            this.groups = {};
        }
        RandomGroup.prototype.accepts = function (target) {
            return target.isFrameObject
                && target.name
                && target.name.split("_")[0] == "randomGroup";
        };
        RandomGroup.prototype.process = function (target) {
            var parts = target.name.split("_");
            var groupName = parts.length > 1 ? parts[1] : "__default__";
            var group = this.groups[groupName];
            if (!group)
                this.groups[groupName] = group = new Group();
            group.items.push(target);
            group.playFirst();
        };
        return RandomGroup;
    }());
    app.RandomGroup = RandomGroup;
    var Group = (function () {
        function Group() {
            this.items = [];
        }
        Group.prototype.playFirst = function () {
            var _this = this;
            if (this.current)
                return;
            this.current = app.ArrayUtil.randomItem(this.items);
            this.current.currentFrame = app.MathUtil.randomInt(this.current.totalFrames);
            this.current.animation.onComplete(function () { return _this.playNext(); });
            this.current.animation.playToEnd();
        };
        Group.prototype.playNext = function () {
            var _this = this;
            this.current = app.ArrayUtil.randomItem(this.items);
            this.current.animation.onComplete(function () { return _this.playNext(); });
            this.current.animation.playFromBeginToEnd();
        };
        return Group;
    }());
})(app || (app = {}));
var app;
(function (app) {
    var ResourceModifier = (function () {
        function ResourceModifier(prefix, action) {
            this.prefix = prefix;
            this.action = action;
        }
        ResourceModifier.prototype.accepts = function (target) {
            return target.isFrameObject
                && target.resource.name
                && target.resource.name.indexOf(this.prefix) == 0;
        };
        ResourceModifier.prototype.process = function (target) {
            this.action(target);
        };
        return ResourceModifier;
    }());
    app.ResourceModifier = ResourceModifier;
})(app || (app = {}));
var app;
(function (app) {
    var ArrayUtil = (function () {
        function ArrayUtil() {
        }
        ArrayUtil.randomItem = function (array) {
            return array[Math.floor(Math.random() * array.length)];
        };
        return ArrayUtil;
    }());
    app.ArrayUtil = ArrayUtil;
})(app || (app = {}));
var app;
(function (app) {
    var FpsMeter = (function () {
        function FpsMeter() {
            this.startTime = 0;
            this.frameNum = 0;
        }
        FpsMeter.prototype.getFPS = function () {
            this.frameNum++;
            var d = new Date().getTime();
            var currentTime = (d - this.startTime) / 1000;
            var result = Math.floor((this.frameNum / currentTime));
            if (currentTime > 1) {
                this.startTime = new Date().getTime();
                this.frameNum = 0;
            }
            return result;
        };
        FpsMeter.instance = new FpsMeter();
        return FpsMeter;
    }());
    app.FpsMeter = FpsMeter;
})(app || (app = {}));
var app;
(function (app) {
    var MathUtil = (function () {
        function MathUtil() {
        }
        MathUtil.randomInt = function (maxValue) {
            return Math.floor(Math.random() * maxValue);
        };
        return MathUtil;
    }());
    app.MathUtil = MathUtil;
})(app || (app = {}));
var app;
(function (app) {
    var StringUtil = (function () {
        function StringUtil() {
        }
        StringUtil.startsWith = function (str, prefix) {
            return str && str.indexOf(prefix) == 0;
        };
        return StringUtil;
    }());
    app.StringUtil = StringUtil;
})(app || (app = {}));
//# sourceMappingURL=app.js.map