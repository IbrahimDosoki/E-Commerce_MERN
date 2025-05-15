import productModel from "../Models/productModel";

export const getAllProducts = async () => {
  return await productModel.find();
};

export const seedInitialProducts = async () => {
  const products = [
    {
      title: "HP Laptop",
      image:
        "https://i.pinimg.com/736x/62/1b/be/621bbe3e4131d20e3bbaeb7868578204.jpg",
      price: 25000,
      stock: 10,
    },
    //     { title: "Product 2", image: "image2.jpg", price: 20, stock: 56 },
    //     { title: "Product 3", image: "image3.jpg", price: 15, stock: 33 },
    //     { title: "Product 4", image: "image4.jpg", price: 25, stock: 40 },
    //     { title: "Product 5", image: "image5.jpg", price: 5, stock: 70 },
    //     { title: "Product 6", image: "image6.jpg", price: 30, stock: 12 },
    //     { title: "Product 7", image: "image7.jpg", price: 35, stock: 30 },
    //     { title: "Product 8", image: "image8.jpg", price: 18, stock: 7 },
    //     { title: "Product 9", image: "image9.jpg", price: 40, stock: 20 },
    //     { title: "Product 10", image: "image0.jpg", price: 55, stock: 10 },
  ];

  const existingProducts = await getAllProducts();

  if (existingProducts.length === 0) {
    await productModel.insertMany(products);
  }
};

// export const addNewProduct = () =>  {

// } => TODO
