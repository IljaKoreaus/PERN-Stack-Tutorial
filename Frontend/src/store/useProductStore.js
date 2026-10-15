import {create} from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

// DYNAMIC BASE URL
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

export const useProductStore = create((set, get) => ({
    // Product State
    products:[],
    loading:false,
    error:null,
    currentProduct:null,

    // Form State
    formData: {
        name:"",
        price:"",
        image:""
    },

    setFormData: (formData) => set({formData}),

    resetForm: () => set({formData: {name:"", price: "", image: ""}}),

    addProduct: async (e) => {
        e.preventDefault();
        set({loading: true});

        try {
            const {formData} = get();
            await axios.post(`${BASE_URL}/api/products`, formData);
            await get().fetchProducts();
            get().resetForm();
            toast.success("Product Added Successfully");

            document.getElementById("add_product_modal").close();

        } catch (error) {

            console.log("Error", error);
            toast.error("Error Whilst Adding Product");
            
        } finally {

            set({loading: false});
        }
    },

    fetchProducts: async () => {

        set({loading: true});

        try {
            const response = await axios.get(`${BASE_URL}/api/products`);
            set({products: response.data.data, error:null});

        } catch (error) {

            if (error.status == 429) {
                set({error:"Rate Limit Exceeded", products: []});

            } else {
                set({error:"Something Went Wrong", products: []});
            }

        } finally {
            set({loading:false})
        }
    },

    deleteProduct: async (id) => {
        set({loading: true});

        try {

            await axios.delete(`${BASE_URL}/api/products/${id}`);
            set(prev => ({products: prev.products.filter(product => product.id !== id)}));
            toast.success("Product Deleted Successfully");

        } catch (error) {

            console.log("Error While Deleting Product", error);
            toast.error("Something went wrong")
        } finally {

            set({loading: false});

        }
    },

    fetchProduct: async (id) => {
        set({loading: true});

        try {
            const response = await axios.get(`${BASE_URL}/api/products/${id}`);
            set({currentProduct: response.data.data,
                formData: response.data.data,
                error: null
            });

        } catch (error) {
            console.log("Error in fetchProduct function");
            set({error: "Ooops..", currentProduct: null});
        } finally {

            set({loading: false});
        }
    },

    updateProduct: async (id) => {

        set({loading: true});

        try {
            const {formData} = get();
            const response = await axios.put(`${BASE_URL}/api/products/${id}`, formData);
            set({currentProduct: response.data.data});
            toast.success("Product Updated!");

        } catch (error) {
            console.log("Error in updateProduct function");
            toast.error("Error When Updating Product")
        } finally {

            set({loading: false});
        }
    }
}));