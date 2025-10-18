import React, { useState } from "react";
import { createProduct } from "../services/product.service";

export default function ProductCreate() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [stock, setStock] = useState(0); // <-- new stock state

  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", title);
    // backend validation expects 'priceAmount' and optional 'priceCurrency'
    fd.append("priceAmount", price);
    fd.append("description", desc);
    fd.append("stock", stock); // <-- append stock
    if (file) fd.append("images", file);
    try {
      await createProduct(fd);
      alert("Created");
    } catch (err) {
      // show server validation messages if available
      const msg = err?.response?.data?.message || err?.message || "Error";
      setError(msg);
    }
  };

  return (
    <form className="p-4 bg-white rounded shadow" onSubmit={submit}>
      <div className="mb-2">
        <label className="block">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
      <div className="mb-2">
        <label className="block">Price</label>
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
      <div className="mb-2">
        <label className="block">Description</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
      <div className="mb-2">
        <label className="block">Image</label>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      </div>
      {/* ---------------- Stock Input ---------------- */}
      <div className="mb-2">
        <label className="block">Stock</label>
        <input
          type="number"
          value={stock}
          min={0}
          onChange={(e) => setStock(Number(e.target.value))}
          className="border p-2 w-full"
        />
      </div>
      <div className="mt-3">
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Create
        </button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    </form>
  );
}
