/**
 * Calculates a character level from a birth date.
 * Level = age in full years (Korean-style: counts current calendar year differences
 * as an option, but defaults to international age in full years).
 *
 * @param birthDate - Date of birth (Date object or ISO date string)
 * @param referenceDate - Reference date to calculate age from (defaults to today)
 * @returns level number (minimum 1)
 */
export function getCharacterLevel(
  birthDate: Date | string,
  referenceDate: Date = new Date(),
): number {
  const birth = typeof birthDate === "string" ? new Date(birthDate) : birthDate;

  if (isNaN(birth.getTime())) {
    return 1;
  }

  const refYear  = referenceDate.getFullYear();
  const refMonth = referenceDate.getMonth();
  const refDay   = referenceDate.getDate();

  const birthYear  = birth.getFullYear();
  const birthMonth = birth.getMonth();
  const birthDay   = birth.getDate();

  let age = refYear - birthYear;

  // Subtract 1 if birthday hasn't occurred yet this year
  if (
    refMonth < birthMonth ||
    (refMonth === birthMonth && refDay < birthDay)
  ) {
    age -= 1;
  }

  // Level is at least 1
  return Math.max(1, age);
}

/**
 * Korean age (만나이 기준 아닌 세는나이):
 * Returns birth year difference + 1.
 * Provided as an alternative calculation if needed.
 *
 * @param birthDate - Date of birth
 * @param referenceDate - Reference date (defaults to today)
 */
export function getKoreanAge(
  birthDate: Date | string,
  referenceDate: Date = new Date(),
): number {
  const birth = typeof birthDate === "string" ? new Date(birthDate) : birthDate;

  if (isNaN(birth.getTime())) {
    return 1;
  }

  return referenceDate.getFullYear() - birth.getFullYear() + 1;
}
