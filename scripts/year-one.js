mapboxgl.accessToken = 'pk.eyJ1IjoiZHlsYW5tYXh3ZWxsIiwiYSI6ImNrcTczNGtzNTAwcDYyb3BtdGN3em5ndGsifQ.df72_vr_4lG4QTdcwlXa-g';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/dylanmaxwell/cloptlpb8008301qdafmw7q9f',
  center: [-84.517332, 39.131450],
  zoom: 16.7,
  bearing: 69.9,
  pitch: 43.54,
  scrollZoom: false
});

const stores = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51563, 39.13183]
      },
      'properties': {
        'header': 'Home Table',
        'icon': 'mealExchange',
        'body': 'Home Table has the perfect name! This chef-led dining experience will offer seven culinary-driven food concepts with in-house and from-scratch recipes whenever possible. This dining destination proves that elevated meals can be part of the student experience.',
        'concepts': ['Center Court'],
        'image': '../images/home-table-01.jpg',
        'modalClass': 'home-table'

      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.19493, 39.08165]
      },
      'properties': {
        'header': 'Cougar Cafe',
        'icon': 'retail',
        'body': 'With innovative vending from our Automated Eats solutions, we ensure customers can get their meals on their time whenever they need it. We can provide solutions like Yo-Kai Express, Costa Coffee, and Byte smart fridge vending.',
        'concepts': ['UC Clermont'],
        'image': '../images/just-baked.png',
        'modalClass': 'cougar-cafe'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51723, 39.13153]
      },
      'properties': {
        'header': 'Zen Sushi',
        'icon': 'mealExchange',
        'body': 'Zen, an authentic Japanese retail brand that features a variety of flavorful bowls and sushi. Their mission is simple: to make Japanese-inspired cuisine affordable, healthy, and fun.',
        'concepts': ['Tangeman University Center'],
        'image': '../images/catskellar-zen.jpg',
        'modalClass': 'zen-sushi'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51744, 39.13187]
      },
      'properties': {
        'header': 'Aatish Halal Kitchen',
        'icon': 'mealExchange',
        'body': 'Aatish, our new halal contemporary kitchen replacing Cincy Grill, boasts robust flavors and savory seasonings that takes personalization to the next level.',
        'concepts': ['Tangeman University Center'],
        'image': '../images/aatish-halal.jpg',
        'modalClass': 'aatish-halal'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51784, 39.13136]
      },
      'properties': {
        'header': 'The Drop - Ghost Kitchen',
        'icon': 'mealExchange',
        'body': 'The Drop provides a virtual dining solution that can operate at any hour while providing a robust menu from multiple brands, all from one retail location.',
        'concepts': ['Tangeman University Center'],
        'image': '../images/bearcats-cafe.jpg',
        'modalClass': 'bearcats-cafe'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51677, 39.13225]
      },
      'properties': {
        'header': 'Saxbys',
        'icon': 'retail',
        'body': 'The Saxbys Experiential Learning Platform® (E.L.P.) is founded on the belief that young people today should be empowered to mold the business movement of the future.',
        'concepts': ['Steger Student Life'],
        'image': '../images/saxbys.jpg',
        'modalClass': 'saxbys'
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