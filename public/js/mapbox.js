export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibW9oaXRyYXdhdDk4ODUiLCJhIjoiY2t5MnltNWI2MHE5bjJ5cW5sbXRqdXJobSJ9.Lh3JHmKt7RXiuh6ggXMt3Q';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mohitrawat9885/cky30eooj2ho715l1e7m4rj91',
    scrollZoom: false,
    //   center: [-118.113491, 34.111745],
    //   zoom: 10,
    //   interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';
    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup

    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);
    //  Extend map bound to incli\ude current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
