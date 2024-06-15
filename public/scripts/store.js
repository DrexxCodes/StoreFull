 // Check if user is logged in
 auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = 'login.html';
    } else {
        fetchProducts();
    }
});

function fetchProducts() {
    const productsContainer = document.getElementById('products-container');
    db.collection('products').get().then(querySnapshot => {
        productsContainer.innerHTML = ''; // Clear previous products
        querySnapshot.forEach(doc => {
            const product = doc.data();
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p><strong>₦ ${product.price}</strong></p>
                <button class="action-button" onclick="addToCart('${doc.id}', '${product.name}', '${product.image}', ${product.price})">
                    <i></i>Add to Cart
                </button>
                <button class="action-button" onclick="window.open('${product.reviewUrl}', '_blank')">View Reviews</button>
                <button class="save-button" onclick="saveItem('${doc.id}', '${product.name}', '${product.image}', ${product.price})">
                    <i class="fas fa-bookmark"></i>
                </button>
            `;
            productsContainer.appendChild(productElement);
        });
    }).catch(error => {
        console.error("Error fetching products:", error);
    });
}

function searchProducts() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    const productsContainer = document.getElementById('products-container');
    db.collection('products').get().then(querySnapshot => {
        productsContainer.innerHTML = ''; // Clear previous products
        querySnapshot.forEach(doc => {
            const product = doc.data();
            if ((product.name.toLowerCase().includes(searchInput) || product.description.toLowerCase().includes(searchInput)) &&
                (categoryFilter === "" || product.category === categoryFilter)) {
                const productElement = document.createElement('div');
                productElement.classList.add('product');
                productElement.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <p><strong>₦ ${product.price}</strong></p>
                    <button class="action-button" onclick="addToCart('${doc.id}', '${product.name}', '${product.image}', ${product.price})">
                        <i></i>Add to Cart
                    </button>
                    <button class="action-button" onclick="window.open('${product.reviewUrl}', '_blank')">View Reviews</button>
                    <button class="save-button" onclick="saveItem('${doc.id}', '${product.name}', '${product.image}', ${product.price})">
                        <i class="fas fa-bookmark"></i>
                    </button>
                `;
                productsContainer.appendChild(productElement);
            }
        });
    }).catch(error => {
        console.error("Error searching products:", error);
    });
}

function addToCart(productId, name, image, price) {
    const user = auth.currentUser;
    if (user) {
        db.collection('carts').doc(user.uid).set({
            products: firebase.firestore.FieldValue.arrayUnion({ productId, name, image, price })
        }, { merge: true }).then(() => {
            alert("Product added to cart successfully!");
            console.log("Product added to cart:", { productId, name, image, price });
        }).catch(error => {
            console.error("Error adding product to cart:", error);
        });
    } else {
        window.location.href = 'login.html';
    }
}

function saveItem(productId, name, image, price) {
    const user = auth.currentUser;
    if (user) {
        db.collection('savedItems').doc(user.uid).set({
            items: firebase.firestore.FieldValue.arrayUnion({ productId, name, image, price })
        }, { merge: true }).then(() => {
            alert("Item saved successfully!");
            console.log("Item saved:", { productId, name, image, price });
        }).catch(error => {
            console.error("Error saving item:", error);
        });
    } else {
        window.location.href = 'login.html';
    }
}