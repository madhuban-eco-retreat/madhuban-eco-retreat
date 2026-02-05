const serverUrl = "https://admin-backend-prod-xvpb.onrender.com";

export const getAllBlogs = async (pageCount, limit) => {
  try {
    const res = await fetch(
      `${serverUrl}/api/blogs/all/madhubhan?type=blog&status=Published&page=${pageCount}&limit=${limit}`,
      { next: { revalidate: 3600 }, cache: "force-cache" },
    ).then((response) => response.json());
    return res;
  } catch (err) {
    console.error("Error fetching blogs:", err);
    return null;
  }
};

export const getBlogById = async (id) => {
  try {
    const res = await fetch(`${serverUrl}/api/blogs/${id}/madhubhan`, {
      next: { revalidate: 3600 },
      cache: "force-cache",
    }).then((response) => response.json());
    return res;
  } catch (err) {
    console.error("Error fetching blog by ID:", err);
    return null;
  }
};
