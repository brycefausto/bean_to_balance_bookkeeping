import _ from "lodash";

export function createCRUDMessage(
  dataName: string,
  crudType: "create" | "get" | "find" | "update" | "delete",
  resultType: "success" | "failed" | "not found",
  message?: string
) {
  let crudMessage = "";
  if (resultType == "success") {
    const capitalizedDataName = _.startCase(dataName);
    const crudAction = ["create", "update", "delete"].includes(crudType)
      ? crudType + "d"
      : crudType;
    crudMessage = `${capitalizedDataName} ${crudAction} successfully`;
  } else if (resultType == "not found") {
    const capitalizedDataName = _.startCase(dataName);
    crudMessage = `${capitalizedDataName} not found`;
  } else {
    crudMessage = `Failed to ${crudType} ${dataName}`;
  }
  return crudMessage + (message ? `. ${message}.` : "");
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "PHP",
  }).format(price);
}
