import axios from "axios";

const API_URL = "http://localhost:5000/api/products";

export const getProducts = async () => {
    const token = localStorage.getItem("token");
    return axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const addProduct = async (product) => {
    const token = localStorage.getItem("token");
    return axios.post(API_URL, product, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const updateProduct = async (id, product) => {
    const token = localStorage.getItem("token");
    return axios.put(`${API_URL}/${id}`, product, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const deleteProduct = async (id) => {
    const token = localStorage.getItem("token");
    return axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
