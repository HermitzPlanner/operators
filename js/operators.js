let charData
let orderData
let charCodeGlobal
async function dataFetch() {
    //const url = "https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/zh_CN/gamedata/excel/character_table.json"
    const url = "characters.json"

    const characterCall = await fetch(url)
    const characterResponse = await characterCall.json()
    charData = characterResponse
    console.log("chars", Object.entries(charData))

    //const skillsCall = await fetch("https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/zh_CN/gamedata/excel/skill_table.json")
    //const skillsData = await skillsCall.json()
    //console.log(skillsData)



    const orderCall = await fetch("operator-order.json")
    const orderResponse = await orderCall.json()
    orderData = orderResponse

    main()
} dataFetch()

function main() {

    for (let i = 6; i >= 1; i--) {

        orderData.slice().reverse().forEach(order => {
            const char = Object.entries(charData).find(obj => obj[1].name === order.operator);
            if (char) {
                const rarity = char[1].rarity.replace("TIER_", "")
                if (rarity == i) {
                    charTemplate(char);
                }
            }
        });
    }
    afterSort()
}
let missingIcons = []
function charTemplate(char) {
    const appellation = char[1].appellation.toLowerCase();
    const profession = char[1].profession;
    const charCode = char[0];
    // Import
    const galleryNode = document.importNode(document.getElementById("gallery-body").content, true);
    // Edit
    const galleryLinkClone = galleryNode.querySelector(".gallery-link")
    galleryLinkClone.href = "#" + appellation
    galleryLinkClone.setAttribute("id", `gallery-${appellation}`)

    const galleryBtnClone = galleryNode.querySelector(".gallery-btn");
    galleryBtnClone.setAttribute("id", appellation)
    galleryBtnClone.addEventListener("click", () => {
        window.location.hash = appellation
        console.log(char)
        viewer(char)
        charCodeGlobal = charCode
    })


    galleryNode.querySelector(".gallery-model").textContent = appellation
    galleryNode.querySelector(".gallery-sub").textContent = profession

    const iconUrl = "https://raw.githubusercontent.com/HermitzPlanner/arknight-images/main/avatars/" + charCode + ".png";
    galleryNode.querySelector(".gallery-img").src = iconUrl
    galleryNode.querySelector(".gallery-img").style.height = "120px"
    //Export
    document.querySelector("#gallery").appendChild(galleryNode)
}

function afterSort() {
    // Alters
    var alters = document.querySelectorAll('.gallery-model');
    alters.forEach(function (alter) {
        var words = alter.textContent.split(' ');
        if (words.length >= 3) {
            alter.textContent = words[0] + ' Alter';
        }
    });
}

async function viewer(char) {

    const name = char[1].name;
    const charCode = char[0];
    const charInfo = char[1];
    const appellation = char[1].appellation.toLowerCase();
    const profession = char[1].profession;
    const nationId = char[1].nationId
    const skills = char[1].skills
    const position = char[1].position

    const viewerFullImage = document.querySelector(".full-image img")
    viewerFullImage.src = ""

    const viewerIcon = document.querySelector(".viewer-icon img")
    viewerIcon.src = ""

    const viewer = document.querySelector(".viewer")
    viewer.style.display = "block"

    const viewerCharNameClone = document.querySelector(".viewer-char-name");
    const viewerSubclassNameClone = document.querySelector(".viewer-subclass-name");
    const viewerIconClone = document.querySelector(".viewer-icon img")

    const skillUrl = "https://raw.githubusercontent.com/HermitzPlanner/arknight-images/main/skills/skill_icon_" + skills[0].skillId + ".png"
    document.querySelector(".skill-1").src = skillUrl

    const skillUrl2 = "https://raw.githubusercontent.com/HermitzPlanner/arknight-images/main/skills/skill_icon_" + skills[1].skillId + ".png"
    document.querySelector(".skill-2").src = skillUrl2

    const skillUrl3 = "https://raw.githubusercontent.com/HermitzPlanner/arknight-images/main/skills/skill_icon_" + skills[2].skillId + ".png"
    document.querySelector(".skill-3").src = skillUrl3

    document.querySelector(".viewer-position-information").textContent = position

        // Setting textContent to empty string
        viewerCharNameClone.textContent = appellation
    viewerSubclassNameClone.textContent = profession
    viewerIconClone.src = "https://raw.githubusercontent.com/HermitzPlanner/arknight-images/main/factions/logo_" + nationId + ".png"
    document.querySelector(".full-image img").src = "https://raw.githubusercontent.com/HermitzPlanner/arknight-images/main/characters/" + charCode + "_1.png"






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


}
function eliteArt(elite) {

    url = "https://raw.githubusercontent.com/HermitzPlanner/arknight-images/main/characters/" + charCodeGlobal + "_" + elite + ".png"
    document.querySelector(".full-image img").src = url

}
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
    location.hash = ""
}
