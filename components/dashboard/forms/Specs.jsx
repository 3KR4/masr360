import React from "react";
import { IoClose } from "react-icons/io5";
import { CircleAlert } from "lucide-react";
import { forms } from "@/Contexts/forms";
import { useContext } from "react";

function Specs() {
  const { specifications, setSpecifications, compsErrors, updateCompsError } =
    useContext(forms);

  const addSpecification = () => {
    // check if any existing spec is invalid
    for (let s of specifications) {
      if (
        !s.key.trim() ||
        !s.value.trim() ||
        s.key.trim().length < 3 ||
        s.value.trim().length < 3
      ) {
        updateCompsError(
          "specs",
          "complete the existing specifications before adding a new one"
        );
        return;
      }
    }

    updateCompsError("specs", "");
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const removeSpecs = (index) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
    updateCompsError("specs", "");
  };

  const updateSpec = (index, field, value) => {
    const updated = [...specifications];

    // check length
    if (value.trim().length > 0 && value.trim().length < 3) {
      updateCompsError(
        "specs",
        "specification key/value must be at least 3 characters"
      );
    } else {
      updateCompsError("specs", "");
    }

    updated[index][field] = value;
    setSpecifications(updated);
  };

  return (
    <div className="box forInput">
      <label>specifications</label>

      <ul className="spec-list">
        {specifications?.map((spec, i) => (
          <li className="spec-item" key={i}>
            <input
              type="text"
              placeholder="key"
              value={spec.key}
              onChange={(e) => updateSpec(i, "key", e.target.value)}
            />
            <input
              type="text"
              placeholder="value"
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
          Add specification
        </button>
      </ul>
    </div>
  );
}

export default Specs;
