import re
from django.core.exceptions import ValidationError


def normalize_phone(phone_str: str) -> str:
    """
    Cleans phone number:
    - Strips spaces, dashes, parentheses
    - Removes leading +91, 91 (if 12 digits), or 0 (if 11 digits)
    - Validates exactly 10 digits starting with 6, 7, 8, or 9
    """
    if not phone_str:
        return ""
    cleaned = re.sub(r'[\s\-\(\)]', '', str(phone_str).strip())
    if cleaned.startswith('+91'):
        cleaned = cleaned[3:]
    elif cleaned.startswith('91') and len(cleaned) == 12:
        cleaned = cleaned[2:]
    elif cleaned.startswith('0') and len(cleaned) == 11:
        cleaned = cleaned[1:]

    if not re.match(r'^[6-9]\d{9}$', cleaned):
        raise ValidationError('Phone number must be a valid 10-digit Indian mobile number.')
    return cleaned


def validate_gst(gst_str: str) -> str:
    if not gst_str:
        return ""
    val = gst_str.strip().upper()
    if not re.match(r'^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$', val):
        raise ValidationError('Invalid GST Number format (e.g. 22AAAAA0000A1Z5).')
    return val


def validate_fssai(fssai_str: str) -> str:
    if not fssai_str:
        return ""
    val = fssai_str.strip()
    if not re.match(r'^\d{14}$', val):
        raise ValidationError('FSSAI license number must be exactly 14 digits.')
    return val

