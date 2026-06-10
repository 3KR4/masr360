"use client";

import React, { useContext, useEffect, useState } from "react";
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
import useTranslate from "@/Contexts/useTranslation";
import { useRouter, useSearchParams } from "next/navigation";
import { useNotification } from "@/Contexts/NotificationContext";
import FormLangSwitch from "@/components/dashboard/forms/FormLangSwitch";
import { mainContext } from "@/Contexts/mainContext";

function unwrapProductGetOneResponse(data) {
  return data?.data?.data || data?.data || data?.product || data;
}

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

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [productCategoryId, setProductCategoryId] = useState(null);
  const [productSubCategoryId, setProductSubCategoryId] = useState(null);
  const [translations, setTranslations] = useState({
    EN: { title: "", description: "" },
    AR: { title: "", description: "" },
  });
  const [translationErrors, setTranslationErrors] = useState({});

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { locale, productCategories, referenceDataLoading } =
    useContext(mainContext);
  const subCategories = selectedCategory?.subcategories || [];

  useEffect(() => {
    if (isEditMode) return;

    setTranslations({
      EN: { title: "", description: "" },
      AR: { title: "", description: "" },
    });
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setProductCategoryId(null);
    setProductSubCategoryId(null);
    setImages([]);
    setTags([]);
    setSpecifications([]);
    setOldImages([]);
    setCurentCreateLocale("EN");
    setisSubmited(false);
    setTranslationErrors({});
    updateCompsInput?.("tags", "");
    updateCompsError?.("tags", "");
    updateCompsError?.("specs", "");
    setValue("stock", 0);
    setValue("price", 0);
    setValue("sale", "");
  }, [isEditMode]);

  useEffect(() => {
    const localeKey = String(locale || "EN").toUpperCase();
    const formattedCategories = (productCategories || []).map((cat) => ({
      id: cat._id || cat.id,
      name: cat.translations?.[localeKey]?.name || cat.name,
      icon: cat.icon,
      subcategories: (cat.subCategories || cat.subcategories || []).map((sub) => ({
        id: sub._id || sub.id,
        name: sub.translations?.[localeKey]?.name || sub.name,
      })),
    }));
    setCategories(formattedCategories);
  }, [locale, productCategories]);

  useEffect(() => {
    if (!productCategoryId || !categories.length) return;
    if (selectedCategory?.id === productCategoryId && selectedCategory?.name) return;

    const matchedCategory = categories.find((cat) => cat.id === productCategoryId);
    if (matchedCategory) {
      setSelectedCategory(matchedCategory);
    }
  }, [categories, productCategoryId, selectedCategory]);

  useEffect(() => {
    if (!productSubCategoryId || !selectedCategory?.subcategories?.length) return;
    if (selectedSubCategory?.id === productSubCategoryId) return;

    const matchedSubCategory = selectedCategory.subcategories.find(
      (sub) => sub.id === productSubCategoryId,
    );
    if (matchedSubCategory) {
      setSelectedSubCategory(matchedSubCategory);
    }
  }, [productSubCategoryId, selectedCategory, selectedSubCategory]);

  const handleTranslationChange = (field, value) => {
    setTranslations((prev) => ({
      ...prev,
      [curentCreateLocale]: {
        ...prev[curentCreateLocale],
        [field]: value,
      },
    }));
    setTranslationErrors((prev) => ({
      ...prev,
      [`${curentCreateLocale}.${field}`]: null,
    }));
  };

  useEffect(() => {
    if (!editId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getOne(editId);
        const product = unwrapProductGetOneResponse(res.data);

        if (!product) {
          throw new Error("Product not found");
        }

        const productTranslations = product.translations || {};
        setTranslations({
          EN: {
            title:
              productTranslations.EN?.name ||
              productTranslations.en?.name ||
              product.name ||
              "",
            description:
              productTranslations.EN?.desc ||
              productTranslations.en?.desc ||
              product.desc ||
              product.description ||
              "",
          },
          AR: {
            title:
              productTranslations.AR?.name ||
              productTranslations.ar?.name ||
              product.name ||
              "",
            description:
              productTranslations.AR?.desc ||
              productTranslations.ar?.desc ||
              product.desc ||
              product.description ||
              "",
          },
        });

        setValue("stock", product.quantity || product.stock || 0);
        setValue("price", product.price || 0);
        setValue("sale", product.discount || product.sale || "");

        if (product.category) {
          const categoryId =
            typeof product.category === "string"
              ? product.category
              : (product.category._id || product.category.id);

          setProductCategoryId(categoryId);

          const matchedCategory = categories.find((cat) => cat.id === categoryId);
          if (matchedCategory) {
            setSelectedCategory(matchedCategory);
          } else {
            setSelectedCategory({
              id: categoryId,
              name:
                typeof product.category === "object" ? product.category.name || "" : "",
            });
          }
        }

        if (product.subCategory) {
          const subCategoryId =
            typeof product.subCategory === "string"
              ? product.subCategory
              : (product.subCategory._id || product.subCategory.id);
          setProductSubCategoryId(subCategoryId);
        }

        const existingImages = Array.isArray(product.imgs)
          ? product.imgs
          : product.img
            ? [product.img]
            : [];

        if (existingImages.length) {
          setImages(existingImages);
          setOldImages(existingImages);
        }

        if (product.tags) {
          try {
            const parsedTags =
              typeof product.tags === "string"
                ? JSON.parse(product.tags)
                : product.tags;
            if (Array.isArray(parsedTags)) {
              setTags(parsedTags);
            }
          } catch (error) {
            console.error("Error parsing tags:", error);
          }
        }

        if (
          product.specifications &&
          typeof product.specifications === "object" &&
          Object.keys(product.specifications).length > 0
        ) {
          const specsArray = Object.entries(product.specifications).map(
            ([key, value]) => ({ key, value: String(value) }),
          );
          setSpecifications(specsArray);
        }
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
  }, [editId, addNotification, categories, setImages, setSpecifications, setTags, setValue]);

  const onSubmit = async (data) => {
    setisSubmited(true);

    const validationErrors = {};
    if (!translations.EN.title?.trim()) {
      validationErrors["EN.title"] = "English title is required";
    }
    if (!translations.AR.title?.trim()) {
      validationErrors["AR.title"] = "Arabic title is required";
    }
    if (!translations.EN.description?.trim()) {
      validationErrors["EN.description"] =
        t.dashboard.forms.errors.descriptionRequired || "Description is required";
    }
    if (!translations.AR.description?.trim()) {
      validationErrors["AR.description"] =
        t.dashboard.forms.errors.descriptionRequired || "Description is required";
    }

    if (Object.keys(validationErrors).length) {
      setTranslationErrors(validationErrors);
      return;
    }

    if (!selectedCategory) {
      addNotification({
        type: "warning",
        message: "Please choose a category",
      });
      return;
    }

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

      formData.append(
        "name",
        translationsPayload.EN.name || translationsPayload.AR.name,
      );
      formData.append(
        "desc",
        translationsPayload.EN.desc || translationsPayload.AR.desc || "",
      );
      formData.append("price", data.price);
      if (data.sale) formData.append("discount", data.sale);
      formData.append("quantity", data.stock);
      formData.append("category", selectedCategory.id || selectedCategory.value);
      if (selectedSubCategory?.id) {
        formData.append("subCategory", selectedSubCategory.id);
      }
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

      if (editId) {
        const currentImagePublicIds = new Set(
          images
            .filter((img) => !(img instanceof File) && img.publicId)
            .map((img) => img.publicId),
        );
        const removedImages = oldImages.filter(
          (image) => image?.publicId && !currentImagePublicIds.has(image.publicId),
        );

        if (removedImages.length) {
          await Promise.all(
            removedImages.map((image) =>
              removeImage(image.publicId, "product", editId),
            ),
          );
        }
      }

      images.forEach((image) => {
        if (image instanceof File) {
          formData.append("imgs", image);
        }
      });

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
        <div className="row-holder">
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
                  onChange={(e) => handleTranslationChange("title", e.target.value)}
                />
              </div>
              {translationErrors[`${curentCreateLocale}.title`] && (
                <span className="error">
                  <CircleAlert />
                  {translationErrors[`${curentCreateLocale}.title`]}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="row-holder two-column">
          <SelectOptions
            label={t.dashboard.forms.category}
            placeholder={t.dashboard.forms.categoryPlaceholder}
            options={categories.map((cat) => ({
              ...cat,
              subcategories: undefined,
              _subcategories: cat.subcategories,
            }))}
            value={selectedCategory}
            loading={referenceDataLoading}
            onChange={(cat) => {
              setSelectedCategory({ ...cat, subcategories: cat._subcategories });
              setSelectedSubCategory(null);
              setProductSubCategoryId(null);
            }}
          />

          <SelectOptions
            label={t.dashboard.forms.subCategory}
            placeholder={
              !selectedCategory
                ? t.dashboard.forms.selectSubCategory
                : subCategories.length > 0
                  ? t.dashboard.forms.selectSubCategory
                  : locale === "AR"
                    ? "لا توجد أقسام فرعية بعد"
                    : "No nested categories yet"
            }
            options={subCategories}
            value={selectedSubCategory}
            loading={referenceDataLoading}
            disabled={!selectedCategory || subCategories.length === 0}
            onChange={(sub) => setSelectedSubCategory(sub)}
          />
        </div>

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
            {translationErrors[`${curentCreateLocale}.description`] && (
              <span className="error">
                <CircleAlert />
                {translationErrors[`${curentCreateLocale}.description`]}
              </span>
            )}
          </div>
        </div>

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
          submitLabel={
            isEditMode
              ? t.dashboard.forms.editProduct
              : t.dashboard.forms.createProduct
          }
        />
      </form>
    </div>
  );
}

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
