import React, { useEffect } from 'react';
import { spine } from '../build/spine-webgl';

import Skeleton from '../build/skeleton.skel';
import Atlas from '../build/skeleton.atlas';

export default function SpineFull() {
  var canvas;
  var gl;
  var shader;
  var batcher;
  var mvp = new spine.webgl.Matrix4();
  var skeletonRenderer;
  var assetManager;

  var debugRenderer;

  var lastFrameTime;
  var skeletons = {};
  var activeSkeleton = 'skeleton';

  var shapes;

  // var png = SkeletonPNG;

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    console.log('INIT!!');
    canvas = document.getElementById('reactionCanvas');
    canvas.width = 400;
    canvas.height = 400;

    var config = { alpha: true };
    gl =
      canvas.getContext('webgl', config) ||
      canvas.getContext('experimental-webgl', config);
    if (!gl) {
      alert('WebGL is unavailable.');
      return;
    }

    // Create a simple shader, mesh, model-view-projection matrix, SkeletonRenderer, and AssetManager.
    shader = spine.webgl.Shader.newTwoColoredTextured(gl);
    batcher = new spine.webgl.PolygonBatcher(gl);
    mvp.ortho2d(0, 0, canvas.width - 1, canvas.height - 1);
    skeletonRenderer = new spine.webgl.SkeletonRenderer(gl);
    assetManager = new spine.webgl.AssetManager(gl);

    // Create a debug renderer and the ShapeRenderer it needs to render lines.
    debugRenderer = new spine.webgl.SkeletonDebugRenderer(gl);
    debugRenderer.drawRegionAttachments = true;
    debugRenderer.drawBoundingBoxes = true;
    debugRenderer.drawMeshHull = true;
    debugRenderer.drawMeshTriangles = true;
    debugRenderer.drawPaths = true;
    // debugShader = spine.webgl.Shader.newColored(gl);
    shapes = new spine.webgl.ShapeRenderer(gl);

    // Tell AssetManager to load the resources for each skeleton, including the exported .skel file, the .atlas file and the .png
    // file for the atlas. We then wait until all resources are loaded in the load() method.
    assetManager.loadBinary(Skeleton);
    assetManager.loadTextureAtlas(Atlas);

    requestAnimationFrame(load);
  };

  const load = () => {
    if (assetManager.isLoadingComplete()) {
      skeletons['skeleton'] = loadSkeleton('skeleton', 'thumbs-up', true);
      // var state = skeletons[activeSkeleton].state;
      // var stateData = state.data;
      // var skeleton = skeletons[activeSkeleton].skeleton;

      // setInterval(()=>{
      //   if (lastFiveFrames.length === 5){
      //     lastFiveFrames.shift()
      //     lastFiveFrames.push(frameCount);
      //   } else{
      //     lastFiveFrames.push(frameCount)
      //   }
      //   if (lastFiveFrames.length > 0){
      //     var total = 0;
      //     lastFiveFrames.map((frame)=>{
      //       total = total + frame;
      //     })
      //     FPS = total / lastFiveFrames.length;
      //     // console.log(FPS)
      //   }
      //   // console.log(Math.lastFiveFrames);
      //   frameCount = 0;
      // }, 1000);

      //CHECK FOR EVENTS TRIGGERED
      // var canvasDiv = document.getElementById('canvas-div');

      lastFrameTime = Date.now() / 1000;

      requestAnimationFrame(render);
    } else {
      requestAnimationFrame(load);
    }
  };

  const loadSkeleton = (name, initialAnimation, premultipliedAlpha, skin) => {
    if (skin === undefined) skin = 'default';

    // Load the texture atlas using name.atlas from the AssetManager.
    var atlas = assetManager.get(Atlas);

    // Create a AtlasAttachmentLoader that resolves region, mesh, boundingbox and path attachments
    var atlasLoader = new spine.AtlasAttachmentLoader(atlas);

    // Create a SkeletonBinary instance for parsing the .skel file.
    var skeletonBinary = new spine.SkeletonBinary(atlasLoader);

    // Set the scale to apply during parsing, parse the file, and create a new skeleton.
    skeletonBinary.scale = 1;
    var skeletonData = skeletonBinary.readSkeletonData(
      assetManager.get(Skeleton),
    );
    var skeleton = new spine.Skeleton(skeletonData);
    skeleton.setSkinByName(skin);
    var bounds = calculateSetupPoseBounds(skeleton);

    // Create an AnimationState, and set the initial animation in looping mode.
    var animationStateData = new spine.AnimationStateData(skeleton.data);
    var animationState = new spine.AnimationState(animationStateData);
    if (name == 'spineboy') {
      animationStateData.setMix('walk', 'jump', 0.4);
      animationStateData.setMix('jump', 'run', 0.4);
      animationState.setAnimation(0, 'walk', true);
      animationState.addAnimation(0, 'run', true, 0);
    } else {
      animationState.setAnimation(0, initialAnimation, true);
    }
    // animationState.addListener({
    //   start: function (track) {
    //     // console.log("Animation on track " + track.trackIndex + " started");
    //   },
    //   interrupt: function (track) {
    //     // console.log("Animation on track " + track.trackIndex + " interrupted");
    //   },
    //   end: function (track) {
    //     // console.log("Animation on track " + track.trackIndex + " ended");
    //   },
    //   disposed: function (track) {
    //     // console.log("Animation on track " + track.trackIndex + " disposed");
    //   },
    //   complete: function (track) {
    //     // console.log("Animation on track " + track.trackIndex + " completed");
    //     // if(!startGame){
    //     //   setIntroClass('introDiv active')
    //     // } else{
    //     //   props.startGame();
    //     // }
    //   },
    //   event: function (track, event) {
    //     // console.log("Event on track " + track.trackIndex + ": " + JSON.stringify(event));
    //   },
    // });

    // Pack everything up and return to caller.
    return {
      skeleton: skeleton,
      state: animationState,
      bounds: bounds,
      premultipliedAlpha: premultipliedAlpha,
    };
  };

  const calculateSetupPoseBounds = (skeleton) => {
    skeleton.setToSetupPose();
    skeleton.updateWorldTransform();
    var offset = new spine.Vector2();
    var size = new spine.Vector2();
    skeleton.getBounds(offset, size, []);
    return { offset: offset, size: size };
  };

  const resize = () => {
    // var w = canvas.clientWidth;
    // var h = canvas.clientHeight;
    // console.log("size: ",w, h)
    // if (canvas.width != w || canvas.height != h) {
    // canvas.width = w;
    // canvas.height = h;
    // }

    // canvas.width = 812;
    // canvas.height  = 375;

    // Calculations to center the skeleton in the canvas.
    var bounds = skeletons[activeSkeleton].bounds;
    // console.log(bounds);
    // var centerX = bounds.offset.x + bounds.size.x / 2;
    // var centerY = bounds.offset.y + bounds.size.y / 2;
    // console.log("centerX: ", centerX, " centerY: ", centerY)
    // var centerX = -406 + 812 / 2;
    // var centerY = -(375/2) + 375 / 2;
    // console.log("centerX: ", centerX, " centerY: ", centerY)
    // var centerX = 0;
    // var centerY = 0;
    // console.log("centerX: ", centerX, " centerY: ", centerY)
    var scaleX = bounds.size.x / canvas.width;
    var scaleY = bounds.size.y / canvas.height;
    // console.log(scaleX, scaleY)
    // var scaleX, scaleY = .1;
    var scale = Math.max(scaleX, scaleY) * 1.2;
    if (scale < 1) scale = 1;
    var width = canvas.width * 0.8; // * scale;
    var height = canvas.height; // * scale;
    // var width = widthState;
    // var width = canvas.width;
    // var height = canvas.height;
    // mvp.ortho2d(centerX - width / 2, centerY - height / 2, width, height);
    // console.log(-canvas.width + bounds.size.x/2)
    mvp.ortho2d(-width / 2, -height / 2, width, height);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };

  const render = () => {
    var now = Date.now() / 1000;
    var delta = now - lastFrameTime;
    lastFrameTime = now;

    // frameCount = frameCount +1;
    // totalFrameCount = totalFrameCount +1;

    // Update the MVP matrix to adjust for canvas size changes
    resize();

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var skeleton = skeletons[activeSkeleton].skeleton;

    //respond to animation changes

    // Apply the animation state based on the delta time.
    var state = skeletons[activeSkeleton].state;
    // var bounds = skeletons[activeSkeleton].bounds;
    var premultipliedAlpha = skeletons[activeSkeleton].premultipliedAlpha;
    state.update(delta);
    state.apply(skeleton);
    skeleton.updateWorldTransform();

    // Bind the shader and set the texture and model-view-projection matrix.
    shader.bind();
    shader.setUniformi(spine.webgl.Shader.SAMPLER, 0);
    shader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX, mvp.values);

    // Start the batch and tell the SkeletonRenderer to render the active skeleton.
    batcher.begin(shader);

    skeletonRenderer.premultipliedAlpha = premultipliedAlpha;
    skeletonRenderer.draw(batcher, skeleton);
    batcher.end();

    shader.unbind();

    requestAnimationFrame(render);
  };

  return (
    <div className="spine-full">
      <div className="spine-full-canvas-container">
        <canvas id="reactionCanvas"></canvas>
      </div>
    </div>
  );
}
