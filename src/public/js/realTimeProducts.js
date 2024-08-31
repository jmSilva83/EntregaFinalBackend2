const socket = io();
console.log('connected from socket');

const productsForm = document.getElementById('productsForm');
const productsList = document.getElementById('products-list');

productsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(productsForm);
  console.log([...data.entries()]);
  fetch('/api/products', {
    method: 'POST',
    body: data,
  });
  productsForm.reset();
});

socket.on('newProduct', (data) => {
  const productElement = document.createElement('div');
  productElement.className = 'card';
  productElement.id = `product-${data._id}`;
  productElement.style.backgroundSize = 'cover';
  productElement.style.backgroundPosition = 'center';
  productElement.innerHTML = `
        <h2>${data.title}</h2>
        <p>${data.description}</p>
        <img src="${data.thumbnails[0].path}" alt="${data.title}" style="max-width: 100%">
        <p><strong>Price:</strong> $${data.price}</p>
        <p><strong>Stock:</strong> ${data.stock}</p>
        <p><strong>Code:</strong> ${data.code}</p>
        <p><strong>Category:</strong> ${data.category}</p>
        <button class="delete-btn" data-id="${data._id}">Delete</button>
    `;
  productsList.appendChild(productElement);

  const deleteButton = productElement.querySelector('.delete-btn');
  deleteButton.addEventListener('click', () => {
    console.log(`Deleting product with ID: ${data._id}`); 
    fetch(`/api/products/${data._id}`, { method: 'DELETE' })
      .then((response) => {
        if (response.ok) {
          console.log(`Producto con ID: ${data._id} eliminado correctamente`);
          productElement.remove();
        } else {
          console.error(`No se pudo eliminar el producto con ID: ${data._id}`);
        }
      })
      .catch((error) => console.error('Error:', error));
  });
});

socket.on('deleteProduct', async (productId) => {
  try {
    const product = await productsService.getProductById(productId);
    if (!product) {
      console.error(`Producto con ID ${productId} no encontrado para eliminar`);
      return;
    }
    await productsService.deleteProduct(productId);
    req.io.emit('deleteProduct', productId); 
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
  }
});
