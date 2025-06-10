const mongoose = require("mongoose"); 

const sampleListings = [
  // House
  {
    title: "Charming Bungalow in Austin",
    description: "A cozy bungalow located near downtown Austin.",
    price: 120,
    address: "123 Maple Street, Austin, TX, USA",
    category: "house",
    image: {
      url: "https://source.unsplash.com/house1",
      filename: "house1.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-97.7431, 30.2672],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },
  {
    title: "Modern Suburban House",
    description: "A spacious house in a quiet suburban neighborhood.",
    price: 150,
    address: "456 Oak Avenue, San Jose, CA, USA",
    category: "house",
    image: {
      url: "https://source.unsplash.com/house2",
      filename: "house2.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-121.8863, 37.3382],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },

  // Flat/Apartment
  {
    title: "Downtown City Apartment",
    description: "A modern apartment in the heart of the city.",
    price: 200,
    address: "789 Pine Street, New York, NY, USA",
    category: "flat/apartment",
    image: {
      url: "https://source.unsplash.com/apartment1",
      filename: "apartment1.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-74.006, 40.7128],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },
  {
    title: "Cozy Studio Flat",
    description: "A compact and comfortable studio flat.",
    price: 100,
    address: "321 Elm Street, Chicago, IL, USA",
    category: "flat/apartment",
    image: {
      url: "https://source.unsplash.com/apartment2",
      filename: "apartment2.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-87.6298, 41.8781],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },

  // Barn
  {
    title: "Rustic Country Barn",
    description: "Experience the countryside in this rustic barn.",
    price: 90,
    address: "654 Country Road, Nashville, TN, USA",
    category: "barn",
    image: {
      url: "https://source.unsplash.com/barn1",
      filename: "barn1.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-86.7816, 36.1627],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },
  {
    title: "Converted Barn Loft",
    description: "A modern loft inside a converted barn.",
    price: 110,
    address: "987 Farm Lane, Madison, WI, USA",
    category: "barn",
    image: {
      url: "https://source.unsplash.com/barn2",
      filename: "barn2.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-89.4012, 43.0731],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },

  // Boat
  {
    title: "Lakefront Boat Stay",
    description: "Stay on a boat docked at the serene lakefront.",
    price: 130,
    address: "111 Marina Blvd, Lake Tahoe, CA, USA",
    category: "boat",
    image: {
      url: "https://source.unsplash.com/boat1",
      filename: "boat1.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-120.0324, 39.0968],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },
  {
    title: "Sailing Yacht Experience",
    description: "Enjoy a luxurious stay on a sailing yacht.",
    price: 180,
    address: "222 Harbor Street, Miami, FL, USA",
    category: "boat",
    image: {
      url: "https://source.unsplash.com/boat2",
      filename: "boat2.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-80.1918, 25.7617],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },

  // Cabin
  {
    title: "Mountain Cabin Retreat",
    description: "A peaceful cabin nestled in the mountains.",
    price: 140,
    address: "333 Pine Ridge, Denver, CO, USA",
    category: "cabin",
    image: {
      url: "https://source.unsplash.com/cabin1",
      filename: "cabin1.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-104.9903, 39.7392],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },
  {
    title: "Lakeside Wooden Cabin",
    description: "A cozy wooden cabin by the lake.",
    price: 120,
    address: "444 Lakeview Drive, Seattle, WA, USA",
    category: "cabin",
    image: {
      url: "https://source.unsplash.com/cabin2",
      filename: "cabin2.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-122.3321, 47.6062],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },

  // Cottage
  {
    title: "English Countryside Cottage",
    description: "A charming cottage in the English countryside.",
    price: 160,
    address: "555 Rose Lane, Cotswolds, UK",
    category: "cottage",
    image: {
      url: "https://source.unsplash.com/cottage1",
      filename: "cottage1.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-1.8433, 51.833],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },
  {
    title: "Beachside Cottage",
    description: "A quaint cottage near the beach.",
    price: 170,
    address: "666 Ocean Drive, Malibu, CA, USA",
    category: "cottage",
    image: {
      url: "https://source.unsplash.com/cottage2",
      filename: "cottage2.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-118.7798, 34.0259],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },

  // Campervan
  {
    title: "Vintage Campervan Adventure",
    description: "Explore the open road in a vintage campervan.",
    price: 100,
    address: "777 Adventure Road, Boulder, CO, USA",
    category: "campervan",
    image: {
      url: "https://source.unsplash.com/campervan1",
      filename: "campervan1.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-105.2705, 40.015],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },
  {
    title: "Modern Campervan Getaway",
    description: "A sleek campervan equipped with modern amenities.",
    price: 120,
    address: "888 Travel Lane, Portland, OR, USA",
    category: "campervan",
    image: {
      url: "https://source.unsplash.com/campervan2",
      filename: "campervan2.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-122.6765, 45.5231],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },

  // Castle
  {
    title: "Historic Scottish Castle",
    description: "Stay in a historic castle in the Scottish Highlands.",
    price: 300,
    address: "999 Highland Road, Inverness, UK",
    category: "castle",
    image: {
      url: "https://source.unsplash.com/castle1",
      filename: "castle1.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-4.2247, 57.4778],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },
  {
    title: "French Chateau Experience",
    description: "Experience luxury in a French chateau.",
    price: 350,
    address: "1010 Vineyard Lane, Bordeaux, France",
    category: "castle",
    image: {
      url: "https://source.unsplash.com/castle2",
      filename: "castle2.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-0.5792, 44.8378],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },

  // Container
  {
    title: "Urban Container Home",
    description: "A modern home built from shipping containers.",
    price: 130,
    address: "1111 Industrial Way, Austin, TX, USA",
    category: "container",
    image: {
      url: "https://source.unsplash.com/container1",
      filename: "container1.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-97.7431, 30.2672],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },
  {
    title: "Eco-Friendly Container House",
    description: "An eco-friendly house made from containers.",
    price: 140,
    address: "1212 Green Street, Portland, OR, USA",
    category: "container",
    image: {
      url: "https://source.unsplash.com/container2",
      filename: "container2.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-122.6765, 45.5231],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },

  // Earth Home
  {
    title: "Sustainable Earth Dome",
    description: "Live sustainably in a handcrafted earth dome.",
    price: 150,
    address: "1313 Eco Village Road, Sedona, AZ, USA",
    category: "earth_home",
    image: {
      url: "https://source.unsplash.com/earth_home1",
      filename: "earth_home1.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-111.7633, 34.8697],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },
  {
    title: "Organic Adobe Home",
    description: "Experience authentic living in an adobe earth home.",
    price: 160,
    address: "1414 Desert Trail, Santa Fe, NM, USA",
    category: "earth_home",
    image: {
      url: "https://source.unsplash.com/earth_home2",
      filename: "earth_home2.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-105.9378, 35.687],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },

  // Farm
  {
    title: "Organic Farm Stay",
    description: "Relax and enjoy a farm-to-table experience.",
    price: 110,
    address: "1515 Harvest Road, Sonoma, CA, USA",
    category: "farm",
    image: {
      url: "https://source.unsplash.com/farm1",
      filename: "farm1.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-122.458, 38.2919],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },
  {
    title: "Rural Ranch Retreat",
    description: "Unwind in a peaceful ranch environment.",
    price: 120,
    address: "1616 Ranch Lane, Bozeman, MT, USA",
    category: "farm",
    image: {
      url: "https://source.unsplash.com/farm2",
      filename: "farm2.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-111.0429, 45.676],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },

  // Guest House
  {
    title: "Charming Garden Guest House",
    description: "A cozy guest house surrounded by a lush garden.",
    price: 90,
    address: "1717 Bloom Street, Charleston, SC, USA",
    category: "guest_house",
    image: {
      url: "https://source.unsplash.com/guesthouse1",
      filename: "guesthouse1.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-79.9311, 32.7765],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },
  {
    title: "Modern City Guest House",
    description: "A stylish guest house with all modern comforts.",
    price: 110,
    address: "1818 Uptown Lane, Dallas, TX, USA",
    category: "guest_house",
    image: {
      url: "https://source.unsplash.com/guesthouse2",
      filename: "guesthouse2.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-96.797, 32.7767],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },

  // Hotel
  {
    title: "Luxury Downtown Hotel",
    description: "Enjoy premium amenities in a downtown hotel.",
    price: 220,
    address: "1919 Center Avenue, Boston, MA, USA",
    category: "hotel",
    image: {
      url: "https://source.unsplash.com/hotel1",
      filename: "hotel1.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-71.0589, 42.3601],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },
  {
    title: "Boutique Beach Hotel",
    description: "A chic boutique hotel near the beach.",
    price: 250,
    address: "2020 Ocean Drive, Santa Monica, CA, USA",
    category: "hotel",
    image: {
      url: "https://source.unsplash.com/hotel2",
      filename: "hotel2.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-118.4912, 34.0195],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },

  // Houseboat
  {
    title: "Floating Houseboat Retreat",
    description: "Stay in a serene floating houseboat.",
    price: 180,
    address: "2121 Marina Bay, Seattle, WA, USA",
    category: "houseboat",
    image: {
      url: "https://source.unsplash.com/houseboat1",
      filename: "houseboat1.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-122.3321, 47.6062],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },
  {
    title: "Modern Lake Houseboat",
    description: "A stylish houseboat on a picturesque lake.",
    price: 190,
    address: "2222 Lakeview Dock, Austin, TX, USA",
    category: "houseboat",
    image: {
      url: "https://source.unsplash.com/houseboat2",
      filename: "houseboat2.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-97.7431, 30.2672],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },

  // Tiny Home
  {
    title: "Modern Tiny Home",
    description: "Experience minimalist living in a modern tiny home.",
    price: 100,
    address: "2323 Green Street, Portland, OR, USA",
    category: "tiny_home",
    image: {
      url: "https://source.unsplash.com/tinyhome1",
      filename: "tinyhome1.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-122.6765, 45.5231],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },
  {
    title: "Eco-Friendly Tiny Cabin",
    description: "A sustainable tiny cabin in the woods.",
    price: 110,
    address: "2424 Cedar Lane, Asheville, NC, USA",
    category: "tiny_home",
    image: {
      url: "https://source.unsplash.com/tinyhome2",
      filename: "tinyhome2.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-82.5515, 35.5951],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },

  // Tower
  {
    title: "Historic Watchtower Stay",
    description: "Spend the night in a historic watchtower.",
    price: 200,
    address: "2525 Hilltop Road, Sedona, AZ, USA",
    category: "tower",
    image: {
      url: "https://source.unsplash.com/tower1",
      filename: "tower1.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-111.7633, 34.8697],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },
  {
    title: "Luxury Tower Suite",
    description: "A luxurious suite in a modern tower.",
    price: 300,
    address: "2626 Skyline Drive, Chicago, IL, USA",
    category: "tower",
    image: {
      url: "https://source.unsplash.com/tower2",
      filename: "tower2.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-87.6298, 41.8781],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },

  // Tree House
  {
    title: "Tree House Adventure",
    description: "A cozy retreat among the treetops.",
    price: 150,
    address: "2727 Forest Road, Asheville, NC, USA",
    category: "tree_house",
    image: {
      url: "https://source.unsplash.com/treehouse1",
      filename: "treehouse1.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-82.5515, 35.5951],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },
  {
    title: "Luxury Tree House Escape",
    description: "A luxury stay with panoramic forest views.",
    price: 180,
    address: "2828 Woodlands Drive, Portland, OR, USA",
    category: "tree_house",
    image: {
      url: "https://source.unsplash.com/treehouse2",
      filename: "treehouse2.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-122.6765, 45.5231],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },

  // Windmill
  {
    title: "Historic Windmill Stay",
    description: "A unique stay inside a historic windmill.",
    price: 200,
    address: "2929 Windy Lane, Amsterdam, Netherlands",
    category: "windmill",
    image: {
      url: "https://source.unsplash.com/windmill1",
      filename: "windmill1.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [4.9041, 52.3676],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },
  {
    title: "Modern Windmill Apartment",
    description: "An apartment inside a modern windmill.",
    price: 220,
    address: "3030 Breeze Street, Rotterdam, Netherlands",
    category: "windmill",
    image: {
      url: "https://source.unsplash.com/windmill2",
      filename: "windmill2.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [4.4792, 51.9225],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },

  // Yurt
  {
    title: "Mountain Yurt Experience",
    description: "A traditional yurt with breathtaking mountain views.",
    price: 130,
    address: "3131 Valley Road, Boulder, CO, USA",
    category: "yurt",
    image: {
      url: "https://source.unsplash.com/yurt1",
      filename: "yurt1.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-105.2705, 40.015],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },
  {
    title: "Desert Oasis Yurt",
    description: "A peaceful yurt nestled in the desert.",
    price: 140,
    address: "3232 Sand Dunes, Moab, UT, USA",
    category: "yurt",
    image: {
      url: "https://source.unsplash.com/yurt2",
      filename: "yurt2.jpg",
    },
    geometry: {
      type: "Point",
      coordinates: [-109.5466, 38.5733],
    },
    owner: new mongoose.Types.ObjectId(),
    reviews: [],
  },
];

module.exports = { data: sampleListings };
