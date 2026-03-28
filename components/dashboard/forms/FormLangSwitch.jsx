import React from 'react'
import useTranslate from '@/Contexts/useTranslation'

const FormLangSwitch = ({
  curentCreateLocale,
  setCurentCreateLocale,
  loadingSubmit,
  editId,
  submitLabel,
}) => {
  const t = useTranslate();
  const buttonLabel = submitLabel
    ? submitLabel
    : !editId
    ? t.dashboard.forms.createGovernorate
    : t.dashboard.forms.updateGovernorate;

  return (
     <div className="row-holder">
          <div className="lang-switch">
            {["EN", "AR"].map((lng) => (
              <button
                key={lng}
                type="button"
                className={curentCreateLocale === lng ? "active" : ""}
                onClick={() => setCurentCreateLocale(lng)}
              >
                {lng.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            className="main-button"
            type="submit"
            disabled={loadingSubmit}
          >
            <span
              className="loader"
              style={{ opacity: loadingSubmit ? "1" : "0" }}
            ></span>
            <span style={{ opacity: loadingSubmit ? "0" : "1" }}>
              {buttonLabel}
            </span>
          </button>
        </div>
  )
}

export default FormLangSwitch