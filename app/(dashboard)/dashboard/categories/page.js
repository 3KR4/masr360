"use client";

import React, { useContext, useMemo, useState } from "react";
import { CircleAlert, Layers2, PencilLine, Plus, Shapes, Trash2, X } from "lucide-react";
import { mainContext } from "@/Contexts/mainContext";
import { useNotification } from "@/Contexts/NotificationContext";
import useTranslate from "@/Contexts/useTranslation";
import {
  create,
  remove,
  update,
} from "@/services/categories/categories.service";
import "@/styles/dashboard/categories-manager.css";

const TYPE_CONFIG = [
  { key: "place", label: "Places", icon: Layers2 },
  { key: "night", label: "Nights", icon: Shapes },
  { key: "product", label: "Products", icon: Layers2 },
];

const EMPTY_FORM = {
  _id: null,
  mode: "create",
  type: "place",
  parent: null,
  icon: "",
  EN: { name: "" },
  AR: { name: "" },
};

function getCategoryName(category, locale) {
  const localeKey = String(locale || "EN").toUpperCase();
  return (
    category?.translations?.[localeKey]?.name ||
    category?.name ||
    category?.translations?.EN?.name ||
    category?.translations?.AR?.name ||
    ""
  );
}

function CategoryIcon({ icon, className = "" }) {
  return (
    <span className={`category-icon-fallback ${className}`.trim()}>
      {icon || "?"}
    </span>
  );
}

function buildFormState(item, type, parent = null) {
  if (!item) {
    return {
      ...EMPTY_FORM,
      type,
      parent,
    };
  }

  return {
    _id: item._id,
    mode: "edit",
    type,
    parent: item.parent || parent?._id || null,
    icon: item.icon || "",
    EN: {
      name: item?.translations?.EN?.name || item?.name || "",
    },
    AR: {
      name: item?.translations?.AR?.name || item?.name || "",
    },
  };
}

export default function CategoriesManagerPage() {
  const {
    categoriesByType,
    locale,
    referenceDataLoading,
    refreshReferenceData,
  } = useContext(mainContext);
  const { addNotification } = useNotification();
  const t = useTranslate();
  const [formState, setFormState] = useState(EMPTY_FORM);
  const [editorOpen, setEditorOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [errors, setErrors] = useState({});

  const sections = useMemo(
    () =>
      TYPE_CONFIG.map((section) => ({
        ...section,
        items: categoriesByType?.[section.key] || [],
      })),
    [categoriesByType],
  );

  const currentTitle =
    formState.mode === "edit"
      ? "Edit Category"
      : formState.parent
        ? "Create Subcategory"
        : "Create Category";

  const resetForm = () => {
    setFormState(EMPTY_FORM);
    setErrors({});
    setEditorOpen(false);
  };

  const openCreate = (type, parent = null) => {
    setFormState(buildFormState(null, type, parent?._id || null));
    setErrors({});
    setEditorOpen(true);
  };

  const openEdit = (item, type, parent = null) => {
    setFormState(buildFormState(item, type, parent));
    setErrors({});
    setEditorOpen(true);
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formState.EN.name.trim()) {
      nextErrors.enName = "English name is required";
    }

    if (!formState.AR.name.trim()) {
      nextErrors.arName = "Arabic name is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: formState.EN.name.trim(),
        type: formState.type,
        translations: {
          EN: { name: formState.EN.name.trim() },
          AR: { name: formState.AR.name.trim() },
        },
      };

      if (formState.icon.trim()) {
        payload.icon = formState.icon.trim();
      }

      if (formState.parent) {
        payload.parent = formState.parent;
      }

      if (formState.mode === "edit" && formState._id) {
        await update(formState._id, payload);
        addNotification({
          type: "success",
          message: "Category updated successfully",
        });
      } else {
        await create(payload);
        addNotification({
          type: "success",
          message: "Category created successfully",
        });
      }

      await refreshReferenceData();
      resetForm();
    } catch (error) {
      addNotification({
        type: "warning",
        message: error.response?.data?.message || "Failed to save category",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (itemId) => {
    setDeletingId(itemId);
    try {
      await remove(itemId);
      await refreshReferenceData();
      addNotification({
        type: "success",
        message: "Category deleted successfully",
      });

      if (formState._id === itemId) {
        resetForm();
      }
    } catch (error) {
      addNotification({
        type: "warning",
        message: error.response?.data?.message || "Failed to delete category",
      });
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="body categories-admin-page">
      <div className="categories-admin-layout">
        <div className="categories-grid-holder">
          {sections.map((section) => {
            const SectionIcon = section.icon;
            return (
              <section key={section.key} className="category-type-panel">
                <div className="category-type-header">
                  <div className="title-wrap">
                    <span className="icon-wrap">
                      <SectionIcon size={18} />
                    </span>
                    <div>
                      <h2>{section.label}</h2>
                      <p>{section.items.length} root categories</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="ghost-action"
                    onClick={() => openCreate(section.key)}
                  >
                    <Plus size={15} />
                    Add root category
                  </button>
                </div>

                <div className="category-card-list">
                  {section.items.length ? (
                    section.items.map((item) => (
                      <article key={item._id} className="category-card">
                        <div className="category-card-top">
                          <div className="root-category-content">
                            <CategoryIcon
                              icon={item.icon}
                              className="subcategory-icon root-category-icon"
                            />
                            <div className="category-copy">
                              <h3>{getCategoryName(item, locale)}</h3>
                              <p>{item?.translations?.AR?.name || "No Arabic title"}</p>
                            </div>
                          </div>

                          <div className="hover-actions">
                            <button
                              type="button"
                              className="icon-button"
                              onClick={() => openEdit(item, section.key)}
                            >
                              <PencilLine size={15} />
                            </button>
                            <button
                              type="button"
                              className="icon-button danger"
                              onClick={() => handleDelete(item._id)}
                              disabled={deletingId === item._id}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        <div className="subcategory-strip">
                          {(item.subCategories || []).length ? (
                            item.subCategories.map((sub) => (
                              <div key={sub._id} className="subcategory-pill">
                                <div className="subcategory-content">
                                  <CategoryIcon
                                    icon={sub.icon}
                                    className="subcategory-icon"
                                  />

                                  <div className="subcategory-copy">
                                    <strong>{getCategoryName(sub, locale)}</strong>
                                    <span>{sub?.translations?.AR?.name || "AR"}</span>
                                  </div>
                                </div>

                                <div className="pill-actions">
                                  <button
                                    type="button"
                                    className="icon-button"
                                    onClick={() => openEdit(sub, section.key, item)}
                                  >
                                    <PencilLine size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    className="icon-button danger"
                                    onClick={() => handleDelete(sub._id)}
                                    disabled={deletingId === sub._id}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="empty-subcategories">
                              No subcategories yet
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          className="inline-add"
                          onClick={() => openCreate(section.key, item)}
                        >
                          <Plus size={14} />
                          Add subcategory
                        </button>
                      </article>
                    ))
                  ) : (
                    <div className="empty-state-card">
                      <p>No categories created yet for {section.label.toLowerCase()}.</p>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {editorOpen ? (
        <div className="category-editor-overlay" onClick={resetForm}>
          <aside
            className="category-editor-panel modal-open"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="editor-head">
              <div>
                <h2>{currentTitle}</h2>
              </div>

              <button
                type="button"
                className="icon-button"
                onClick={resetForm}
                aria-label="Close editor"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="category-editor-form">
              <div className="editor-grid">
                <label className="editor-field">
                  <span>Type</span>
                  <input value={formState.type} disabled />
                </label>

                <label className="editor-field">
                  <span>Icon</span>
                  <input
                    value={formState.icon}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, icon: e.target.value }))
                    }
                    placeholder="Optional icon text"
                  />
                </label>
              </div>

              <div className="editor-grid bilingual-grid">
                <label className="editor-field">
                  <span>English Name</span>
                  <input
                    value={formState.EN.name}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        EN: { ...prev.EN, name: e.target.value },
                      }))
                    }
                    placeholder="Enter English category name"
                  />
                  {errors.enName ? (
                    <small className="field-error">
                      <CircleAlert size={14} />
                      {errors.enName}
                    </small>
                  ) : null}
                </label>

                <label className="editor-field">
                  <span>Arabic Name</span>
                  <input
                    value={formState.AR.name}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        AR: { ...prev.AR, name: e.target.value },
                      }))
                    }
                    placeholder="Enter Arabic category name"
                  />
                  {errors.arName ? (
                    <small className="field-error">
                      <CircleAlert size={14} />
                      {errors.arName}
                    </small>
                  ) : null}
                </label>
              </div>

              <div className="editor-actions">
                <button
                  type="button"
                  className="ghost-action wide"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button type="submit" className="main-button" disabled={submitting} style={{ width: "100%"}}>
                  {submitting ? "Saving..." : formState.mode === "edit" ? "Update" : "Create"}
                </button>
              </div>
            </form>

            {referenceDataLoading ? (
              <div className="panel-note">Refreshing shared reference data...</div>
            ) : null}
          </aside>
        </div>
      ) : null}
    </div>
  );
}
