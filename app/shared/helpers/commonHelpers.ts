
import { AppBridgeState, ClientApplication } from "@shopify/app-bridge";
import { Toast } from "@shopify/app-bridge/actions";
import { ToastOptions } from "~/types/types";
import { ConditionOption } from "../constants/ConditionOptions";

export function getKeyFromValue(options: ConditionOption[], value: string) {
  const option = options.find(option => option.value === value);
  return option?.label || null;
}

export function sendToastMessage (
  app: ClientApplication<AppBridgeState>,
  options: ToastOptions
) {
  const toast = Toast.create(app, options);
  toast.dispatch(Toast.Action.SHOW);
}
