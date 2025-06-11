async function getProducts() {
    const request = new Request("http://localhost:8080/v1/products", {
        headers: {
            "Content-Type": "application/json"
        },
        method: "GET"
    });

    try {
        const response = await fetch(request);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Fetch error in getProducts:", error.message);
        return null;
    }
}

export async function addProduct(data) {
    const formData = new FormData(data);
    const request = new Request("http://localhost:8080/v1/products", {
        method: "POST",
        body: formData
    });

    try {
        const response = await fetch(request);
        if (!response.ok) {
            const errorText = await response.text(); // untuk error message dari server jika ada
            throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Fetch error in addProduct:", error.message);
        return null;
    }
}

export async function deleteProduct(id) {
    const request = new Request(`http://localhost:8080/v1/products/${id}`, {
        method: "DELETE"
    });

    try {
        const response = await fetch(request);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
        }
        return true;
    } catch (error) {
        console.error("Fetch error in deleteProduct:", error.message);
        return false;
    }
}

export async function updateProduct(id, formData) {
    const request = new Request(`http://localhost:8080/v1/products/${id}`, {
        method: "PUT",
        body: formData
    });

    try {
        const response = await fetch(request);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Fetch error in updateProduct:", error.message);
        return null;
    }
}

export default getProducts;
