import React from "react";
import { IoClose } from "react-icons/io5";
import { CircleAlert } from "lucide-react";
import { forms } from "@/Contexts/forms";
import { useContext } from "react";
import useTranslate from "@/Contexts/useTranslation";

function Specs({ locale = "EN" }) {
  const t = useTranslate();
  const activeLocale = String(locale || "EN").toUpperCase();

  const { specifications, setSpecifications, compsErrors, updateCompsError } =
    useContext(forms);

  const currentSpecs = Array.isArray(specifications)
    ? specifications
    : specifications?.[activeLocale] || [];

  const updateLocaleSpecs = (newList) => {
    if (Array.isArray(specifications)) {
      setSpecifications({
        EN: activeLocale === "EN" ? newList : specifications,
        AR: activeLocale === "AR" ? newList : [],
      });
    } else {
      setSpecifications({
        ...specifications,
        [activeLocale]: newList,
      });
    }
  };

  const addSpecification = () => {
    for (let s of currentSpecs) {
      if (
        !s.key.trim() ||
        !s.value.trim() ||
        s.key.trim().length < 2 ||
        s.value.trim().length < 2
      ) {
        updateCompsError(
          "specs",
          activeLocale === "AR"
            ? "يرجى إكمال المواصفات الحالية قبل إضافة جديدة"
            : "Complete the existing specifications before adding a new one"
        );
        return;
      }
    }

    updateCompsError("specs", "");
    updateLocaleSpecs([...currentSpecs, { key: "", value: "" }]);
  };

  const removeSpecs = (index) => {
    updateLocaleSpecs(currentSpecs.filter((_, i) => i !== index));
    updateCompsError("specs", "");
  };

  const updateSpec = (index, field, value) => {
    const updated = [...currentSpecs];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    updateLocaleSpecs(updated);
  };

  return (
    <div className="box forInput">
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <label>{t.dashboard.forms.specifications}</label>
        <span className="lang-badge">({activeLocale})</span>
      </div>

      <ul className="spec-list">
        {currentSpecs?.map((spec, i) => (
          <li className="spec-item" key={i}>
            <input
              type="text"
              placeholder={
                activeLocale === "AR"
                  ? "الخاصية (مثال: الخامة)"
                  : t.dashboard.forms.specKey || "Key"
              }
              value={spec.key}
              onChange={(e) => updateSpec(i, "key", e.target.value)}
            />
            <input
              type="text"
              placeholder={
                activeLocale === "AR"
                  ? "القيمة (مثال: فخار طبيعي)"
                  : t.dashboard.forms.specValue || "Value"
              }
              value={spec.value}
              onChange={(e) => updateSpec(i, "value", e.target.value)}
            />
            <IoClose onClick={() => removeSpecs(i)} />
          </li>
        ))}

        {compsErrors.specs && (
          <span className="error">
            <CircleAlert />
            {compsErrors.specs}
          </span>
        )}

        <button
          type="button"
          className="main-button for-specs"
          onClick={addSpecification}
        >
          {t.dashboard.forms.addSpecification} ({activeLocale})
        </button>
      </ul>
    </div>
  );
}

export default Specs;
