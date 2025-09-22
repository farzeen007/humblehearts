import z from "zod";

const ukMobileRegex = new RegExp(
  /^(((\+44\s?7|07)(\s?\d{3}){2}\s?\d{3})|(((\+44)?\s?(\(0\))?\s?0?)\s?7\s?\d{3}\s?\d{6}))$/
);

// A regex for UK postal codes. It covers all standard formats like "SW1A 1AA", "PO16 7GZ", and "L1 8JQ".
const ukPostalCodeRegex = new RegExp(
  /^[A-Z]{1,2}[0-9R][0-9A-Z]?\s?[0-9][ABD-HJLNP-UW-Z]{2}$/i
);

export const studentSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      ukMobileRegex,
      "Phone must be a valid UK mobile number (e.g. +447912345678 or 07123456789)"
    ),

  secondEmail: z
    .string()
    .email("Invalid email address")
    .or(z.literal(""))
    .optional(),

  gender: z
    .string()
    .min(1, "Gender is required")
    .refine(
      (val) => ["Male", "Female", "Other", "Prefer not to say"].includes(val),
      "Gender must be Male, Female, Other, or Prefer not to say"
    ),

  dateOfBirth: z.string().min(1, "Date of birth is required"),

  nationality: z.string().min(1, "Nationality is required"),
  state: z.string().min(1, "State is required"),

  country: z
    .string()
    .refine(
      (value) =>
        value === "UK" ||
        ["England", "Scotland", "Wales", "Northern Ireland"].includes(value),
      "Country must be UK or one of its regions"
    ),

  city: z
    .string()
    .min(2, "City must be between 2 and 50 characters")
    .max(50, "City must be between 2 and 50 characters"),

  address: z.string().min(1, "Address is required"),

  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .regex(
      ukPostalCodeRegex,
      "Postal code must be a valid UK format (e.g. SW1A 1AA)"
    ),

  img: z.any().optional(),
  document: z.any().optional(),
  password: z.string().min(8, "Password must be atleast 8 charecters"),
});
