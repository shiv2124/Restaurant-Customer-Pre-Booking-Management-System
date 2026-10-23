// Mock restaurant data. In a real app this would come from an API
// (see "Fetching Data from an API" in the React guide).

const photo = (id, width) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

const restaurants = [
  {
    id: '1',
    name: 'Spice Garden',
    cuisine: 'Indian',
    location: 'Mumbai',
    address: 'Bandra, Mumbai',
    rating: 4.5,
    priceRange: '₹₹',
    photoId: 958545,
    openTime: '11:00',
    closeTime: '23:00',
    phone: '+91 98765 43210',
    description:
      'Experience authentic Indian flavors in a warm, welcoming atmosphere. Our chefs use traditional recipes passed down through generations.',
  },
  {
    id: '2',
    name: 'Pasta Paradise',
    cuisine: 'Italian',
    location: 'Delhi',
    address: 'Connaught Place, Delhi',
    rating: 4.2,
    priceRange: '₹₹₹',
    photoId: 1279330,
    openTime: '12:00',
    closeTime: '22:30',
    phone: '+91 98111 22334',
    description:
      'Hand-rolled pasta, wood-fired sauces and a long wine list, served in a candlelit dining room.',
  },
  {
    id: '3',
    name: 'Dragon Palace',
    cuisine: 'Chinese',
    location: 'Bangalore',
    address: 'Indiranagar, Bangalore',
    rating: 4.7,
    priceRange: '₹₹',
    photoId: 1640777,
    openTime: '11:30',
    closeTime: '23:30',
    phone: '+91 98450 11223',
    description:
      'Sichuan and Cantonese classics, from hand-pulled noodles to slow-braised duck, made to share.',
  },
  {
    id: '4',
    name: 'Burger Junction',
    cuisine: 'American',
    location: 'Mumbai',
    address: 'Andheri West, Mumbai',
    rating: 4.0,
    priceRange: '₹',
    photoId: 1639557,
    openTime: '10:00',
    closeTime: '24:00',
    phone: '+91 99200 55667',
    description:
      'Stacked burgers, loaded fries and thick shakes. Open late for groups and game nights.',
  },
  {
    id: '5',
    name: 'Sushi Master',
    cuisine: 'Japanese',
    location: 'Delhi',
    address: 'Hauz Khas Village, Delhi',
    rating: 4.8,
    priceRange: '₹₹₹₹',
    photoId: 357756,
    openTime: '18:00',
    closeTime: '23:00',
    phone: '+91 98730 99887',
    description:
      'An intimate omakase counter and dining room, with fish flown in fresh every morning.',
  },
  {
    id: '6',
    name: 'Taco Fiesta',
    cuisine: 'Mexican',
    location: 'Bangalore',
    address: 'Koramangala, Bangalore',
    rating: 4.3,
    priceRange: '₹₹',
    photoId: 461198,
    openTime: '12:00',
    closeTime: '22:00',
    phone: '+91 98860 44556',
    description:
      'Street-style tacos, fresh guacamole and margaritas on a sunny patio.',
  },
].map(({ photoId, ...restaurant }) => ({
  ...restaurant,
  image: photo(photoId, 400),
  imageLarge: photo(photoId, 800),
}));

export function getRestaurants() {
  return restaurants;
}

export function getRestaurantById(id) {
  return restaurants.find((restaurant) => restaurant.id === id) ?? null;
}
