const animationSelect = document.getElementById("animation")
const perspectiveSelect = document.getElementById("perspective")
const speedSelect = document.getElementById("speed")
const quitBtn = document.getElementById("quit-btn")
const puregemLink = 'https://raw.githubusercontent.com/HermitzPlanner/planner-images/main/svg/puregem.png'
let app
let perspective
let chibiWidth
let chibiHeight
let globalPlannerId
let globalSkinId

async function viewer(plannerId) {
  console.log(plannerId)
  const viewerFullImage = document.querySelector(".full-image img")


  const viewerIconClone = document.querySelector(".viewer-icon img")


  const viewer = document.querySelector(".viewer")
  viewer.style.display = "block"

  chibiWidth = document.getElementById("chibi-container").offsetWidth;
  chibiHeight = document.getElementById("chibi-container").offsetHeight;

  const plannerSkinsCall = await fetch('https://raw.githubusercontent.com/HermitzPlanner/hermitzplanner.github.io/main/json/operator_table.json')
  const plannerSkinsData = await plannerSkinsCall.json()

  plannerSkinsData.forEach(plannerSkin => {
    if (plannerId !== plannerSkin.plannerId) return
    if (plannerId == plannerSkin.plannerId) {
      viewerIconClone.src = "https://raw.githubusercontent.com/HermitzPlanner/operator-icon/main/e0/" + plannerSkin.operator + ".png"
      //viewerFullImage.src = "https://raw.githubusercontent.com/HermitzPlanner/operator-art/main/e2/" + plannerSkin.operator + ".png"


      // Create an Image object to test if the URL is valid
      const testImage = new Image();
      const baseImageUrl = "https://raw.githubusercontent.com/HermitzPlanner/operator-art/main/";
      const operatorName = plannerSkin.operator;

      // Define the full image and fallback image URLs
      const fullImageUrl = `${baseImageUrl}e2/${operatorName}.png`;
      const fallbackImageUrl = `${baseImageUrl}e0/${operatorName}.png`;

      // Set up the onload and onerror event handlers
      testImage.onload = function () {
        // If the full image is valid, set it as the viewer's src
        viewerFullImage.src = fullImageUrl;
      };

      testImage.onerror = function () {
        // If the full image is not valid, use the fallback image
        viewerFullImage.src = fallbackImageUrl;
      };

      // Attempt to load the full image
      testImage.src = fullImageUrl;

    }
    // if (plannerSkinsData.appearances !== "") {
    //   document.querySelector(".viewer-appearances ").style.display = "flex"
    //   document.querySelector(".viewer-appearances-information").innerHTML = ""

    //   let appearancesArray = plannerSkin.appearances.split(', ');
    //   appearancesArray.forEach(appear => {
    //     document.querySelector(".viewer-appearances-information").innerHTML += `- ${appear} <br>`
    //   });


    // }
    // Selecting elements
    const viewerCharNameClone = document.querySelector(".viewer-char-name");
    const viewerSkinNameClone = document.querySelector(".viewer-skin-name");
    //const viewerIconClone = document.querySelector(".viewer-icon img")
    const viewerBrandInformationClone = document.querySelector(".viewer-brand-information");
    const viewerArtistInformationClone = document.querySelector(".viewer-artist-information");
    const viewerPriceInformationClone = document.querySelector(".viewer-price-information");
    // const viewerReleaseInformationClone = document.querySelector(".viewer-release-information");
    const viewerObtainInformationClone = document.querySelector(".viewer-obtain-information");

    plannerSkin.skinNameEN = plannerSkin.skinNameEN || plannerSkin.skinNameCN;

    // Setting textContent to empty string
    viewerCharNameClone.textContent = plannerSkin.appellation;
    viewerSkinNameClone.textContent = plannerSkin.charId;
    // viewerIconClone.src = "https://raw.githubusercontent.com/HermitzPlanner/planner-images/main/icon/" + plannerSkin.plannerId + ".png"
    // viewerFullImage.src = "https://raw.githubusercontent.com/HermitzPlanner/planner-images/main/art/" + plannerSkin.plannerId + ".png"
    // viewerBrandInformationClone.textContent = plannerSkin.brand;
    // viewerArtistInformationClone.textContent = plannerSkin.drawerList;

    // if (plannerSkin.skinPrice >= 15 && plannerSkin.skinPrice <= 24) {
    //   viewerPriceInformationClone.innerHTML = plannerSkin.skinPrice + '<img class="viewer-puregem" src="' + puregemLink + '">';
    // } else {
    //   viewerPriceInformationClone.textContent = "Free"
    // }

    // viewerReleaseInformationClone.textContent = plannerSkin.getTimeCN
    // viewerObtainInformationClone.textContent = plannerSkin.obtainApproachEN

    perspective = "front"

    chibiUpdate(plannerSkin.plannerId, plannerSkin.charId.toLowerCase())

    // Image handling
    viewerFullImage.style.transform = 'scale(1)';
    viewerFullImage.style.top = '0'
    viewerFullImage.style.left = '0'
    viewerFullImage.style.transition = 'transform 0.3s ease-out'; // add transition

    // Zoom in-out
    let scale = 1;
    const minScale = 0.5;
    const maxScale = 5;
    viewerFullImage.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY || e.detail || e.wheelDelta;
      scale = Math.max(minScale, Math.min(maxScale, scale - 0.1 * Math.sign(delta)));
      viewerFullImage.style.transform = `scale(${scale})`;
    });

    // Define variables to store the starting mouse position and image position
    let startX = 0;
    let startY = 0;
    let imageX = 0;
    let imageY = 0;

    // Attach an event listener to the image to track mouse movements
    viewerFullImage.addEventListener('mousedown', e => {
      startX = e.clientX;
      startY = e.clientY;
      imageX = viewerFullImage.offsetLeft;
      imageY = viewerFullImage.offsetTop;
      document.addEventListener('mousemove', moveImage);
    });

    // Function to move the image
    function moveImage(e) {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      viewerFullImage.style.left = `${imageX + deltaX}px`;
      viewerFullImage.style.top = `${imageY + deltaY}px`;
    }

    // Detach the event listener when the mouse button is released
    document.addEventListener('mouseup', e => {
      document.removeEventListener('mousemove', moveImage);
    });

  });
}

function chibiUpdate(plannerId, skinId) {
  //console.log ("entered function")
  //console.log ("planner id", plannerId)
  //console.log("skin id", skinId)

  // Reset
  globalPlannerId = plannerId
  globalSkinId = skinId

  if (perspective === "build") {
    skinId = "build_" + skinId
  } else {
    skinId = skinId
  }

  // Remove previous canvas
  document.querySelector("canvas")?.remove();
  app?.destroy();

  // New pixi app and canvas
  app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundAlpha: 0,
    premultiplyAlpha: true,
    antialias: true,
  });
  app.renderer.resize(chibiHeight, app.renderer.height);
  app.renderer.resize(chibiWidth, app.renderer.width);
  const canvas = app.view;
  canvas.id = 'chibi-canvas';
  document.getElementById('chibi-container').appendChild(canvas);

  loadCircle();

  // Loading and handling the spine assets
  PIXI.Assets.load(`https://raw.githubusercontent.com/HermitzPlanner/operator-chibi-assets/main/${plannerId}/${perspective}/${skinId}.skel`).then((skinAsset) => {
    // Reset
    app.stage.removeChildren() // Removes circle
    chibiScale = 0.5
    timeScale = 1
    // Constants
    const skinSpine = new PIXI.spine.Spine(skinAsset.spineData);
    const animationList = skinSpine.spineData.animations
    const animation = (perspective === "build") ? "Relax" : "Idle";

    // Mulberry check
    if (plannerId == "mulberry2") {
      //spineData > Bones
      // Front 207 211
      // Back 34 39
      // Build 207 211
      if (perspective == "front" || perspective == "build") {
        skinSpine.spineData.bones[207].transformMode = 0
        skinSpine.spineData.bones[211].transformMode = 0
      } if (perspective == "back") {
        skinSpine.spineData.bones[34].transformMode = 0
        skinSpine.spineData.bones[39].transformMode = 0
      }

    }

    // Functions
    updateAnimationList(animationList)

    // Spine settings
    skinSpine.x = app.screen.width / 2;
    skinSpine.y = app.screen.height;
    skinSpine.scale.set(0.5)
    skinSpine.state.setAnimation(0, animation, true);
    skinSpine.interactive = true;
    skinSpine.buttonMode = true;
    skinSpine.alpha = 1;

    // Spine dynamic settings
    app.ticker.add(() => {
      skinSpine.state.timeScale = timeScale;
      skinSpine.scale.set(chibiScale);
    });


    // Chibi drag handler
    let startPosition = { x: 0, y: 0 };
    skinSpine.on('mousedown', onDragStart);
    skinSpine.on('mouseup', onDragEnd);
    skinSpine.on('mousemove', onDragMove);

    function onDragStart(event) {
      startPosition = event.data.global.clone();
      skinSpine.alpha = 0.7;
      skinSpine.dragging = true;
    }

    function onDragEnd() {
      skinSpine.alpha = 1;
      skinSpine.dragging = false;
    }

    function onDragMove(event) {
      if (skinSpine.dragging) {
        const newPosition = event.data.global.clone();

        // Calculate the distance moved by the mouse
        const dx = newPosition.x - startPosition.x;
        const dy = newPosition.y - startPosition.y;

        // Update the SkinSpine object's position based on the mouse movement
        skinSpine.x += dx;
        skinSpine.y += dy;

        // Update the start position for the next movement calculation
        startPosition = newPosition;
      }
    }

    // App send
    app.stage.addChild(skinSpine);
    app.renderer.render(app.stage);

    // Debug
    //console.log(app.stage.children[0])

  });

  function loadCircle() {
    const circle = new PIXI.Graphics();
    circle.lineStyle(5, 0xffffff);
    circle.moveTo(25, 0);
    circle.arc(0, 0, 25, 0, 1);
    circle.moveTo(25, 0);
    circle.arc(0, 0, 25, 0, -1);
    circle.x = app.renderer.width / 2;
    circle.y = app.renderer.height / 2;
    app.stage.addChild(circle);

    app.ticker.add(() => {
      circle.rotation += 0.1;
    });
  }
}

animationSelect.addEventListener('change', function () {
  app.stage.children[0].state.setAnimation(0, animationSelect.value, true);
  if (animationSelect.value == "Sit") {
    app.stage.children[0].y = app.screen.height / 1.22
  }
  // mulberry is such an enigma...
  if (animationSelect.value == "Sit" && globalPlannerId == "mulberry2") {
    app.stage.children[0].spineData.bones[207].transformMode = 1
    app.stage.children[0].spineData.bones[211].transformMode = 1
  }
  if (animationSelect.value !== "Sit" && globalPlannerId == "mulberry2") {
    app.stage.children[0].spineData.bones[207].transformMode = 0
    app.stage.children[0].spineData.bones[211].transformMode = 0
  }
  if (animationSelect.value == "Sleep" && globalPlannerId == "mulberry2") {
    app.stage.children[0].spineData.bones[207].transformMode = 1
    app.stage.children[0].spineData.bones[211].transformMode = 1
  }
})

function updateAnimationList(animationList) {
  animationSelect.innerHTML = '<option selected disabled value="Animation">Animation</option>'
  animationList.forEach(animation => {
    animationSelect.innerHTML += `<option value="${animation.name}">${animation.name}</option>`;
  });
}

perspectiveSelect.addEventListener('change', function () {
  perspective = perspectiveSelect.value;
  chibiUpdate(globalPlannerId, globalSkinId);
  //speedSelect.value = 1
});



// Chibi scale handle
let chibiScale = 1;
document.getElementById("chibi-container").addEventListener('wheel', function (e) {
  e.preventDefault();
  let delta = e.deltaY || e.detail || e.wheelDelta;

  if (delta < 0) {
    chibiScale += 0.1;
  } else {
    if (chibiScale > 0.2) {
      chibiScale -= 0.1;
    }
  }
});

// Chibi speed handle
speedSelect.addEventListener("change", () => {
  timeScale = speedSelect.value
})
document.addEventListener('keydown', function (event) {
  // Check if the pressed key is the Escape key (key code 27)
  if (event.key === 'Escape' || event.keyCode === 27) {
    // Call the quitViewer function
    quitViewer();
  }
});
function quitViewer() {
  const viewer = document.querySelector(".viewer")
  viewer.style.display = "none"
  perspectiveSelect.value = 'front'
  location.hash = ""
}

