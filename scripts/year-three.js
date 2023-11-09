mapboxgl.accessToken = 'pk.eyJ1IjoiZHlsYW5tYXh3ZWxsIiwiYSI6ImNrcTczNGtzNTAwcDYyb3BtdGN3em5ndGsifQ.df72_vr_4lG4QTdcwlXa-g';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/dylanmaxwell/clor8cu7c00g501ntfa847a0c',
  center: [-84.516505, 39.134102],
  zoom: 16.43,
  bearing: -157.60,
  pitch: 44,
  scrollZoom: false
});

const stores = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51405, 39.13234]
      },
      'properties': {
        'header': 'Lights, Late Night, Limitless Potential',
        'icon': 'retail',
        'body': 'The Campus Green District will be the social hub for late-night activity until midnight in front of Market on Main. This revamped district will fuel student engagement in support of UC’s growth by providing additional dining space for lunch and dinner. Students will be able to order their meal from new table technology from our virtual kitchen that provides a robust menu from multiple restaurants and retail brands, all from one location, boosting variety from day to night.',
        'concepts': ['Campus Green'],
        'image': '../images/market-on-main.jpg',
        'modalClass': 'market-on-main'

      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51390, 39.13472]
      },
      'properties': {
        'header': 'Create Kitchen',
        'icon': 'mealExchange',
        'body': 'Create Kitchen, our teaching kitchen concept will provide students a series of hands-on events specifically designed for UC students who are keen to explore new culinary skills and connect with fellow food enthusiasts.',
        'concepts': ['Campus Green'],
        'image': '../images/create-kitchen.jpg',
        'modalClass': 'create-kitchen'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51557, 39.13399]
      },
      'properties': {
        'header': 'Revive Space',
        'icon': 'mealExchange',
        'body': 'A hip, relaxing environment to take a break throughout the day with new comfortable lounge seating as a place to unwind and connect. To boost convenience, elements of our Automated Eats program will be added here with Byte Smart Fridge vending where students can quickly find freshly made, healthy, wellness-focused grab-and-go items as well as the expanded Maggie’s Bakery scratch-made baked goods.',
        'concepts': ['Langsam Library'],
        'image': '../images/revive-space.jpg',
        'modalClass': 'revive-space'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51872, 39.13449]
      },
      'properties': {
        'header': 'The Artisan Café',
        'icon': 'mealExchange',
        'body': 'The Artisan Café will offer an expanded signature bakery café menu providing a wide variety of grab-and-go sandwiches, salads, and snacks. ',
        'concepts': ['DAAP Building'],
        'image': '../images/daap-cafe.jpg',
        'modalClass': 'daap-cafe'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51497, 39.13119]
      },
      'properties': {
        'header': 'Athlete Dining',
        'icon': 'mealExchange',
        'body': 'Not only is the student athlete dining facility is a top-priority among recruits, it is a main priority for us. Our team’s faces are often the most familiar to your athletes and their dining experiences quickly become core memories throughout their legacy as Bearcats. Our modern design, delicious yet nutritional menus and friendly staff will be sure to  win the adoration of all student athletes.',
        'concepts': ['Lindner Center'],
        'image': '../images/student-athlete-dining.jpg',
        'modalClass': 'student-athlete'
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
        `<h5>${currentFeature.properties.header}</h5><p class="p-2">${popVal}</p>`
      )
      .addTo(map);
  }
}