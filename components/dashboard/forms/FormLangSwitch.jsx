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
        </div>
  )
}

export default FormLangSwitch