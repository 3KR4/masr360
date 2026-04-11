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
import { mainContext } from "@/Contexts/mainContext";

export default function Product() {
  const { 
    setisSubmited, 
    images, 
    setImages, 
    tags, 
    specifications,
    setTags,
    setSpecifications,
    updateCompsInput,
    updateCompsError,
  } = useContext(forms);
  const t = useTranslate();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = Boolean(editId);
  const [curentCreateLocale, setCurentCreateLocale] = useState("EN");

  const [oldImages, setOldImages] = useState([]);
  const { addNotification } = useNotification();
  const router = useRouter();

  // Categories state
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productCategoryId, setProductCategoryId] = useState(null);

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

  const { locale } = useContext(mainContext);

  // Reset form for create mode
  useEffect(() => {
    if (isEditMode) return;

    setTranslations({
      EN: { title: "", description: "" },
      AR: { title: "", description: "" },
    });
    setSelectedCategory(null);
    setProductCategoryId(null);
    setImages([]);
    setTags([]);
    setSpecifications([]);
    setOldImages([]);
    setCurentCreateLocale("EN");
    setisSubmited(false);
    updateCompsInput?.("tags", "");
    updateCompsError?.("tags", "");
    updateCompsError?.("specs", "");
    setValue("stock", 0);
    setValue("price", 0);
    setValue("sale", "");
  }, [isEditMode, setImages, setTags, setSpecifications, setOldImages, setCurentCreateLocale, setisSubmited, setValue]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories({ type: "product", lang: locale });
        const rawCategories = Array.isArray(res.data?.data?.data)
          ? res.data.data.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : Array.isArray(res.data)
              ? res.data
              : [];

        const formattedCategories = rawCategories.map((cat) => ({
          id: cat._id || cat.id,
          name: cat.name,
          icon: cat.icon,
          subcategories: (cat.subCategories || cat.subcategories || []).map((sub) => ({
            id: sub._id || sub.id,
            name: sub.name,
          })),
        }));
        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        addNotification({
          type: "warning",
          message: "Failed to load categories",
        });
      }
    };
    fetchCategories();
  }, [addNotification, locale]);

  useEffect(() => {
    if (!productCategoryId || !categories.length) return;
    if (selectedCategory?.id === productCategoryId && selectedCategory?.name) return;

    const matchedCategory = categories.find((cat) => cat.id === productCategoryId);
    if (matchedCategory) {
      setSelectedCategory(matchedCategory);
    }
  }, [categories, productCategoryId, selectedCategory]);

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
        console.log("API Response:", res.data); // تحقق من صيغة البيانات
        
        // معالجة صيغ متعددة للبيانات من API
        const product = res.data?.data?.data || res.data?.data || res.data?.product || res.data;

        if (!product) {
          throw new Error("Product not found");
        }

        // Set translations
        const translations = product.translations || {};
        setTranslations({
          EN: {
            title: translations.EN?.name || translations.en?.name || product.name || "",
            description: translations.EN?.desc || translations.en?.desc || product.desc || product.description || "",
          },
          AR: {
            title: translations.AR?.name || translations.ar?.name || product.name || "",
            description: translations.AR?.desc || translations.ar?.desc || product.desc || product.description || "",
          },
        });

        // Set form values for non-translated fields
        setValue("stock", product.quantity || product.stock || 0);
        setValue("price", product.price || 0);
        setValue("sale", product.discount || product.sale || "");

        // Set category
        if (product.category) {
          const categoryId = typeof product.category === 'string'
            ? product.category
            : (product.category._id || product.category.id);

          setProductCategoryId(categoryId);

          // Find the category from the fetched categories list
          const matchedCategory = categories.find((cat) => cat.id === categoryId);

          if (matchedCategory) {
            setSelectedCategory(matchedCategory);
          } else {
            setSelectedCategory({
              id: categoryId,
              name: typeof product.category === 'object' ? product.category.name || "" : "",
            });
          }
        }

        // Set images
        if (product.imgs && product.imgs.length > 0) {
          setImages(product.imgs);
          setOldImages(product.imgs);
        }

        // Set tags - handle string JSON or array
        if (product.tags) {
          try {
            const parsedTags = typeof product.tags === 'string' 
              ? JSON.parse(product.tags) 
              : product.tags;
            if (Array.isArray(parsedTags)) {
              setTags(parsedTags);
              console.log("Tags loaded:", parsedTags);
            }
          } catch (error) {
            console.error("Error parsing tags:", error);
          }
        }

        // Set specifications - convert object to array
        if (product.specifications && Object.keys(product.specifications).length > 0) {
          const specsArray = Object.entries(product.specifications).map(
            ([key, value]) => ({ key, value })
          );
          setSpecifications(specsArray);
          console.log("Specifications loaded:", specsArray);
        }

        console.log("Product loaded successfully:", product);
      } catch (err) {
        console.error("Error fetching product:", err);
        addNotification({
          type: "warning",
          message: err.response?.data?.message || "Something went wrong ❌",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [editId, addNotification, setImages, setValue, categories, setTags, setSpecifications]);

  const onSubmit = async (data) => {
    setisSubmited(true);

    // Validate translations
    if (!translations.EN.title?.trim()) {
      addNotification({
        type: "warning",
        message: "English title is required",
      });
      return;
    }
    if (!translations.AR.title?.trim()) {
      addNotification({
        type: "warning",
        message: "Arabic title is required",
      });
      return;
    }

// Validate category selection
      if (!selectedCategory) {
        addNotification({
          type: "warning",
          message: "Please choose a category",
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
      const translationsPayload = {
        EN: {
          name: translations.EN.title,
          desc: translations.EN.description || "",
        },
        AR: {
          name: translations.AR.title,
          desc: translations.AR.description || "",
        },
      };

      // Add basic data
      formData.append("name", translationsPayload.EN.name || translationsPayload.AR.name);
      formData.append("desc", translationsPayload.EN.desc || translationsPayload.AR.desc || "");
      formData.append("price", data.price);
      if (data.sale) formData.append("discount", data.sale);
      formData.append("quantity", data.stock);
      formData.append("category", selectedCategory.id || selectedCategory.value);
      formData.append("translations", JSON.stringify(translationsPayload));

      if (tags?.length > 0) {
        formData.append("tags", JSON.stringify(tags));
      }
      if (specifications?.length > 0) {
        const specsPayload = specifications.reduce((acc, item) => {
          if (item.key?.trim() && item.value?.trim()) {
            acc[item.key.trim()] = item.value.trim();
          }
          return acc;
        }, {});

        if (Object.keys(specsPayload).length > 0) {
          formData.append("specifications", JSON.stringify(specsPayload));
        }
      }

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

        // Add new images using same field name as create
        images.forEach((image) => {
          if (image instanceof File) {
            formData.append("imgs", image);
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

        <FormLangSwitch
          curentCreateLocale={curentCreateLocale}
          setCurentCreateLocale={setCurentCreateLocale}
          loadingSubmit={loading}
          editId={isEditMode}
          submitLabel={isEditMode ? t.dashboard.forms.editProduct : t.dashboard.forms.createProduct}
        />

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
            {isEditMode
              ? t.dashboard.forms.editProduct
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
