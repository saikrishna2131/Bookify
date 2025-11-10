mapboxgl.accessToken = mapToken;
// console.log(listing.geometry);
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12",
  center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 12, // starting zoom
});

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup().setHTML(
      `<h3>${listing.title}</h3><p>${listing.location}</p><p>exact location provided after booking</p>`
    )
  )
  .addTo(map);
