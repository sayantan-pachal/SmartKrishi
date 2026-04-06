import { Leaf, Activity, Droplets, FlaskConical } from "lucide-react";

// ─── Field status options ─────────────────────────────────────────────────────
export const FIELD_STATUS_OPTIONS = [
  { value: "Healthy",          label: "Healthy" },
  { value: "Needs Water",      label: "Needs Water" },
  { value: "Needs Nutrients",  label: "Needs Nutrients" },
];

// ─── Status badge styles ──────────────────────────────────────────────────────
export const STATUS_STYLES = {
  Healthy: {
    badge:  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    label:  "Field is in good condition",
    icon:   "✅",
    action: "Maintain current irrigation schedule. Continue monitoring soil metrics regularly.",
  },
  default: {
    badge:  "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    label:  "Requires attention",
    icon:   "⚠️",
    action: "Check moisture levels and adjust irrigation. Consider nutrient supplementation if needed.",
  },
};

export const getStatusStyle = (status) =>
  STATUS_STYLES[status] ?? STATUS_STYLES.default;

// ─── Soil metric card definitions (for FieldCard + FieldModal) ────────────────
export const SOIL_METRIC_CARDS = [
  {
    key:       "moisture",
    label:     "Moisture",
    icon:      Droplets,
    iconColor: "text-blue-500",
    bg:        "bg-blue-50",
    darkBg:    "dark:bg-blue-900/10",
    iconClass: "text-blue-600 dark:text-blue-400",
  },
  {
    key:       "ph",
    label:     "Soil pH",
    icon:      FlaskConical,
    iconColor: "text-purple-500",
    bg:        "bg-purple-50",
    darkBg:    "dark:bg-purple-900/10",
    iconClass: "text-purple-600 dark:text-purple-400",
  },
];

// ─── NPK card definitions (for FieldModal detail view) ───────────────────────
export const NPK_CARDS = [
  {
    key:       "nitrogen",
    label:     "Nitrogen (N)",
    icon:      Leaf,
    iconColor: "text-green-500",
    bg:        "bg-green-50",
  },
  {
    key:       "phosphorus",
    label:     "Phosphorus (P)",
    icon:      Activity,
    iconColor: "text-orange-500",
    bg:        "bg-orange-50",
  },
  {
    key:       "potassium",
    label:     "Potassium (K)",
    icon:      Droplets,
    iconColor: "text-pink-500",
    bg:        "bg-pink-50",
  },
];

// ─── Form field definitions ───────────────────────────────────────────────────
export const FORM_REQUIRED_FIELDS = ["name", "size", "crop"];

export const FORM_FIELD_GROUPS = [
  {
    heading: null,
    fields: [
      {
        name:        "name",
        label:       "Field Name",
        type:        "text",
        placeholder: "e.g., North Paddy Field",
        required:    true,
        colSpan:     2,
      },
    ],
  },
  {
    heading: null,
    fields: [
      {
        name:        "size",
        label:       "Size (Acres)",
        type:        "number",
        placeholder: "e.g., 2.5",
        step:        "0.1",
        required:    true,
        colSpan:     1,
      },
      {
        name:        "crop",
        label:       "Crop Type",
        type:        "text",
        placeholder: "e.g., Rice",
        required:    true,
        colSpan:     1,
      },
    ],
  },
  {
    heading: "Soil Metrics",
    fields: [
      {
        name:        "moisture",
        label:       "Moisture (%)",
        type:        "text",
        placeholder: "e.g., 45%",
        required:    false,
        colSpan:     1,
      },
      {
        name:        "ph",
        label:       "Soil pH",
        type:        "text",
        placeholder: "e.g., 6.5",
        required:    false,
        colSpan:     1,
      },
    ],
  },
  {
    heading: "NPK Analysis",
    fields: [
      {
        name:        "nitrogen",
        label:       "Nitrogen (mg/kg)",
        type:        "text",
        placeholder: "e.g., 250",
        required:    false,
        colSpan:     1,
      },
      {
        name:        "phosphorus",
        label:       "Phosphorus (mg/kg)",
        type:        "text",
        placeholder: "e.g., 30",
        required:    false,
        colSpan:     1,
      },
      {
        name:        "potassium",
        label:       "Potassium (mg/kg)",
        type:        "text",
        placeholder: "e.g., 150",
        required:    false,
        colSpan:     1,
      },
    ],
  },
];

// ─── Default (empty) form state ───────────────────────────────────────────────
export const DEFAULT_FORM_DATA = {
  name:        "",
  size:        "",
  crop:        "",
  moisture:    "",
  ph:          "",
  nitrogen:    "",
  phosphorus:  "",
  potassium:   "",
  status:      "Healthy",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Validate the add/edit field form.
 * Returns an object of field → error message (empty = valid).
 */
export function validateFieldForm(formData) {
  const errors = {};
  if (!formData.name.trim())  errors.name = "Field name is required.";
  if (!formData.size.trim())  errors.size = "Size is required.";
  if (!formData.crop.trim())  errors.crop = "Crop type is required.";
  return errors;
}

/**
 * Build the Appwrite document payload from raw form data.
 */
export function buildFieldPayload(formData, userId = null) {
  const payload = {
    name:        formData.name,
    size:        `${formData.size} Acres`,
    crop:        formData.crop,
    moisture:    formData.moisture,
    ph:          formData.ph,
    nitrogen:    formData.nitrogen,
    phosphorus:  formData.phosphorus,
    potassium:   formData.potassium,
    status:      formData.status,
  };
  if (userId) payload.userId = userId;
  return payload;
}

/**
 * Prepare form data from an existing Appwrite field document (for editing).
 */
export function fieldDocToFormData(doc) {
  return {
    name:        doc.name ?? "",
    size:        doc.size ? doc.size.replace(" Acres", "") : "",
    crop:        doc.crop ?? "",
    moisture:    doc.moisture ?? "",
    ph:          doc.ph ?? "",
    nitrogen:    doc.nitrogen ?? "",
    phosphorus:  doc.phosphorus ?? "",
    potassium:   doc.potassium ?? "",
    status:      doc.status ?? "Healthy",
  };
}

/**
 * Filter fields by search term (name or crop).
 */
export function filterFields(fields, searchTerm) {
  const q = searchTerm.toLowerCase();
  return fields.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.crop.toLowerCase().includes(q)
  );
}

/**
 * Format a date string as "Jan 1, 2025".
 */
export function formatFieldDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });
}