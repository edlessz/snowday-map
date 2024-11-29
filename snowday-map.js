//const src = "http://192.168.5.177/webpage.html";
const src = "https://itv.news12.com/school_closings/closings.jsp?region=LI";

const toTitleCase = (str) =>
  str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
const districts = {};

window.addEventListener("load", () => {
  const srcParent = document.createElement("div");
  $(srcParent).load(src, () => {
    const rows = Array.from($($(srcParent).find("table")[1]).find("tbody").children());
    rows.forEach((row) => {
      const name = row.children[0].innerText.substr(4);
      const status = row.children[2].innerText.substr(6);
      if (/ufsd|school district/i.test(name)) {
        const unformattedName = name.replace(/\s|\/|-/g, "").toLowerCase();
        Object.keys(districts).forEach((district) => {
          if (unformattedName.includes(district)) {
            if (status.toLowerCase().includes("closed")) {
              districts[district].style.fill = "red";
            }
            if (status.toLowerCase().includes("remote")) {
              districts[district].style.fill = "darkred";
            }
            if (status.toLowerCase().includes("delay")) {
              districts[district].style.fill = "yellow";
            }
          }
        });
      }
    });
  });
});

// Panning
const svg = $("svg")[0];
svg.style.left = `${window.innerWidth / 2 - svg.width.baseVal.value / 2}px`;
svg.style.top = `${window.innerHeight / 2 - svg.height.baseVal.value / 2}px`;
window.addEventListener("mousedown", () => {
  const mouseMove = (event) => {
    svg.style.left = `${parseInt(svg.style.left) + event.movementX}px`;
    svg.style.top = `${parseInt(svg.style.top) + event.movementY}px`;
  };
  window.addEventListener("mousemove", mouseMove);
  window.addEventListener(
    "mouseup", () => {
      window.removeEventListener("mousemove", mouseMove);
    }, { once: true }
  );
});

// Tooltip
const getStatus = (color) => {
  switch (color) {
    case "red":
      return "Closed";
    case "darkred":
      return "Remote Learning";
    case "yellow":
      return "Delay";
    default:
      return "Unknown / Open";
  }
};
window.addEventListener("mousemove", (event) => {
  $("#mouse")[0].style.left = `${event.clientX}px`;
  $("#mouse")[0].style.top = `${event.clientY}px`;
  if (document.querySelectorAll("polygon:hover").length === 0) {
    $("#mouse")[0].style.display = "none";
  }
});
document.querySelectorAll("polygon").forEach((district) => {
  district.addEventListener("mouseenter", () => {
    const status = district.getAttribute("district");
    $("#mouse")[0].innerText = toTitleCase(`${status.replace(/-/g, " ")}\n${getStatus(district.style.fill)}`);
    $("#mouse")[0].style.display = "block";
  });
  districts[district.getAttribute("district").replace(/-/g, "")] = district;
});
