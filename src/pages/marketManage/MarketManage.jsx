import { useState, useEffect } from "react";
import styles from "./marketManage.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  useAddProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from "../../redux/products/productsApis";
import ProductCard from "../../components/products/productCard/ProductCard";
import { successMessage } from "../../redux/toasts";
// import { useTranslation } from "react-i18next";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  type: Yup.string().required("Type is required"),
  image: Yup.string().required("Image is required"),
  brand: Yup.string().required("Brand is required"),
  stock: Yup.number()
    .required("Stock is required")
    .positive("Stock must be positive")
    .integer("Stock must be an integer"),
  sales: Yup.number()
    .required("Sales is required")
    .min(0, "Sales cannot be negative"),
});

const MarketManage = () => {
  // const { t } = useTranslation();
  const { data: products = [], isLoading, error, refetch } = useProducts();
  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenModal = (product = null) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      // Note: For production, consider uploading to Firebase Storage
      // and storing the download URL instead of base64.
      const reader = new FileReader();
      reader.onloadend = () => {
        setFieldValue("image", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (selectedProduct) {
        await updateProductMutation.mutateAsync({
          fireId: selectedProduct.fireId,
          ...values,
        });
        successMessage("Product updated successfully");
      } else {
        await addProductMutation.mutateAsync(values);
        successMessage("Product added successfully");
      }
      resetForm();
      handleCloseModal();
      refetch();
    } catch (err) {
      console.error("Error submitting product:", err);
    }
  };

  const handleDelete = async (fireId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProductMutation.mutateAsync(fireId);
      refetch();
      successMessage("Product deleted successfully");
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        handleCloseModal();
      }
    };
    if (isModalOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isModalOpen]);

  // Product type options relevant to computer accessories store
  const productTypeOptions = [
    { value: "", label: "Select Type" },
    { value: "Mouse", label: "Mouse" },
    { value: "Keyboard", label: "Keyboard" },
    { value: "Ink", label: "Ink / Toner" },
    { value: "MousePad", label: "Mouse Pad" },
    { value: "Cables", label: "Cables" },
    { value: "Printer", label: "Printer" },
    { value: "Scanner", label: "Scanner" },
    { value: "Monitor", label: "Monitor" },
    { value: "Accessory", label: "Accessory" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.mainSection}>
        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>Market Management</h3>
          <div className={styles.controls}>
            <input
              type="text"
              placeholder="Search products..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className={styles.addButton}
              onClick={() => handleOpenModal()}
            >
              Add Product
            </button>
          </div>
          {isLoading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
          <div className={styles.productGrid}>
            {filteredProducts.map((product) => (
              <div key={product.fireId} className={styles.productCardWrapper}>
                <ProductCard data={product}>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleOpenModal(product)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(product.fireId)}
                    >
                      Delete
                    </button>
                  </div>
                </ProductCard>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{selectedProduct ? "Edit Product" : "Add Product"}</h2>
            <Formik
              initialValues={{
                name: selectedProduct?.name || "",
                description: selectedProduct?.description || "",
                type: selectedProduct?.type || "",
                image: selectedProduct?.image || "",
                brand: selectedProduct?.brand || "",
                stock: selectedProduct?.stock || "",
                sales: selectedProduct?.sales || 0,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form className={styles.form}>
                  <div className={styles.formGroup}>
                    <label>Name</label>
                    <Field name="name" type="text" className={styles.input} />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className={styles.error}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <Field name="description" as="textarea" className={styles.input} />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className={styles.error}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Type</label>
                    <Field name="type" as="select" className={styles.input}>
                      {productTypeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="type"
                      component="div"
                      className={styles.error}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Price</label>
                    <Field
                      name="price"
                      type="number"
                      className={styles.input}
                    />
                    <ErrorMessage
                      name="price"
                      component="div"
                      className={styles.error}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.input}
                      onChange={(event) =>
                        handleImageChange(event, setFieldValue)
                      }
                    />
                    {selectedProduct?.image && (
                      <img
                        src={selectedProduct.image}
                        alt="Preview"
                        style={{ width: 50, marginTop: 5 }}
                      />
                    )}
                    <ErrorMessage
                      name="image"
                      component="div"
                      className={styles.error}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Brand</label>
                    <Field name="brand" type="text" className={styles.input} />
                    <ErrorMessage
                      name="brand"
                      component="div"
                      className={styles.error}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Stock Quantity</label>
                    <Field
                      name="stock"
                      type="number"
                      className={styles.input}
                    />
                    <ErrorMessage
                      name="stock"
                      component="div"
                      className={styles.error}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Sales (Optional)</label>
                    <Field
                      name="sales"
                      type="number"
                      className={styles.input}
                    />
                    <ErrorMessage
                      name="sales"
                      component="div"
                      className={styles.error}
                    />
                  </div>
                  <div className={styles.formButtons}>
                    <button
                      type="submit"
                      className={styles.submitButton}
                      disabled={isSubmitting}
                    >
                      {selectedProduct ? "Update" : "Add"} Product
                    </button>
                    <button
                      type="button"
                      className={styles.cancelButton}
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketManage;
