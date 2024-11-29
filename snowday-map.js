const src = "https://itv.news12.com/school_closings/closings.jsp?region=LI";
//const src = `http://192.168.50.219:8080/School%20Closings%20and%20Delays.htm`;

const simplify = (str) => str.replace(/\s|\/|-/g, "").toLowerCase();
const toTitleCase = (str) =>
  str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

// Parse data
const refreshData = (src) => {
  const srcParent = document.createElement("div");
  $(srcParent).load(src, () => {
    const rows = Array.from($($(srcParent).find("table")[1]).find("tbody").children());
    rows.forEach((row) => {
      const name = row.children[0].innerText.substr(4);
      const status = simplify(row.children[2].innerText.substr(6));
      if (/ufsd|schooldistrict|publicschool|centralsd|csd/i.test(simplify(name))) {
        const district = Array.from(document.querySelectorAll("polygon"))
          .find(x => simplify(name).startsWith(simplify(x.getAttribute("district"))));
        if (district) {
          if (status.includes("closed"))
            district.style.fill = "red";
          else if (status.includes("remote"))
            district.style.fill = "darkred";
          else if (status.includes("delay"))
            district.style.fill = "yellow";
        }
      }
    });
    console.log(`[${new Date().toLocaleTimeString()}] Refreshed`);
  });
};
window.addEventListener("load", () => refreshData(src));
setInterval(() => refreshData(src), 60000);

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
});
