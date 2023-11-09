mapboxgl.accessToken = 'pk.eyJ1IjoiZHlsYW5tYXh3ZWxsIiwiYSI6ImNrcTczNGtzNTAwcDYyb3BtdGN3em5ndGsifQ.df72_vr_4lG4QTdcwlXa-g';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/dylanmaxwell/clor7zz4x00f001qocl0648nf',
  center: [-84.514441, 39.131775],
  zoom: 16.29,
  bearing: 49.60,
  pitch: 59,
  scrollZoom: false
});

const stores = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51497, 39.13119]
      },
      'properties': {
        'header': 'Training Table',
        'icon': 'mealExchange',
        'body': 'We have a vision to provide a new environment with modern seating and tables with elevated branding to bring home the athletics feel student athletes deserve.',
        'concepts': ['Lindner Center'],
        'image': '../images/varsity-club.jpg',
        'modalClass': 'varsity-club'

      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51223, 39.13360]
      },
      'properties': {
        'header': 'On The Green',
        'icon': 'mealExchange',
        'body': 'On the Green,  known for authenticity with a new menu lineup specializing in vegan, vegetarian, allergen-friendly, kosher, and halal. With vegan and vegetarian options available at every station every day, there will truly be a dish for everyone! We have carved out space within OTG for a self-contained allergen kitchen to ensure a safe dining experience for those who need to be mindful of all ingredients.',
        'concepts': ['OTG Café'],
        'image': '../images/otg-01.jpg',
        'modalClass': 'otg-01'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.39984, 39.23329]
      },
      'properties': {
        'header': 'Blue Ash Café',
        'icon': 'mealExchange',
        'body': 'In Year Two, we will refresh the location to provide a modern dining experience.  You will find chef-inspired sandwiches and pizzas, gourmet salads, and a delicious assortment of fresh baked goods and sweets at Blue Ash Café.',
        'concepts': ['Blue Ash Campus'],
        'image': '../images/blue-ash.jpg',
        'modalClass': 'blue-ash'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51752, 39.13167]
      },
      'properties': {
        'header': 'Twisted Taco',
        'icon': 'mealExchange',
        'body': 'Twisted Taco’s mantra is to provide the freshest ingredients that are sourced locally, and to be a leader in living and working “green”. Tacos are always on the menu, but there are plenty of other delicious options such as burritos, burrito bowls, salads, and more!',
        'concepts': ['Tangeman University Center'],
        'image': '../images/twisted-taco.jpg',
        'modalClass': 'twisted-taco'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51318, 39.13423]
      },
      'properties': {
        'header': 'Quick Eats - AI Store',
        'icon': 'mealExchange',
        'body': 'Quick Eats provides walk-in, walk-out convenience! This AI-driven, no wait, checkout-free retail store offers easy access to a variety of high-quality foods, beverages and essentials at all hours of the day.',
        'concepts': ['Campus Green'],
        'image': '../images/quick-eats.jpg',
        'modalClass': 'quick-eats'
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