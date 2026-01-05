const addProductViewHistory = (productId) => {
  if (typeof window === "undefined") return;
  if (!productId) return;
  let productViewHistory =
    JSON.parse(localStorage.getItem("productViewHistory")) || [];

  if (!productViewHistory.includes(productId)) {
    productViewHistory.unshift(productId);
    if (productViewHistory.length > 5) {
      productViewHistory.pop();
    }

    localStorage.setItem(
      "productViewHistory",
      JSON.stringify(productViewHistory)
    );
  } else {
    productViewHistory = productViewHistory.filter((id) => id !== productId);
    productViewHistory.unshift(productId);
    localStorage.setItem(
      "productViewHistory",
      JSON.stringify(productViewHistory)
    );
  }
};

const getProductViewHistory = () => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("productViewHistory")) || [];
};

const clearProductViewHistory = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("productViewHistory");
};

const removeProductFromViewHistory = (productId) => {
  if (typeof window === "undefined") return;
  if (!productId) return;
  let productViewHistory =
    JSON.parse(localStorage.getItem("productViewHistory")) || [];

  productViewHistory = productViewHistory.filter((id) => id !== productId);

  localStorage.setItem(
    "productViewHistory",
    JSON.stringify(productViewHistory)
  );
};

export {
  addProductViewHistory,
  getProductViewHistory,
  clearProductViewHistory,
  removeProductFromViewHistory,
};
