// Utility to load images dynamically
const imageContext = require.context(
  "../assets/images/data",
  true,
  /\.(png|jpe?g|svg)$/
);

const imageMap = {};
imageContext.keys().forEach((key) => {
  const image = imageContext(key);
  // key is like ./camera/camera3/Lorex-Camera.png
  const path = key.slice(2); // remove ./
  imageMap[path] = image;
});

const getImageSrc = (type, id) => {
  const possiblePaths = [
    `${type}/${id}/Lorex-Camera.png`,
    `${type}/${id}/images.jpeg`,
    `${type}/${id}/images.jpg`,
    // Add more patterns if needed
  ];

  for (const path of possiblePaths) {
    if (imageMap[path]) {
      return imageMap[path];
    }
  }

  // Fallback
  return require("../assets/images/2logo.png");
};

const getProductImages = (type, id) => {
  const productImages = [];

  // Get all images that match the product path
  Object.keys(imageMap).forEach((path) => {
    if (path.startsWith(`${type}/${id}/`)) {
      productImages.push({
        src: imageMap[path],
        alt: `${type} ${id} image ${productImages.length + 1}`,
      });
    }
  });

  // Return images array, or fallback if no images found
  return productImages.length > 0
    ? productImages
    : [
        {
          src: require("../assets/images/2logo.png"),
          alt: "Default product image",
        },
      ];
};

export { getImageSrc, getProductImages };
export default getImageSrc;
