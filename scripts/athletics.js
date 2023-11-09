mapboxgl.accessToken = 'pk.eyJ1IjoiZHlsYW5tYXh3ZWxsIiwiYSI6ImNrcTczNGtzNTAwcDYyb3BtdGN3em5ndGsifQ.df72_vr_4lG4QTdcwlXa-g';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/dylanmaxwell/clno3g02s008g01pf3bwmhexd',
  center: [-84.515, 39.131],
  zoom: 16.43,
  bearing: 39.2,
  pitch: 58,
  scrollZoom: false
});

const stores = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51689, 39.13155]
      },
      'properties': {
        'header': 'Fan Favorite Express',
        'icon': 'athletics',
        'body': 'This concept satisfies the need for speed among the highest-selling items in NCAA venues. Fans can grab freshly made hot dogs, pretzels, nachos, and more, then quickly pay. We can utilize traditional POS or intelligent selfcheckout to allow our fans multi-item checkout that is 10 times faster than a typical POS. The kiosks use AI vision to learn and recognize objects—no barcodes required.',
        'concepts': ['Nippert Stadium'],
        'image': '../images/fan-favorites.jpg',
        'modalClass': 'fan-favorites'

      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51556, 39.13062]
      },
      'properties': {
        'header': 'Walk Thru Bru A',
        'icon': 'athletics',
        'body': 'Our Walk Thru Bru locations provide a solution in the form of a turnkey portable that has been rolled out with great success in our NCAA portfolio. Guests can self-serve a wide variety of product and check out 10 times faster than a traditional beer portable with our Mashgin intelligent self-checkout.',
        'concepts': ['Nippert Stadium'],
        'image': '../images/wtb-a.jpg',
        'modalClass': 'wtb-a'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51620, 39.13025]
      },
      'properties': {
        'header': 'Walk Thru Bru B',
        'icon': 'athletics',
        'body': 'We will strategically place these in egresses throughout the venues, ensuring they mimic natural traffic patterns to encourage impulse buys for a quick stop in.',
        'concepts': ['Nippert Stadium'],
        'image': '../images/wtb-b.jpg',
        'modalClass': 'wtb-b'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51685, 39.13195]
      },
      'properties': {
        'header': 'Bearcat Patio',
        'icon': 'athletics',
        'body': 'This underutilized plaza, will become the new hotspot for tailgaters looking for a premium party spot! Design highlights include; Tented zone, mobile food service activations, full bar option, stadium side location, dedicated service staff and more.',
        'concepts': ['Nippert Stadium'],
        'image': '../images/bearcat-patio.jpg',
        'modalClass': 'bearcat-patio'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51413, 39.13115]
      },
      'properties': {
        'header': 'Bearcat Faves',
        'icon': 'athletics',
        'body': 'This family friendly location and eye catching mascot visuals will entice kids to and satisfy the pricing strategy missing at the arena.',
        'concepts': ['Fifth Third Arena'],
        'image': '../images/bearcat-faves.jpg',
        'modalClass': 'bearcat-faves'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51469, 39.13093]
      },
      'properties': {
        'header': 'Overlook Bar',
        'icon': 'athletics',
        'body': 'This destination bar has quickly become a fan favorite and it’s time for the next phase of improvement! We will continue to work hand in hand with your team to identify sponsorship opportunities and create the local bourbon showcase everyone is dreaming up.',
        'concepts': ['Fifth Third Arena'],
        'image': '../images/overlook.jpg',
        'modalClass': 'overlook'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51565, 39.13182]
      },
      'properties': {
        'header': 'Special Events & Catering',
        'icon': 'athletics',
        'body': 'Our dedicated investment will continue to elevate the premium catering experience. Our focus spending includes; innovative food and beverage displays, roving furniture, new service ware and team-centric touches.',
        'concepts': ['Athletics General'],
        'image': '../images/premium.jpg',
        'modalClass': 'premium'
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
    el.className = 'marker marker-at';
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