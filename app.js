(async () => {
  const response = await fetch("./coordinates.txt");
  const text = await response.text();
  const data = text
    .split("\n")
    .slice(1, 11)
    .map((e) => e.split(" "));

  const coordinates = data.map((e) => e.slice(2, 4));

  const images = data.map((e) => e[0].slice(1, -1));

  // Initialize the OpenLayers map
  const map = new ol.Map({
    target: "map",
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat(coordinates[0]),
      zoom: 19,
    }),
  });
  const vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector(),
  });

  // Add the vector layer to the map
  map.addLayer(vectorLayer);

  // Add the feature to the vector layer
  coordinates.forEach((e, i) => {
    vectorLayer.getSource().addFeature(
      // Create a feature with the marker coordinates
      new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat(e)),
        name: i,
      })
    );
  });

  // Create a select interaction
  const selectInteraction = new ol.interaction.Select({
    condition: ol.events.condition.click,
    layers: [vectorLayer],
  });

  // Add the select interaction to the map
  map.addInteraction(selectInteraction);

  let panorama, viewer;

  // Create a viewer for the panorama
  viewer = new PANOLENS.Viewer({
    container: document.getElementById("panorama"),
  });

  // Function to load a new panorama
  const loadPanorama = (imageUrl) => {
    // Create a new panorama
    panorama = new PANOLENS.ImagePanorama(imageUrl);

    // Handle errors that occur when loading the panorama
    panorama.addEventListener("error", (e) => {
      console.error("An error occurred while loading the panorama:", e);
    });

    // Render the panorama in the viewer when it is loaded
    panorama.addEventListener("load", () => {
      // Remove the existing panorama from the viewer
      viewer.remove(viewer.getScene());

      // Add the new panorama to the viewer
      viewer.add(panorama);
    });

    // Load the panorama
    panorama.load();
  };

  // Load the initial panorama
  loadPanorama(images[0]);

  // Handle the select event
  selectInteraction.on("select", (e) => {
    if (e.selected.length > 0) {
      // Create a new panorama
      loadPanorama(images[e.selected[0].A.name]);
    }
  });
})();
