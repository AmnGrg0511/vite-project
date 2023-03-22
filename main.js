import image0 from "./Images/HMTpano_000001_000000.jpg"
import image1 from "./Images/HMTpano_000001_000001.jpg"
import image2 from "./Images/HMTpano_000001_000002.jpg"
import image3 from "./Images/HMTpano_000001_000003.jpg"
import image4 from "./Images/HMTpano_000001_000004.jpg"
import image5 from "./Images/HMTpano_000001_000005.jpg"
import image6 from "./Images/HMTpano_000001_000006.jpg"
import image7 from "./Images/HMTpano_000001_000007.jpg"

// Initialize the OpenLayers map
const map = new ol.Map({
  target: 'map',
  layers: [
      new ol.layer.Tile({
          source: new ol.source.OSM()
      })
  ],
  view: new ol.View({
      center: ol.proj.fromLonLat([10.93376479, 50.98380407]),
      zoom: 19
  })
});
const vectorLayer = new ol.layer.Vector({
  source: new ol.source.Vector()
});

// Add the vector layer to the map
map.addLayer(vectorLayer);

const cordinates = [
  [10.93376479, 50.98380407],
  [10.93377411, 50.98376802],
  [10.93378524, 50.9837232],
  [10.93378027, 50.98368124],
  [10.93373754, 50.98364982],
  [10.9336743, 50.983634],
  [10.93361004, 50.98363497],
  [10.93356273, 50.98366071],
  [10.93354303, 50.98370195],
  [10.93353315, 50.98374614],
]


// Add the feature to the vector layer
cordinates.forEach((e, i) => {
  vectorLayer.getSource().addFeature(
      // Create a feature with the marker coordinates
      new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat(e)),
          name: i
      })
  );
})

// Create a select interaction
const selectInteraction = new ol.interaction.Select({
  condition: ol.events.condition.click,
  layers: [vectorLayer]
});

// Add the select interaction to the map
map.addInteraction(selectInteraction);

let panorama, viewer;

// Create a viewer for the panorama
viewer = new PANOLENS.Viewer({ container: document.getElementById('panorama') });

const images = [image0, image1, image2, image3, image4, image5, image6, image7]
// Load the initial panorama
loadPanorama(images[0]);

// Function to load a new panorama
function loadPanorama(imageUrl) {
  // Create a new panorama
  panorama = new PANOLENS.ImagePanorama(imageUrl);

  // Handle errors that occur when loading the panorama
  panorama.addEventListener('error', function (e) {
      console.error('An error occurred while loading the panorama:', e);
  });

  // Render the panorama in the viewer when it is loaded
  panorama.addEventListener('load', function () {
      // Remove the existing panorama from the viewer
      viewer.remove(viewer.getScene());

      // Add the new panorama to the viewer
      viewer.add(panorama);
  });

  // Load the panorama
  panorama.load();
}

// Handle the select event
selectInteraction.on('select', function (e) {
  if (e.selected.length > 0) {
      // Create a new panorama
      loadPanorama(images[e.selected[0].A.name]);
  }
});