import {
  isAuthError,
  isAuthSessionMissingError,
} from "@supabase/supabase-js";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: "Nesprávny e-mail alebo heslo",
  email_not_confirmed:
    "E-mail ešte nie je potvrdený. Skontrolujte svoju schránku.",
  user_already_exists: "Účet s týmto e-mailom už existuje",
  email_exists: "Účet s týmto e-mailom už existuje",
  weak_password: "Heslo je príliš slabé",
  same_password: "Nové heslo musí byť iné ako pôvodné",
  over_email_send_rate_limit:
    "Príliš veľa pokusov. Skúste to o chvíľu znova.",
  over_request_rate_limit: "Príliš veľa pokusov. Skúste to o chvíľu znova.",
  email_address_invalid: "Neplatná e-mailová adresa",
};

export function getAuthErrorMessage(error: unknown): string {
  if (isAuthSessionMissingError(error)) {
    return "Odkaz vypršal alebo je neplatný. Požiadajte o nové obnovenie hesla.";
  }

  if (!isAuthError(error) || !error.code) {
    return "Nastala chyba. Skúste to znova.";
  }

  return Object.prototype.hasOwnProperty.call(AUTH_ERROR_MESSAGES, error.code)
    ? AUTH_ERROR_MESSAGES[error.code]
    : "Nastala chyba. Skúste to znova.";
}
