window.addEventListener("load", () => {
  // (A) CREATE RESUMABLE OBJECT
  let r = new Resumable({
    target: "/uploads",
    query: { key: "value" } // optional
  });

  // (B) GET HTML ELEMENTS
  let dropzone = document.getElementById("updrop"),
      listzone = document.getElementById("uplist");

  // (C) UPLOAD MECHANICS
  // (C1) PAUSE/RESUME UPLOAD
  dropzone.onclick = () => {
    if (r.isUploading()) { r.pause(); }
    else { r.upload(); }
  };

  // (C2) FILE ADDED - ADD HTML ROW & START UPLOAD
  r.on("fileAdded", (file, evt) => {
    let row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `${file.fileName} (<span class="status">0%</span>)`;
    row.id = file.uniqueIdentifier;
    listzone.appendChild(row);
    r.upload();
  });

  // (C3) UPLOAD PROGRESS
  r.on("fileProgress", (file, evt) => {
    let row = document.getElementById(file.uniqueIdentifier);
    row.getElementsByTagName("span")[0].innerHTML = Math.ceil(file.progress() * 100) + "%";
  });

  // (C4) UPLOAD SUCCESFUL
  r.on("fileSuccess", (file, msg) => {
    // DO SOMETHING
  });

  // (C5) UPLOAD ERROR
  r.on("fileError", (file, msg) => {
    let row = document.getElementById(file.uniqueIdentifier);
    row.getElementsByTagName("span")[0].innerHTML = msg;
    console.error(file, msg);
  });

  // (D) ATTACH
  r.assignDrop(document.getElementById("updrop"));
  // r.assignBrowse(document.getElementById("browseButton"));
});