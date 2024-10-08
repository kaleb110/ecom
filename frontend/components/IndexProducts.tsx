"use client";

const IndexProducts = () => {
  const indexProducts = async () => {
    try {
      const response = await fetch("/api/algolia", {
        method: "POST",
      });
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error indexing products:", error);
    }
  };

  return <button onClick={indexProducts}>Index Products in Algolia</button>;
};

export default IndexProducts;
