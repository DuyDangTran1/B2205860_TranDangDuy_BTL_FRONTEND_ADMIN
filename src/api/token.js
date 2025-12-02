export const refreshToken = async () => {
  try {
    const refreshRes = await fetch("http://localhost:3000/api/refresh", {
      method: "GET",
      credentials: "include",
    });
    const refreshData = await refreshRes.json();

    if (refreshData.message === "oke") {
      sessionStorage.setItem("accessToken", refreshData.accessToken);
      return refreshData.message;
    }

    return refreshData.message;
  } catch (error) {
    console.log(error);
  }
};
