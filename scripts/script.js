mapboxgl.accessToken = 'pk.eyJ1IjoiZHlsYW5tYXh3ZWxsIiwiYSI6ImNrcTczNGtzNTAwcDYyb3BtdGN3em5ndGsifQ.df72_vr_4lG4QTdcwlXa-g';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/dylanmaxwell/clno3g02s008g01pf3bwmhexd',
  center: [-84.514725, 39.131300],
  zoom: 16,
  bearing: -44,
  pitch: 68.5,
  scrollZoom: false
});

const stores = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51713, 39.12894]
      },
      'properties': {
        'header': 'Market Pointe',
        'body': 'Celebrating Cincinnati Neighborhood Cuisines. Gathering space that will connect student communities & a crossroads to celebrate hyperlocal cuisines.',
        'concepts': ['Trattoria', 'Baehrs Grill', 'The Chicken COOP', 'Hearth', 'Flexitarian ft. 80 Acres', 'Simmer & Thyme', 'Farm & Forage', 'Maggies Bakery', 'True Balance', 'Upper Crust']
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51559, 39.13231]
      },
      'properties': {
        'header': 'Center Court ',
        'mealExchange': 'Meal Exchange',
        'body': 'Home Table. A reenergized focus on scratch cooking. Creating an experience just like at home.',
        'concepts': ['Ohio River Smokehouse', 'Farm Table', 'Cincy Crafted', 'Mezze', 'Culinary Canvas', 'La Casa'],
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51784, 39.13136]
      },
      'properties': {
        'header': 'Bearcats Cafe',
        'mealExchange': 'Meal Exchange',
        'body': 'Bearcat Café is going virtual. Pulling an all-nighter for tomorrow’s final exams? Putting the finishing touches on that 15-page term paper? Our Ghost Kitchen provides a virtual dining solution that can operate at any hour while providing a robust menu from multiple brands, all from one retail location.',
        'concepts': ['La Latina Concina', 'Ghost Kitchen', 'Jacks Burrito', 'The Spread', 'Mr. Beast Burger']
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51563, 39.13183]
      },
      'properties': {
        'header': 'Stadium View',
        'body': 'Gastro Pub, flex space for Game Day: Enhance game day experience with open access to food hall atmosphere with Gastro Pub featuring local craft brews ',
        'concepts': ['Trattoria Kitchen', 'NY Style Pizza Pub', 'Maggies Bakery', 'Food Lockers'],
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51223, 39.13361]
      },
      'properties': {
        'header': 'On The Green',
        'body': 'On the Green will be the destination known for authenticity with a new menu lineup specializing in vegan, vegetarian, allergen-friendly, ethnic cuisines, and halal.',
        'concepts': ['Upper Crust', 'Athenian Grille', 'Choolah', 'Flexitarian Bar', 'Zen Wok', 'Maggies Bakery', 'OTG Express'],
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51501, 39.13104]
      },
      'properties': {
        'header': 'Varsity Club',
        'mealExchange': 'Meal Exchange',
        'body': 'The Training Table is a crucial component of any Big 12 Sport team. Here you can find high-quality ingredients in every recipe with lean, whole muscle protein to assist growth and recovery, carbohydrates for energy, and fats for immune support.',
        'concepts': ['Training Table'],
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51748, 39.13176]
      },
      'properties': {
        'header': 'Retail',
        'mealExchange': 'Meal Exchange',
        'concepts': ['Panda Express', 'Chick-fil-a', 'Aatish', 'Freshens', 'Zen Sushi & Poke Bowl', 'Saxbys'],
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.50844, 39.13655]
      },
      'properties': {
        'header': 'Cafes',
        'concepts': ['Campus View Cafe', 'Claremont - Cougar Cafe'],
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51419, 39.13359]
      },
      'properties': {
        'header': 'Coffee',
        'concepts': ['The 86 Coffee Bar', 'Linder Starbucks'],
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-84.51405, 39.13236]
      },
      'properties': {
        'header': 'Convenience Stores',
        'concepts': ['Main Street Express', 'Market on Main'],
      }
    },
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
    el.className = 'marker';
    new mapboxgl.Marker(el, { offset: [0, -23] })
      .setLngLat(marker.geometry.coordinates)
      .addTo(map);
    el.addEventListener('click', (e) => {
      flyToStore(marker);
      createPopUp(marker);
      const activeItem = document.getElementsByClassName('onit');
      e.stopPropagation();
      if (activeItem[0]) {
        activeItem[0].classList.remove('onit');
      }
      const listing = document.getElementById(
        `listing-${marker.properties.id}`
      );
      listing.classList.add('onit');
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
    link.href = 'javascript:void(0);';
    link.className = 'title jost fw-bold fs-lg';
    link.id = `link-${store.properties.id}`;
    if (store.properties.mealExchange) {
      link.innerHTML = `${store.properties.header}`;
      link.innerHTML += `<small><span class="ms-2 border badge text-bg-light">Meal Exchange</span></small>`;
    } else {
    link.innerHTML = `${store.properties.header}`;
    }
    const details = listing.appendChild(document.createElement('div'));
    details.innerHTML = ` <hr><p class="jost"> ${store.properties.concepts.join('<br>')}</p>`;
    link.addEventListener('click', function () {
      for (const feature of stores.features) {
        if (this.id === `link-${feature.properties.id}`) {
          flyToStore(feature);
          createPopUp(feature);
        }
      }
      const activeItem = document.getElementsByClassName('onit');
        if (activeItem[0]) {
          activeItem[0].classList.remove('onit');
        }
      this.parentNode.classList.add('onit');
    });
  }
}
   

  function flyToStore(currentFeature) {
    map.flyTo({
      center: currentFeature.geometry.coordinates,
      zoom: 16
    });
  }
   let popVal = '';

  function createPopUp(currentFeature) {
    const popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();
    if (currentFeature.properties.body) {
      popVal = currentFeature.properties.body;
    } else {
      popVal = currentFeature.properties.concepts;
    }
    const popup = new mapboxgl.Popup({ closeOnClick: true})
      .setLngLat(currentFeature.geometry.coordinates)
      .setHTML(
        `<h4 class="jost">${currentFeature.properties.header}</h4><p class="p-2 jost">${popVal}</p>`
      )
      .addTo(map);
  }
