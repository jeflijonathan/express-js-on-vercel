interface Props {
  fieldname?: string;
  value: string | number | boolean | undefined;
}

const buildStatusFilter = (
  fieldname: string,
  value: string | number | boolean | undefined
) => {
  const statusStr = String(value);

  if (["true", "1", 1].includes(statusStr)) {
    return { [fieldname]: true };
  }

  if (["false", "0", 1].includes(statusStr)) {
    return { [fieldname]: false };
  }

  return { [fieldname]: undefined };
};
export default buildStatusFilter;
