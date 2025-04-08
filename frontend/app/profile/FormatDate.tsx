export const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  