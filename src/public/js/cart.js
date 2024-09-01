// cart.js
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.add-to-cart-form');

    forms.forEach(form => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault(); // Evita que el formulario se envíe de la forma tradicional

            const productId = form.getAttribute('data-product-id');
            const quantity = form.querySelector('input[name="quantity"]').value;

            try {
                const response = await fetch(`/carts/${yourCartId}/products/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + yourJwtToken // Reemplaza con el token real si es necesario
                    },
                    body: JSON.stringify({ quantity })
                });

                if (response.ok) {
                    const result = await response.json();
                    alert('Producto agregado al carrito');
                    // Aquí puedes actualizar la UI si es necesario
                } else {
                    const error = await response.json();
                    alert('Error al agregar el producto al carrito: ' + error.message);
                }
            } catch (error) {
                alert('Error de red: ' + error.message);
            }
        });
    });
});
