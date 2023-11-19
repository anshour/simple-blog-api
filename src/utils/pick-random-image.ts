const imageUrl = [
  "https://images.unsplash.com/photo-1557683316-973673baf926?q=90&w=1024&h=576&auto=format&fit=crop&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1554034483-04fda0d3507b?q=90&w=1024&h=576&auto=format&fit=crop&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1508614999368-9260051292e5?q=90&w=1024&h=576&auto=format&fit=crop&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?q=90&w=1024&h=576&auto=format&fit=crop&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?q=90&w=1024&h=576&auto=format&fit=crop&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=90&w=1024&h=576&auto=format&fit=crop&ixlib=rb-4.0.3",
];

const pickRandomImage = (): string => {
  const randomIndex = Math.floor(Math.random() * imageUrl.length);
  return imageUrl[randomIndex];
};

export default pickRandomImage;
