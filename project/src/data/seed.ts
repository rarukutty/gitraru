export const destinations = [
  { id: 1, name: 'Bali, Indonesia', image: 'https://images.pexels.com/photos/1537640/pexels-photo-1537640.jpeg?auto=compress&cs=tinysrgb&w=800', rating: 4.8, trips: 1240 },
  { id: 2, name: 'Paris, France', image: 'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=800', rating: 4.9, trips: 3210 },
  { id: 3, name: 'Tokyo, Japan', image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800', rating: 4.7, trips: 2180 },
  { id: 4, name: 'New York, USA', image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800', rating: 4.6, trips: 4500 },
  { id: 5, name: 'Santorini, Greece', image: 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=800', rating: 4.9, trips: 980 },
  { id: 6, name: 'Dubai, UAE', image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800', rating: 4.7, trips: 1750 },
];

export const trendingTrips = [
  { id: 1, destination: 'Maldives', duration: '7 days', price: 3200, image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800', tag: 'Beach' },
  { id: 2, destination: 'Iceland', duration: '10 days', price: 4500, image: 'https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?auto=compress&cs=tinysrgb&w=800', tag: 'Adventure' },
  { id: 3, destination: 'Rome, Italy', duration: '5 days', price: 1800, image: 'https://images.pexels.com/photos/813361/pexels-photo-813361.jpeg?auto=compress&cs=tinysrgb&w=800', tag: 'Culture' },
  { id: 4, destination: 'Machu Picchu', duration: '8 days', price: 2900, image: 'https://images.pexels.com/photos/2929906/pexels-photo-2929906.jpeg?auto=compress&cs=tinysrgb&w=800', tag: 'Heritage' },
];

export const sampleTrips = [
  { id: '1', name: 'Bali Getaway', destination: 'Bali, Indonesia', start_date: '2026-06-10', end_date: '2026-06-20', budget: 3000, status: 'upcoming' as const, cover_image: 'https://images.pexels.com/photos/1537640/pexels-photo-1537640.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: '2', name: 'Tokyo Adventure', destination: 'Tokyo, Japan', start_date: '2026-05-01', end_date: '2026-05-15', budget: 4500, status: 'ongoing' as const, cover_image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: '3', name: 'Paris Romance', destination: 'Paris, France', start_date: '2025-12-20', end_date: '2025-12-28', budget: 2800, status: 'completed' as const, cover_image: 'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=800' },
];

export const samplePosts = [
  {
    id: '1',
    author: 'Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    destination: 'Bali, Indonesia',
    content: 'Just got back from an incredible week in Bali! The rice terraces at Tegallalang are absolutely breathtaking. Must-visit for anyone heading there.',
    image: 'https://images.pexels.com/photos/1537640/pexels-photo-1537640.jpeg?auto=compress&cs=tinysrgb&w=800',
    likes: 142,
    comments: 23,
    time: '2 hours ago',
  },
  {
    id: '2',
    author: 'Marcus Chen',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    destination: 'Tokyo, Japan',
    content: 'Cherry blossom season in Tokyo is everything I dreamed of. Ueno Park was magical! Pro tip: arrive early to get the best spots.',
    image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
    likes: 89,
    comments: 15,
    time: '5 hours ago',
  },
  {
    id: '3',
    author: 'Elena Vasquez',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    destination: 'Santorini, Greece',
    content: 'Watching the sunset from Oia is hands down the most romantic thing I have ever experienced. The blue domes and white walls - pure perfection.',
    image: 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=800',
    likes: 217,
    comments: 41,
    time: '1 day ago',
  },
];

export const expenseCategories = ['Accommodation', 'Food', 'Transport', 'Activities', 'Shopping', 'Other'];

export const checklistCategories = [
  {
    name: 'Documents',
    items: ['Passport', 'Visa', 'Travel insurance', 'Hotel bookings', 'Flight tickets', 'Emergency contacts'],
  },
  {
    name: 'Clothing',
    items: ['T-shirts', 'Pants/Shorts', 'Underwear', 'Socks', 'Jacket', 'Swimwear', 'Comfortable shoes'],
  },
  {
    name: 'Toiletries',
    items: ['Toothbrush', 'Toothpaste', 'Shampoo', 'Sunscreen', 'Deodorant', 'Medications'],
  },
  {
    name: 'Electronics',
    items: ['Phone charger', 'Camera', 'Power bank', 'Adapter/Converter', 'Earphones', 'Laptop'],
  },
];

export const adminStats = {
  totalUsers: 12480,
  activeTrips: 3241,
  totalRevenue: 284500,
  destinations: 156,
};

export const monthlyData = [
  { month: 'Jan', users: 820, trips: 340, revenue: 18200 },
  { month: 'Feb', users: 932, trips: 412, revenue: 21500 },
  { month: 'Mar', users: 1100, trips: 520, revenue: 26800 },
  { month: 'Apr', users: 1340, trips: 680, revenue: 33400 },
  { month: 'May', users: 1580, trips: 790, revenue: 41200 },
  { month: 'Jun', users: 1920, trips: 980, revenue: 52100 },
  { month: 'Jul', users: 2200, trips: 1150, revenue: 61800 },
  { month: 'Aug', users: 2450, trips: 1280, revenue: 68900 },
];

export const popularDestinationsData = [
  { name: 'Bali', value: 24 },
  { name: 'Paris', value: 19 },
  { name: 'Tokyo', value: 16 },
  { name: 'New York', value: 14 },
  { name: 'Dubai', value: 12 },
  { name: 'Others', value: 15 },
];
