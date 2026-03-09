const CartService = {
    STORAGE_KEY: 'cart',
    
    getCart() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    },
    
    setCart(cart) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    },
    
    addItem(product, quantity = 1) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                oldPrice: product.oldPrice,
                image: product.image,
                rating: product.rating,
                ratingCount: product.ratingCount,
                quantity: quantity
            });
        }
        
        this.setCart(cart);
    },
    
    updateItemQuantity(itemId, quantity) {
        if (quantity < 1 || quantity > 99) return false;
        
        const cart = this.getCart();
        const item = cart.find(i => i.id === itemId);
        
        if (item) {
            item.quantity = quantity;
            this.setCart(cart);
            return true;
        }
        
        return false;
    },
    
    removeItem(itemId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== itemId);
        this.setCart(cart);
    },
    
    clearCart() {
        localStorage.removeItem(this.STORAGE_KEY);
    },
    
    getTotal() {
        const cart = this.getCart();
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    
    getItemCount() {
        const cart = this.getCart();
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    }
};