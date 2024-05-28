import {ConditionOption} from "~/shared/constants/ConditionOptions";

export function getKeyFromValue(options: ConditionOption[], value) {
  const option = options.find(option => option.value === value);
  return option?.label || null;
}
