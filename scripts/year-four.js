mapboxgl.accessToken = 'pk.eyJ1IjoiZHlsYW5tYXh3ZWxsIiwiYSI6ImNrcTczNGtzNTAwcDYyb3BtdGN3em5ndGsifQ.df72_vr_4lG4QTdcwlXa-g';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/dylanmaxwell/clor8ys1j00gi01qs0i62dxf9',
  center: [-84.516574, 39.132107],
  zoom: 16.54,
  bearing: 56.8,
  pitch: 49.5,
  scrollZoom: false
});

const stores = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51559, 39.13234]
      },
      'properties': {
        'header': 'Home Table:  A Community Eatery',
        'icon': 'mealExchange',
        'body': 'We are taking personalization to the next level. Since our vision collaboration meeting held in July 2023, we have had the opportunity to review feedback and create new plans for Home Table 2.0.  As our next evolution of Home Table, we designed a community eatery that goes beyond just a food hall; it’s a social club—a place to hang out with friends and bond over their meals in an environment that looks sharp and feels comfy.',
        'concepts': ['Center Court'],
        'image': '../images/home-table-02.jpg',
        'modalClass': 'home-table'

      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51681, 39.13346]
      },
      'properties': {
        'header': 'Zimmer Roof Top Garden',
        'icon': 'retail',
        'body': 'Providing an additional space for residents and commuters to engage on campus, the Zimmer Rooftop Garden will be a new and unique destination for connection. Putting a spin on a modern outdoor restaurant, we will repurpose a shipping container to solve students’ culinary cravings in this part of campus.',
        'concepts': ['Zimmer Hall Green Space'],
        'image': '../images/zimmer-rooftop.jpg',
        'modalClass': 'zimmer-rooftop'
      }
    }
  ]
};

stores.features.forEach((store, i) => {
  store.properties.id = i;
});
   
map.on('load', () => {
  map.addSource('places', {
  'type': 'geojson',
  'data': stores
});
   
  buildLocationList(stores);
  addMarkers();
});
   
function addMarkers() {
  for (const marker of stores.features) {
    const el = document.createElement('div');
    el.id = `marker-${marker.properties.id}`;

    if (marker.properties.icon === 'mealExchange') {
      el.className = 'marker marker-me';
    }else{el.className = 'marker marker-retail';}
    
    new mapboxgl.Marker(el, { offset: [-4, -30] })
      .setLngLat(marker.geometry.coordinates)
      .addTo(map);
    el.addEventListener('click', (e) => {
      flyToStore(marker);
      createPopUp(marker);
      const activeItem = document.getElementsByClassName('active');
      e.stopPropagation();
      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }
      const listing = document.getElementById(
        `listing-${marker.properties.id}`
      );
      listing.classList.add('active');
    });
  }
}



function buildLocationList(stores) {
  for (const store of stores.features) {
    const listings = document.getElementById('listings');
    const listing = listings.appendChild(document.createElement('div'));
    listing.id = `listing-${store.properties.id}`;
    listing.className = 'item';
    const link = listing.appendChild(document.createElement('a'));
    link.href = 'javascript:void(0)';
    link.className = 'title fw-bold fs-lg';
    link.id = `link-${store.properties.id}`;
    link.innerHTML = `${store.properties.header}`;

    if (store.properties.concepts) {
      const details = listing.appendChild(document.createElement('p'));
      details.innerHTML = `${store.properties.concepts.join('<br>')}`;
    }
    link.addEventListener('click', function () {
      for (const feature of stores.features) {
        if (this.id === `link-${feature.properties.id}`) {
          flyToStore(feature);
          createPopUp(feature);
        }
      }
      const activeItem = document.getElementsByClassName('active');
        if (activeItem[0]) {
          activeItem[0].classList.remove('active');
        }
      this.parentNode.classList.add('active');
    });
  }

   

  function flyToStore(currentFeature) {
    map.flyTo({
      center: currentFeature.geometry.coordinates,
      zoom: 16
    });
  }
   let popVal = '';

  function createPopUp(currentFeature) {

    document.getElementById('theModal').innerHTML = `
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-fullscreen modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div id="modalBody" class="modal-body ${currentFeature.properties.modalClass}">
              </div>
            </div>
          </div>
        </div>
    `    

    const popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();
    popVal = currentFeature.properties.body;
    popVal += `<br><br><a href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#exampleModal"><img src="${currentFeature.properties.image}" style="width: 290px;";></a>`

    
    const popup = new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(currentFeature.geometry.coordinates)
      .setHTML(
        `<h3>${currentFeature.properties.header}</h3><p class="p-2">${popVal}</p>`
      )
      .addTo(map);
  }
}