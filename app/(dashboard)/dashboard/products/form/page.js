"use client";
import React, { useContext, useState, useEffect } from "react";
import { CircleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import "@/styles/dashboard/forms.css";
import Images from "@/components/dashboard/forms/Images";
import Tags from "@/components/dashboard/forms/Tags";
import Specs from "@/components/dashboard/forms/Specs";
import SelectOptions from "@/components/dashboard/forms/SelectOptions";
import { forms } from "@/Contexts/forms";
import {
  create,
  update,
  getOne,
  removeImage,
} from "@/services/porducts/products.service";
import { getAll as getCategories } from "@/services/categories/categories.service";
import useTranslate from "@/Contexts/useTranslation";
import { useRouter } from "next/navigation";
import { useNotification } from "@/Contexts/NotificationContext";
import { useSearchParams } from "next/navigation";
import FormLangSwitch from "@/components/dashboard/forms/FormLangSwitch";

export default function Product() {
  const { setisSubmited, images, setImages } = useContext(forms);
  const t = useTranslate();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const [curentCreateLocale, setCurentCreateLocale] = useState("EN");

  const [oldImages, setOldImages] = useState([]);
  const { addNotification } = useNotification();
  const router = useRouter();

  // Categories state
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  console.log("categories:", categories);

  // Translations state for multilingual fields
  const [translations, setTranslations] = useState({
    EN: { title: "", description: "" },
    AR: { title: "", description: "" },
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories("product", "EN");

        const formattedCategories = res.data.map((cat) => ({
          id: cat._id,
          name: cat.name,
          icon: cat.icon,
        }));
        setCategories(formattedCategories);
        console.log("formattedCategories:", formattedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        addNotification({
          type: "warning",
          message: "Failed to load categories",
        });
      }
    };
    fetchCategories();
  }, [addNotification]);

  // Handle translation changes
  const handleTranslationChange = (field, value) => {
    setTranslations((prev) => ({
      ...prev,
      [curentCreateLocale]: {
        ...prev[curentCreateLocale],
        [field]: value,
      },
    }));
  };

  // Fetch product data for edit mode
  useEffect(() => {
    if (!editId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getOne(editId);
        const product = res.data.product;

        // Set translations
        setTranslations({
          EN: product.translations?.EN || {
            title: product.title,
            description: product.description,
          },
          AR: product.translations?.AR || {
            title: product.title,
            description: product.description,
          },
        });

        // Set form values for non-translated fields
        setValue("stock", product.stock);
        setValue("price", product.price);
        setValue("sale", product.sale || "");

        // Set category
        if (product.category) {
          setSelectedCategory({
            id: product.category._id,
            name: product.category.name,
          });
        }

        // Set images
        if (product.images && product.images.length > 0) {
          setImages(product.images);
          setOldImages(product.images);
        }

        // TODO: Set tags and specs if needed
      } catch (err) {
        console.error(err);
        addNotification({
          type: "warning",
          message: err.response?.data?.message || "Something went wrong ❌",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [editId, addNotification, setImages, setValue]);

  const onSubmit = async (data) => {
    setisSubmited(true);

    // Validate translations
    const finalName =
      translations.EN.title?.trim() || translations.AR.title?.trim() || "";
    const finalDesc =
      translations.EN.description?.trim() || translations.AR.description?.trim() || "";

    if (!finalName) {
      addNotification({
        type: "warning",
        message: "Product name is required",
      });
      return;
    }
    if (!finalDesc) {
      addNotification({
        type: "warning",
        message: "Product description is required",
      });
      return;
    }

    // Validate images
    if (!images || images.length === 0) {
      addNotification({
        type: "warning",
        message: "At least one image is required",
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      // Add basic data

      const finalName =
        translations.EN.title?.trim() || translations.AR.title?.trim() || "";
      const finalDesc =
        translations.EN.description?.trim() || translations.AR.description?.trim() || "";

      formData.append("name", finalName);
      formData.append("desc", finalDesc);
      formData.append("price", data.price);
      if (data.sale) formData.append("discount", data.sale);
      formData.append("quantity", data.stock);
      if (selectedCategory?.id) formData.append("category", selectedCategory.id);

      // Add translations
      formData.append(
        "translations",
        JSON.stringify({
          EN: {
            name: translations.EN.title || finalName,
            desc: translations.EN.description || finalDesc,
          },
          AR: {
            name: translations.AR.title || finalName,
            desc: translations.AR.description || finalDesc,
          },
        }),
      );

      // TODO: Add tags and specs if needed
      // if (data.tags) formData.append("tags", JSON.stringify(data.tags));
      // if (data.specs) formData.append("specs", JSON.stringify(data.specs));

      // Handle images
      if (editId) {
        // Handle removed images in edit mode
        const oldImageIds = oldImages.map((img) => img.publicId || img._id);
        const currentImageIds = images
          .filter((img) => !(img instanceof File))
          .map((img) => img.publicId || img._id);

        const removedImages = oldImageIds.filter(
          (id) => !currentImageIds.includes(id),
        );

        // Delete removed images
        for (const imgId of removedImages) {
          await removeImage(imgId, "product", editId);
        }

        // Add new images
        images.forEach((image) => {
          if (image instanceof File) {
            formData.append("images", image);
          }
        });
      } else {
        // In create mode, add all images
        images.forEach((image) => {
          if (image instanceof File) {
            formData.append("imgs", image);
          }
        });
      }

      if (editId) {
        await update(editId, formData);
        addNotification({
          type: "success",
          message: "Product Updated Successfully",
        });
      } else {
        await create(formData);
        addNotification({
          type: "success",
          message: "Product Created Successfully",
        });
      }

      router.push("/dashboard/products");
      setImages([]);
      setisSubmited(false);
    } catch (error) {
      console.log("error:", error);
      addNotification({
        type: "warning",
        message: error.response?.data?.message || "Something went wrong ❌",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="body">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Language Switch */}
        <FormLangSwitch
          curentCreateLocale={curentCreateLocale}
          setCurentCreateLocale={setCurentCreateLocale}
          loadingSubmit={loading}
          editId={editId}
        />

        {/* ---------- TITLE & CATEGORY ---------- */}
        <div className="row-holder two-column">
          <div className="box forInput">
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <label htmlFor="title">{t.dashboard.forms.title}</label>
              <span className="lang-badge">({curentCreateLocale})</span>
            </div>
            <div className="inputHolder">
              <div className="holder">
                <input
                  id="title"
                  type="text"
                  placeholder={`${t.dashboard.forms.titlePlaceholder} (${curentCreateLocale})`}
                  value={translations[curentCreateLocale]?.title || ""}
                  onChange={(e) =>
                    handleTranslationChange("title", e.target.value)
                  }
                />
              </div>
              {curentCreateLocale === "EN" &&
                !translations.EN.title?.trim() && (
                  <span className="error">
                    <CircleAlert />
                    English title is required
                  </span>
                )}
              {curentCreateLocale === "AR" &&
                !translations.AR.title?.trim() && (
                  <span className="error">
                    <CircleAlert />
                    Arabic title is required
                  </span>
                )}
            </div>
          </div>

          <SelectOptions
            label={t.dashboard.forms.category}
            placeholder={t.dashboard.forms.categoryPlaceholder}
            options={categories}
            value={selectedCategory}
            onChange={(cat) => {
              setSelectedCategory(cat);
            }}
          />
        </div>

        {/* ---------- STOCK / PRICE / SALE ---------- */}
        <div className="row-holder">
          <InputBox
            label={t.dashboard.forms.stock}
            placeholder={t.dashboard.forms.stockPlaceholder}
            error={errors.stock}
          >
            <input
              type="number"
              {...register("stock", {
                required: t.dashboard.forms.errors.stockRequired,
                min: {
                  value: 1,
                  message: t.dashboard.forms.errors.stockMin,
                },
              })}
            />
          </InputBox>

          <InputBox
            label={t.dashboard.forms.price}
            placeholder={t.dashboard.forms.pricePlaceholder}
            error={errors.price}
          >
            <input
              type="number"
              {...register("price", {
                required: t.dashboard.forms.errors.priceRequired,
                min: {
                  value: 1,
                  message: t.dashboard.forms.errors.priceMin,
                },
              })}
            />
          </InputBox>

          <InputBox
            label={t.dashboard.forms.sale}
            placeholder={t.dashboard.forms.salePlaceholder}
            error={errors.sale}
          >
            <input
              type="number"
              {...register("sale", {
                validate: (v) =>
                  v === "" || v <= 90 || t.dashboard.forms.errors.saleMax,
              })}
            />
          </InputBox>
        </div>

        {/* ---------- DESCRIPTION ---------- */}
        <div className="box forInput">
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <label htmlFor="description">{t.dashboard.forms.description}</label>
            <span className="lang-badge">({curentCreateLocale})</span>
          </div>
          <div className="inputHolder">
            <div className="holder">
              <textarea
                id="description"
                value={translations[curentCreateLocale]?.description || ""}
                onChange={(e) =>
                  handleTranslationChange("description", e.target.value)
                }
                placeholder={`${t.dashboard.forms.descriptionPlaceholder} (${curentCreateLocale})`}
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* ---------- TAGS / SPECS / IMAGES ---------- */}
        <div className="row-holder two-column">
          <div className="column-holder">
            <Tags />
            <Specs />
          </div>
          <Images limit={5} />
        </div>

        {/* ---------- SUBMIT ---------- */}
        <button
          type="submit"
          className="main-button"
          disabled={loading}
          onClick={() => setisSubmited(true)}
        >
          <span
            className="loader"
            style={{ opacity: loading ? "1" : "0" }}
          ></span>
          <span style={{ opacity: loading ? "0" : "1" }}>
            {editId
              ? t.dashboard.forms.updateProduct
              : t.dashboard.forms.createProduct}
          </span>
        </button>
      </form>
    </div>
  );
}

/* ---------- Reusable Input ---------- */
function InputBox({ label, placeholder, error, children }) {
  return (
    <div className="box forInput">
      <label>{label}</label>
      <div className="inputHolder">
        <div className="holder">
          {React.cloneElement(children, { placeholder })}
        </div>
        {error && (
          <span className="error">
            <CircleAlert />
            {error.message}
          </span>
        )}
      </div>
    </div>
  );
}
